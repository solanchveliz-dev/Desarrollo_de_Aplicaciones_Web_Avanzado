const express = require("express");
const router = express.Router();

const mainController = require("../controllers/mainController");

// Página de inicio
router.get("/", mainController.home);

// Página Acerca de
router.get("/about", mainController.about);

// Mostrar el formulario de contacto
router.get("/contact", mainController.contact);

// Recibir los datos del formulario
router.post("/contact", mainController.saveContact);

// Mostrar los mensajes guardados
router.get("/admin", mainController.admin);

module.exports = router;