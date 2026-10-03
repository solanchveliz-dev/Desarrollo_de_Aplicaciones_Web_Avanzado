const mongoose = require('mongoose');
const Role = require('../models/Role');
const inMemoryDb = require('./inMemoryDb');

async function seedRoles() {
  const roles = ['user', 'admin'];

  if (mongoose.connection.readyState !== 1) {
    const existing = inMemoryDb.roles;
    for (const name of roles) {
      if (!existing.some((role) => role.name === name)) {
        existing.push({ _id: `role_${inMemoryDb.roleCounter++}`, name });
      }
    }
    return existing;
  }

  for (const name of roles) {
    await Role.findOneAndUpdate(
      { name },
      { name },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }

  return Role.find();
}

module.exports = { seedRoles };
