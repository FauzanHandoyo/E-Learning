const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  const token = authHeader.split(' ')[1]; // Extract the token from "Bearer <token>"
  if (!token) {
    return res.status(401).json({ message: 'Access denied. Invalid token format.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token
    req.user = decoded; // Attach the decoded payload to req.user
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      console.error('Token has expired:', error);
      return res.status(401).json({ message: 'Token has expired.' });
    }
    console.error('Invalid token:', error);
    res.status(401).json({ message: 'Invalid token.' });
  }
};

// Middleware to check if user has required role
const checkRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access forbidden' });
    }

    next();
  };
};

module.exports = {
  verifyToken,
  checkRole
};