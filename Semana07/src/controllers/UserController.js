const UserService = require('../services/UserService');

class UserController {
  async getAll(req, res) {
    try {
      const users = await UserService.getAllUsers();
      return res.json(users);
    } catch (error) {
      console.error(error);
      return res.status(error.statusCode || 500).json({ message: error.message || 'Unable to load users.' });
    }
  }

  async getMe(req, res) {
    try {
      const user = await UserService.getMe(req.userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }
      return res.json(user);
    } catch (error) {
      console.error(error);
      return res.status(error.statusCode || 500).json({ message: error.message || 'Unable to load user profile.' });
    }
  }

  async updateMe(req, res) {
    try {
      const user = await UserService.updateUserProfile(req.userId, req.body);
      return res.json(user);
    } catch (error) {
      console.error(error);
      return res.status(error.statusCode || 500).json({ message: error.message || 'Unable to update profile.' });
    }
  }

  async getById(req, res) {
    try {
      const user = await UserService.getUserById(req.params.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }
      return res.json(user);
    } catch (error) {
      console.error(error);
      return res.status(error.statusCode || 500).json({ message: error.message || 'Unable to load user.' });
    }
  }
}

module.exports = new UserController();
