const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const router = express.Router();

// ✅ Реєстрація користувача
router.post("/register", async (req, res) => {
  const { login, password } = req.body;

  try {
    const existingUser = await User.findOne({ login });
    if (existingUser) return res.status(400).json({ message: "Користувач вже існує" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ login, password: hashedPassword });

    res.status(201).json({ message: "Користувач створений", user: { id: newUser._id, login: newUser.login } });
  } catch (err) {
    res.status(500).json({ message: "Помилка сервера" });
  }
});

module.exports = router;
