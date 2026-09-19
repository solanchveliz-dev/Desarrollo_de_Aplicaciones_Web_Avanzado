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
        .then(() => console.log("Notificacion por email enviada"))
        .catch(error => console.error("No se pudo enviar la notificacion por email:", error.message));
    }

    return savedNotification;
  }

  list() {
    return this.repo.findAll();
  }

  listByTicketId(ticketId) {
    return this.repo.findByTicketId(ticketId);
  }
}
module.exports = NotificationService;

