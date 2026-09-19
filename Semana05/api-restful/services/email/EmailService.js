const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config();

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: process.env.MAILER_SERVICE,
      auth: {
        user: process.env.MAILER_EMAIL,
        pass: process.env.MAILER_SECRET_KEY
      }
    });
  }

  sendEmail(message) {
    return this.transporter.sendMail({
      from: process.env.MAILER_EMAIL,
      to: process.env.MAILER_EMAIL,
      subject: "Notificacion de ticket",
      text: message
    });
  }
}

module.exports = EmailService;
