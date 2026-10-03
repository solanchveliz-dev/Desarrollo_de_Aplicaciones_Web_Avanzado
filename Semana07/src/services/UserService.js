const UserRepository = require('../repositories/UserRepository');
const RoleRepository = require('../repositories/RoleRepository');
const AuthService = require('./AuthService');
const { calculateAge } = require('../utils/age');

class UserService {
  async getAllUsers() {
    const users = await UserRepository.findAll();
    return users.map((user) => this.toPublicUser(user));
  }

  async getUserById(id) {
    const user = await UserRepository.findById(id);
    return this.toPublicUser(user);
  }

  async getUserByIdSensitive(id) {
    return UserRepository.findById(id);
  }

  async getMe(userId) {
    const user = await UserRepository.findById(userId);
    return this.toPublicUser(user);
  }

  async updateUserProfile(userId, data) {
    const user = await UserRepository.findById(userId);
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    const allowedFields = ['name', 'lastName', 'email', 'phoneNumber', 'birthdate', 'url_profile', 'adress'];
    const updates = {};

    for (const field of allowedFields) {
      if (Object.prototype.hasOwnProperty.call(data, field) && data[field] !== undefined && data[field] !== null && data[field] !== '') {
        updates[field] = field === 'email' ? String(data[field]).trim().toLowerCase() : data[field];
      }
    }

    if (Object.prototype.hasOwnProperty.call(data, 'password') && data.password) {
      if (!AuthService.validatePassword(data.password)) {
        const error = new Error('Password must be at least 8 characters and include 1 uppercase, 1 number and 1 special character (# $ % & * @).');
        error.statusCode = 400;
        throw error;
      }
      updates.password = await AuthService.hashPassword(data.password);
    }

    if (updates.email && updates.email !== user.email) {
      const existing = await UserRepository.findByEmail(updates.email);
      if (existing && existing._id.toString() !== userId) {
        const error = new Error('Email already in use');
        error.statusCode = 409;
        throw error;
      }
    }

    const updated = await UserRepository.updateById(userId, updates);
    return this.toPublicUser(updated);
  }

  toPublicUser(user) {
    if (!user) return null;

    const source = user.toObject ? user.toObject() : { ...user };
    const { password, __v, ...safe } = source;
    const roles = Array.isArray(safe.roles)
      ? safe.roles.map((role) => (typeof role === 'string' ? role : role && role.name ? role.name : ''))
      : [];

    return {
      ...safe,
      roles,
      age: user.age ?? calculateAge(safe.birthdate),
      createdAt: safe.createdAt,
      updatedAt: safe.updatedAt
    };
  }
}

module.exports = new UserService();
