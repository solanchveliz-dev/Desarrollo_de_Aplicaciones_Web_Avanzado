const express = require('express');
const UserController = require('../controllers/UserController');
const authenticate = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize');

const router = express.Router();

router.get('/', authenticate, authorize(['admin']), UserController.getAll);
router.get('/me', authenticate, UserController.getMe);
router.put('/me', authenticate, UserController.updateMe);
router.get('/:id', authenticate, authorize(['admin']), UserController.getById);

module.exports = router;
