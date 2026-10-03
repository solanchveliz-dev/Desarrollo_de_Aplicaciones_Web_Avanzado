const mongoose = require('mongoose');
const User = require('../models/User');
const inMemoryDb = require('../utils/inMemoryDb');

class UserRepository {
  async findByEmail(email) {
    if (mongoose.connection.readyState !== 1) {
      return inMemoryDb.users.find((user) => user.email === email) || null;
    }
    return User.findOne({ email }).populate('roles');
  }

  async findById(id) {
    if (mongoose.connection.readyState !== 1) {
      return inMemoryDb.users.find((user) => String(user._id) === String(id)) || null;
    }
    return User.findById(id).populate('roles');
  }

  async findAll() {
    if (mongoose.connection.readyState !== 1) {
      return inMemoryDb.users.slice();
    }
    return User.find().populate('roles');
  }

  async create(data) {
    if (mongoose.connection.readyState !== 1) {
      const user = {
        _id: `user_${inMemoryDb.userCounter++}`,
        ...data,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      inMemoryDb.users.push(user);
      return user;
    }
    return User.create(data);
  }

  async updateById(id, data) {
    if (mongoose.connection.readyState !== 1) {
      const user = inMemoryDb.users.find((item) => String(item._id) === String(id));
      if (!user) return null;
      Object.assign(user, data, { updatedAt: new Date() });
      return user;
    }
    return User.findByIdAndUpdate(id, data, { new: true }).populate('roles');
  }
}

module.exports = new UserRepository();
