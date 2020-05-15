const jwt = require('jsonwebtoken');
const config = require('config');

// next means move on to the next piece of middleware
module.exports = function (req, res, next) {
  // Get token from header
  const token = req.header('x-auth-token');

  // Check if not token
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    // check if token is valid
    const decoded = jwt.verify(token, config.get('jwtSecret'));
    // user is from decoded which comes from token from the head
    req.user = decoded.user;
    next();
  } catch (error) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
