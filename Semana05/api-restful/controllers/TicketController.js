const TicketService = require("../services/TicketService");
const service = new TicketService();

exports.create = (req, res) => {
  const ticket = service.createTicket(req.body);
  res.status(201).json(ticket);
};

exports.list = (req, res) => {
  const hasPagination = req.query.page !== undefined || req.query.limit !== undefined;
  if (!hasPagination) return res.status(200).json(service.list());

  const page = Number(req.query.page || 1);
  const limit = Number(req.query.limit || 5);
  if (!Number.isInteger(page) || page < 1 || !Number.isInteger(limit) || limit < 1) {
    const error = new Error("page y limit deben ser enteros positivos");
    error.statusCode = 400;
    throw error;
  }

  res.status(200).json(service.list(page, limit));
};

exports.notifications = (req, res) => {
  res.status(200).json(service.listNotifications(req.params.id));
};

exports.assign = (req, res) => {
  const { id } = req.params;
  const { user } = req.body;
  const ticket = service.assignTicket(id, user);
  if (!ticket) return res.status(404).json({ error: "Ticket no encontrado" });
  res.status(200).json(ticket);
};

exports.changeStatus = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const ticket = service.changeStatus(id, status);
  if (!ticket) return res.status(404).json({ error: "Ticket no encontrado" });
  res.status(200).json(ticket);
};

exports.delete = (req, res) => {
  try {
    service.deleteTicket(req.params.id);
    res.json({ message: "Ticket eliminado correctamente" });
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
}

