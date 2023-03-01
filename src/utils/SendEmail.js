import nodemailer from 'nodemailer';

const sendEmail = (toEmail, subject, mailBody) => {

    var transporter = nodemailer.createTransport({
        host: "smtp.office365.com",
        port: 587,
        auth: {
            user: process.env.AUTH_EMAIL,
            pass: process.env.AUTH_PASS
        },
        secureConnection: true,
        tls: { ciphers: 'SSLv3' }
    });
    var mailOptions = {
        from: process.env.AUTH_EMAIL,
        to: toEmail,
        subject: subject,
        html: mailBody
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            return false
        } else {
            return true
        }
    });

}
export default sendEmail;
