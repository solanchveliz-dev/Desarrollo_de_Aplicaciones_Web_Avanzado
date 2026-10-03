const mongoose = require('mongoose');
const Role = require('../models/Role');
const inMemoryDb = require('../utils/inMemoryDb');

class RoleRepository {
  async findByName(name) {
    if (mongoose.connection.readyState !== 1) {
      return inMemoryDb.roles.find((role) => role.name === name) || null;
    }
    return Role.findOne({ name });
  }

  async findAll() {
    if (mongoose.connection.readyState !== 1) {
      return inMemoryDb.roles.slice();
    }
    return Role.find();
  }

  async create(name) {
    if (mongoose.connection.readyState !== 1) {
      const role = { _id: `role_${inMemoryDb.roleCounter++}`, name };
      inMemoryDb.roles.push(role);
      return role;
    }
    return Role.create({ name });
  }
}

module.exports = new RoleRepository();
