const { v4: uuidv4 } = require("uuid");
const TicketRepository = require("../repositories/TicketRepository");
const NotificationService = require("./NotificationService");

class TicketService {
  constructor() {
    this.repo = new TicketRepository();
    this.notificationService = new NotificationService();
  }

  createTicket(data) {
    const ticket = {
      id: uuidv4(),
      title: data.title,
      description: data.description,
      status: "nuevo",
      priority: data.priority || "medium",
      assignedUser: null
    };

    this.repo.save(ticket);
    this.notificationService.create("email", `Nuevo ticket creado: ${ticket.title}`, ticket.id);

    return ticket;
  }

  assignTicket(id, user) {
    const ticket = this.repo.update(id, { assignedUser: user });
    if (ticket) {
      this.notificationService.create("email", `El ticket ${ticket.id} fue asignado a ${user}`, ticket.id);
    }
    return ticket;
  }

  changeStatus(id, newStatus) {
    const ticket = this.repo.update(id, { status: newStatus });
    if (ticket) {
      this.notificationService.create("push", `El ticket ${ticket.id} cambió a ${newStatus}`, ticket.id);
    }
    return ticket;
  }

  list(page, limit) {
    const tickets = this.repo.findAll();
    if (page === undefined || limit === undefined) return tickets;

    const start = (page - 1) * limit;
    return {
      data: tickets.slice(start, start + limit),
      pagination: {
        page,
        limit,
        total: tickets.length,
        totalPages: Math.ceil(tickets.length / limit)
      }
    };
  }

  listNotifications(id) {
    if (!this.repo.findById(id)) {
      const error = new Error("Ticket no encontrado");
      error.statusCode = 404;
      throw error;
    }

    return this.notificationService.listByTicketId(id);
  }

  deleteTicket(id) {
    const deleted = this.repo.delete(id);
    if (!deleted) {
      throw new Error("Ticket no encontrado");
    }
    return true;
  }
}

module.exports = TicketService;
