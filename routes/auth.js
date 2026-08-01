const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { readUsers, writeUsers } = require('../utils/db');
const verifyToken = require('../middleware/auth');

const router = express.Router();

router.post('/register', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'email and password required' });
  }

  const users = readUsers();
  const exists = users.find(u => u.email === email);

  if (exists) {
    return res.status(409).json({ message: 'user already exists' });
  }

  const hashed = await bcrypt.hash(password, 10);
  const newUser = { id: Date.now().toString(), email, password: hashed };

  users.push(newUser);
  writeUsers(users);

  res.status(201).json({ message: 'user created' });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const users = readUsers();
  const user = users.find(u => u.email === email);

  if (!user) {
    return res.status(401).json({ message: 'invalid credentials' });
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.status(401).json({ message: 'invalid credentials' });
  }

  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  res.json({ token });
});

router.get('/me', verifyToken, (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
