const express = require('express');
const bcrypt  = require('bcryptjs');
const jwt     = require('jsonwebtoken');
const User    = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'DEV_SECRET';
const ADMIN_CREDENTIALS = { login: 'admin', password: 'admin123' };

const router = express.Router();

router.post('/login', async (req, res) => {
  const { login, password } = req.body;

  /* статичний адмін */
  if (login === ADMIN_CREDENTIALS.login && password === ADMIN_CREDENTIALS.password) {
    const token = jwt.sign({ login }, JWT_SECRET, { expiresIn: '1h' });
    return res.json({ token });
  }

  /* (необов’язково) реальний користувач із бази */
  try {
    const user = await User.findOne({ login });
    if (!user) return res.status(401).json({ message: 'Невірний логін або пароль' });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok)  return res.status(401).json({ message: 'Невірний логін або пароль' });

    const token = jwt.sign({ login: user.login }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Помилка сервера' });
  }
});

module.exports = router;
