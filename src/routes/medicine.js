import express from 'express';
import AddMedicine from '../api/AddMedicine.js';
import GetMedicineEdit from '../api/GetMedicineEdit.js';
import UpdateMedicine from '../api/UpdateMedicine.js';
import UploadPrescription from '../api/UploadPrescription.js';
import ViewPrescription from '../api/ViewPrescription.js';
import Checkout from '../api/Checkout.js';
import CheckOrder from '../api/CheckOrder.js';
import GetAllOrders from '../api/GetAllOrders.js';
import UpdateDeliveryStatus from '../api/UpdateDeliveryStatus.js';

var router = express.Router();

/* GET users listing. */
router.get('/', GetMedicineEdit);

router.post('/add', AddMedicine)
router.post('/upload-prescription', UploadPrescription)
router.post('/view-prescription', ViewPrescription)
router.post('/checkout', Checkout)
router.post('/checkorder', CheckOrder)
router.put('/update', UpdateMedicine)
router.put('/order/update-delivery-status', UpdateDeliveryStatus)
router.get('/orders', GetAllOrders)

export default router;
