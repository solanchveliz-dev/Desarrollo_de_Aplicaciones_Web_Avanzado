// Arreglo para guardar los mensajes temporalmente
const messages = [];

// Página de inicio
const home = (req, res) => {
  res.render("home", {
    title: "Inicio"
  });
};

// Página Acerca de
const about = (req, res) => {
  res.render("about", {
    title: "Acerca de"
  });
};

// Mostrar el formulario
const contact = (req, res) => {
  res.render("contact", {
    title: "Contacto"
  });
};

// Guardar los datos enviados
const saveContact = (req, res) => {
  const { nombre, email, mensaje } = req.body;

  messages.push({
    nombre,
    email,
     mensaje
  });

  console.log("Mensaje recibido:");
  console.log({
    nombre,
    email,
    mensaje
  });

  res.redirect("/admin");
};

// Mostrar los mensajes en Admin
const admin = (req, res) => {
  res.render("admin", {
    title: "Administración",
    messages
  });
};

// Exportar las funciones
module.exports = {
  home,
  about,
   contact,
  saveContact,
  admin
};