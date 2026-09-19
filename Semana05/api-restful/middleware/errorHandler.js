function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const message = statusCode >= 500 ? "Error interno del servidor" : err.message;

  console.error(err);
  res.status(statusCode).json({ error: message });
}

module.exports = errorHandler;
