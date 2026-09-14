const adminAuth = (req, res, next) => {
  if (!req.isAdmin) {
    return res.status(403).json({ message: 'Access denied. Admins only.' });
  }
  next();
};

module.exports = adminAuth;