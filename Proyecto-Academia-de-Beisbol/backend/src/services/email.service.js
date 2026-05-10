const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

async function enviarCorreo({ para, asunto, html }) {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn('[Email] EMAIL_USER o EMAIL_PASS no configurados, correo no enviado.')
    return
  }
  await transporter.sendMail({
    from: `"Liga Diamante" <${process.env.EMAIL_USER}>`,
    to: para,
    subject: asunto,
    html,
  })
}

module.exports = { enviarCorreo }
