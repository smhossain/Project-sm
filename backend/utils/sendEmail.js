const nodemailer = require('nodemailer')

async function sendEmail({ userEmail, subject, message }) {
  try {
    // Create a transporter using SMTP transport
    const transporter = nodemailer.createTransport({
      host: 'smtp.example.com',
      port: 587,
      secure: false,
      auth: {
        user: 'your-email@example.com',
        pass: 'your-password'
      }
    })

    // Send the email
    await transporter.sendMail({
      from: 'your-email@example.com',
      to: userEmail,
      subject: subject,
      text: message
    })

    console.log('Reset email sent successfully')
  } catch (error) {
    console.error('Error sending reset email:', error)
  }
}

module.exports = sendEmail
