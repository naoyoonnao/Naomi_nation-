const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'DEV_SECRET';

module.exports = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ message: 'Немає доступу, токен відсутній' });

  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: 'Невірний або протермінований токен' });
  }
};
