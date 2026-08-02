const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET || 'dev-secret-change-me';

function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'no token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ message: 'invalid token' });
  }
}

module.exports = verifyToken;
