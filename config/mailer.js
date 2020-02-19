const nodemailer = require('nodemailer');
require('dotenv').config()

const APP_HOST = 'http://localhost:3000' || process.env.APP_HOST

const user = process.env.MAIL_USER
const pass = process.env.MAIL_PASS

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user, pass }
});

module.exports.sendValidateEmail = (targetUser) => {
  transporter.sendMail({
    from: `"Football Clubs" <${user}>`,
    to: targetUser.email,
    subject: 'Welcome to Football Clubs!',
    html: `
      <h1>Welcome ${targetUser.fullName}</h1>
      <p><a href='${APP_HOST}/users/${targetUser.validationToken}/validate'>Confirm</a> your account</p>
    `
  })
    .then(info => console.log(info))
    .catch(error => console.log(error))
}