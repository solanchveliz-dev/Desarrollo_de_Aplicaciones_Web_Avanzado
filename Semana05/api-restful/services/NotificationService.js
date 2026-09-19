const { v4: uuidv4 } = require("uuid");
const NotificationRepository = require("../repositories/NotificationRepository");
const EmailService = require("./email/EmailService");

class NotificationService {
  constructor() {
    this.repo = new NotificationRepository();
    this.emailService = new EmailService();
  }

  create(type, message, ticketId) {
    const notification = {
      id: uuidv4(),
      type,
      message,
      status: "pending",
      ticketId
    };
    const savedNotification = this.repo.save(notification);

    if (type === "email") {
      this.emailService.sendEmail(message)
        .then(info => {
          this.repo.update(notification.id, { status: "sent" });
          console.log(`Notificacion por email enviada a ${info.accepted.join(", ")}`);
        })
        .catch(error => {
          this.repo.update(notification.id, { status: "failed" });
          console.error("No se pudo enviar la notificacion por email", {
            message: error.message,
            code: error.code,
            response: error.response,
            responseCode: error.responseCode
          });
        });
    }

    return savedNotification;
  }

  list() {
    return this.repo.findAll();
  }
}
module.exports = NotificationService;

