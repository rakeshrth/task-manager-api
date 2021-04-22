const nodemailer = require('nodemailer')

const PASSWORD= process.env.SOURCE_PASSWORD
const EMAIL= process.env.SOURCE_EMAIL

let transporter = nodemailer.createTransport({
    tls:{
        rejectUnauthorized: false
    },
    host: 'free.mboxhosting.com',
    secure: false,
    port: 587,
    auth: {
        user: EMAIL,
        pass: PASSWORD
    }
})


const sendWelcomeEmail = (email, name) => {
    let mailOptions = {
        from: 'rakeshrth@learningnodejs.xyz',
        to: email,
        subject: 'Welcome to Task-manager',
        text: `Welcome to the app, ${name}. Let me know hpw you get along with the app.`
    }
    transporter.sendMail(mailOptions, (err,data) => {
        if (err) {
            console.log("error sending", err)
        } else {
            console.log("mail.sent")
        }
    })
}

const sendCancelEmail = (email, name) => {
    let mailOptions = {
        from: 'rakeshrth@learningnodejs.xyz',
        to: email,
        subject: 'Account Cancellation, Task-manager',
        text: `We are sorry to see you leave the app, ${name}. Kindly let us know what we could have done to improve your user experience.`
    }
    transporter.sendMail(mailOptions, (err,data) => {
        if (err) {
            console.log("error sending", err)
        } else {
            console.log("mail.sent")
        }
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancelEmail
}