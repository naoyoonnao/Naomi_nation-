const Cat = require('../models/Cat');

// GET /api/categories
exports.getCategories = async (_req, res) => {
  try {
    const names = await Cat.distinct('category');        // [ "КОШЕНЯТА", "ДОРОСЛІ КОТИ" ]
    const list  = names.map((name) => ({
      _id: encodeURIComponent(name.toLowerCase()),       // "кошенята" → url-safe slug
      name,
    }));
    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Помилка сервера' });
  }
};

// GET /api/categories/:id/posts
exports.getPostsByCategory = async (req, res) => {
  try {
    const categoryName = decodeURIComponent(req.params.id); // "Кошенята"
    const posts = await Cat.find({ category: categoryName }).sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Помилка сервера' });
  }
};
