const jwt = require("jsonwebtoken");

const isAdmin = (req, res, next) => {
    const token = req.cookies.token || (req.headers.authorization && req.headers.authorization.split(" ")[1]);
    if (!token) return res.status(401).json({ message: 'Unauthorized' });
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (decoded.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied, admin only' });
      }
      req.userId = decoded.userId;
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Invalid Token' });
    }
  };
  
  module.exports = isAdmin;