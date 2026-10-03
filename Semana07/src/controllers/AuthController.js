const AuthService = require('../services/AuthService');
const UserRepository = require('../repositories/UserRepository');
const RoleRepository = require('../repositories/RoleRepository');

class AuthController {
  async signUp(req, res) {
    try {
      const { name, lastName, email, password, phoneNumber, birthdate } = req.body;

      if (!name || !lastName || !email || !password || !phoneNumber || !birthdate) {
        return res.status(400).json({ message: 'All required fields are required: name, lastName, phoneNumber, birthdate, email, password.' });
      }

      const normalizedEmail = String(email).trim().toLowerCase();
      if (!/^\S+@\S+\.\S+$/.test(normalizedEmail)) {
        return res.status(400).json({ message: 'Please enter a valid email address.' });
      }

      if (!AuthService.validatePassword(password)) {
        return res.status(400).json({
          message: 'Password must be at least 8 characters, include 1 uppercase letter, 1 number and 1 of these symbols: # $ % & * @.'
        });
      }

      const existingUser = await UserRepository.findByEmail(normalizedEmail);
      if (existingUser) {
        return res.status(409).json({ message: 'The email is already registered.' });
      }

      const defaultRole = await RoleRepository.findByName('user');
      if (!defaultRole) {
        return res.status(500).json({ message: 'The user role is not available.' });
      }

      const passwordHash = await AuthService.hashPassword(password);
      const newUser = await UserRepository.create({
        name: String(name).trim(),
        lastName: String(lastName).trim(),
        email: normalizedEmail,
        password: passwordHash,
        phoneNumber: String(phoneNumber).trim(),
        birthdate: new Date(birthdate),
        roles: [defaultRole._id]
      });

      const savedUser = await UserRepository.findById(newUser._id);
      const token = AuthService.generateToken(savedUser);

      return res.status(201).json({
        token,
        user: AuthService.sanitizeUser(savedUser)
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: error.message || 'Error creating user.' });
    }
  }

  async signIn(req, res) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
      }

      const user = await UserRepository.findByEmail(String(email).trim().toLowerCase());
      if (!user) {
        return res.status(401).json({ message: 'Invalid email or password.' });
      }

      const isPasswordValid = await AuthService.comparePassword(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid email or password.' });
      }

      const token = AuthService.generateToken(user);
      return res.status(200).json({
        token,
        user: AuthService.sanitizeUser(user)
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: error.message || 'Error logging in.' });
    }
  }
}

module.exports = new AuthController();
