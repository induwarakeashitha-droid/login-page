require('dotenv').config({ path: '.env' });
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 5000;

if (!process.env.JWT_SECRET) {
  console.warn('JWT_SECRET is not set; using fallback secret');
}

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.use('/api/auth', authRoutes);

app.listen(PORT, () => console.log(`server running on port ${PORT}`));
