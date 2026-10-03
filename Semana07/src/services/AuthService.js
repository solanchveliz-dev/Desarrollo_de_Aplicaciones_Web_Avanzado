const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { calculateAge } = require('../utils/age');

class AuthService {
  validatePassword(password) {
    if (!password || password.length < 8) return false;
    if (!/[A-Z]/.test(password)) return false;
    if (!/\d/.test(password)) return false;
    if (!/[#$%&*@]/.test(password)) return false;
    return true;
  }

  async hashPassword(password) {
    return bcrypt.hash(password, 10);
  }

  async comparePassword(candidatePassword, passwordHash) {
    return bcrypt.compare(candidatePassword, passwordHash);
  }

  generateToken(user) {
    const roles = (user.roles || []).map((role) => {
      if (typeof role === 'string') return role;
      return role && role.name ? role.name : '';
    }).filter(Boolean);

    return jwt.sign(
      {
        sub: user._id.toString(),
        roles
      },
      process.env.JWT_SECRET || 'dev-secret-key-change-me',
      { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
    );
  }

  sanitizeUser(user) {
    if (!user) return null;

    const raw = user.toObject ? user.toObject() : { ...user };
    const { password, __v, ...safeUser } = raw;

    return {
      ...safeUser,
      roles: (safeUser.roles || []).map((role) => (typeof role === 'string' ? role : role && role.name ? role.name : '')).filter(Boolean),
      age: user.age ?? calculateAge(safeUser.birthdate)
    };
  }
}

module.exports = new AuthService();
