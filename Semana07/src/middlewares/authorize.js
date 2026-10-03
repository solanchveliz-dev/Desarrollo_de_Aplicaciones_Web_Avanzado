function authorize(allowedRoles = []) {
  return (req, res, next) => {
    const userRoles = req.userRoles || [];

    if (!userRoles.length) {
      return res.status(403).json({ message: 'Access denied.' });
    }

    const isAllowed = allowedRoles.length === 0 || allowedRoles.some((role) => userRoles.includes(role));

    if (!isAllowed) {
      return res.status(403).json({ message: 'Access denied. You do not have enough permissions.' });
    }

    return next();
  };
}

module.exports = authorize;
