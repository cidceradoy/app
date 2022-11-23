const jwt = require('jsonwebtoken');
const User = require('../models/userModel');


// Used anywhere where a restriction is needed. I.E. CRUD posts
async function auth(req, res, next) {
  const token = req.cookies['access-token'];

  if (!token) res.json({ message: 'Login first' });

  try {
    const validToken = jwt.verify(token, process.env.SECRET);

    if (validToken) {
      req.user = await User.findById(validToken.id);
      next();
    }
  } catch(err) {
    res.json({ message: 'User not authorized' });
  }
}

module.exports = auth;