const nodemailer = require("nodemailer");
const jwt = require('jsonwebtoken');
let transporter = nodemailer.createTransport({
  host: "neon.superhosting.bg",
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMT_USER,
    pass: process.env.SMT_PASS
  }
});

const Tools = {
  async sendLoginEmail(email) {
    const token = jwt.sign(
      { email },
      process.env.JWT_SECRET, 
      { expiresIn: '7d' }
    );

    return transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Account activation link',
      html: `<hr/><h1>Please use the following link <a href=${process.env.CLIENT_URL}/users/activate/${token}>${process.env.CLIENT_URL}</a> to activate your account</h1><hr/>`
    })
  }
}

module.exports = Tools;