const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.join(__dirname, "..", "..", ".env") });

class EmailService {
  constructor() {
    const requiredVariables = ["MAILER_SERVICE", "MAILER_EMAIL", "MAILER_SECRET_KEY", "MAILER_RECIPIENT"];
    const missingVariables = requiredVariables.filter(variable => !process.env[variable]);
    if (missingVariables.length > 0) {
      throw new Error(`Faltan variables de correo: ${missingVariables.join(", ")}`);
    }

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
      to: process.env.MAILER_RECIPIENT,
      subject: "Notificacion de ticket",
      text: message
    });
  }
}

module.exports = EmailService;
