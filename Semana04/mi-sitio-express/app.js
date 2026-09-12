const express = require("express");
const path = require("path");
const mainRoutes = require("./routes/mainRoutes");

const app = express();

// Configurar EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Habilitar la carpeta public
app.use(express.static(path.join(__dirname, "public")));

// Procesar los formularios
app.use(express.urlencoded({ extended: true }));

// Utilizar las rutas
app.use("/", mainRoutes);

// Error 404: siempre debe estar después de las rutas
app.use((req, res) => {
  res.status(404).render("notFound", {
    title: "Página no encontrada",
    url: req.originalUrl
  });
});

// Iniciar el servidor
if (require.main === module) {
  const PORT = process.env.PORT || 3000;

  app.listen(PORT, () => {
    console.log(`Servidor en http://localhost:${PORT}`);
  });
}

// Exportar para realizar pruebas
module.exports = app;