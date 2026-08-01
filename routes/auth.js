const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../utils/db');
const verifyToken = require('../middleware/auth');

const router = express.Router();

router.post('/register', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'email and password required' });
  }

  try {
    const hashed = await bcrypt.hash(password, 10);

    await pool.query(
      'INSERT INTO users (email, password) VALUES ($1, $2)',
      [email, hashed]
    );

    res.status(201).json({ message: 'user created' });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ message: 'user already exists' });
    }
    console.error(err);
    res.status(500).json({ message: 'something went wrong' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    const user = result.rows[0];

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
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'something went wrong' });
  }
});

router.get('/me', verifyToken, (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;