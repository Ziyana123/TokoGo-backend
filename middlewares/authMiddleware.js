const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.cookies.token || (req.headers.authorization && req.headers.authorization.split(" ")[1]);
  console.log('Token:', token);
  console.log('Cookies:', req.cookies); 
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded User:', decoded);
    req.user = {
      _id: decoded.userId,
      role: decoded.role
    };
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid Token' });
  }
};

module.exports = authMiddleware;
