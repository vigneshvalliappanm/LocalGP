import asyncHandler from 'express-async-handler'
import jwt from 'jsonwebtoken';
import User from '../models/UserModels.js'
import Stripe from 'stripe';
import Order from '../models/OrderModel.js';
import sendEmail from '../utils/SendEmail.js';
import Medicine from '../models/MedicineModel.js';
import Prescription from '../models/PrescriptionModel.js';

// @desc    Checkout Order
// @route   GET /api/medicine/checkout
// @access  Public
const Checkout = asyncHandler(async (req, res) => {
  const stripe = new Stripe(process.env.STRIPE);
  const { totalPrice, stripeToken, appointmentId, OrderType, PrescriptionDetails } = req.body
  const token = req.headers['authorization']
  if (token == null) return res.status(401).send({ "error": 'Not Authorised. Try logging in again' })
  let current_email_id = null;
  jwt.verify(token, process.env.TOKEN_SECRET, (error, user_email_id) => {
    if (error) return res.status(403).send({ "error": 'Not Authorised. Try logging in again' })
    current_email_id = user_email_id.email_id
  })
  if (current_email_id !== null) {
    let user = await User.findOne({ email: current_email_id })
    let existingOrder = await Order.findOne({ appointmentId: appointmentId })
    if (user.role === 'patient') {
      if (existingOrder) res.status(400).send({ "error": "An order for the prescription has already been placed." })
      else {
        // try {
          const customer = await stripe.customers.create({
            email: stripeToken.email,
            source: stripeToken.id,
          })
          const charge = await stripe.charges.create({
            amount: totalPrice * 100,
            currency: 'gbp',
            customer: customer.id,
            receipt_email: stripeToken.email,
            description: `ordered the medicines`,
            shipping: {
              name: stripeToken.card.name,
              address: {
                line1: stripeToken.card.address_line1,
                line2: stripeToken.card.address_line2,
                city: stripeToken.card.address_city,
                country: stripeToken.card.address_country,
                postal_code: stripeToken.card.address_zip,
              },
            },
          })
          if (charge.status === "succeeded") {
            let mailSubject = "Your Order has been placed successfully"
            let mailBodyContent = "Your order has been placed successfully, and we are processing your order, and we will notify you once the order is out for delivery."
            let mailBody = "Hi " + stripeToken.card.name + ", <br\><br\>" + mailBodyContent + "<br\><br\> Regards, <br\> Site Admin"
            PrescriptionDetails.forEach(async (PrescriptionDetail, index) => {
              const medicineCount = await Medicine.findOne({ name: PrescriptionDetail.medicine_name }, 'available_stock')
              let availableCount = medicineCount.available_stock - PrescriptionDetail.quantity
              await Medicine.findOneAndUpdate({ name: PrescriptionDetail.medicine_name }, { available_stock: availableCount })
            });
            console.log(appointmentId)
            const createOrder = new Order({
              appointmentId: appointmentId,
              PatientEmail: current_email_id,
              amount: totalPrice * 100,
              shipping: {
                name: stripeToken.card.name,
                address: {
                  line1: charge.shipping.address.line1,
                  line2: charge.shipping.address.line2,
                  city: charge.shipping.address.city,
                  country: charge.shipping.address.country,
                  postalCode: charge.shipping.address.postal_code,
                },
              },
              deliveryStatus: "Order Recieved",
              OrderType: OrderType
            })
            console.log(createOrder)
            await createOrder.save()
            await sendEmail(stripeToken.email, mailSubject, mailBody)
            res.status(200).send({ "success": "The order has been placed successfully. Your medicines will be shipped shortly" })
          }
          else res.status(500).send({ "error": "An error was encountered while placing your order. No Amount was deducted. Please try again, and if the issue persist contact the admin." })
        // } catch (error) {
        //   res.status(400).send({ "actual_error": error, "error": "An error was encountered while placing your order. No Amount was deducted. Please try again, and if the issue persist contact the admin." })
        // }
      }
    }
    else return res.status(403).send({ "error": 'Not Authorised. Try logging in again' })
  }
  else return res.status(403).send({ "error": 'Not Authorised. Try logging in again' })

})
export default Checkout;
