const express = require('express');
const { translateText } = require('../controllers/translateController');
const router = express.Router();

router.post('/translate', async (req, res) => {
  const { text, langCode } = req.body;

  if (!text || !langCode) {
    return res.status(400).json({ message: 'Текст або мова не вказані' });
  }

  const translatedText = await translateText(text, langCode);

  if (translatedText) {
    res.status(200).json({ translatedText });
  } else {
    res.status(500).json({ message: 'Помилка при перекладі' });
  }
});

module.exports = router;
