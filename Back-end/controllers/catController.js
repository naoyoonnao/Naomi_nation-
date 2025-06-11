/* controllers/catController.js */
const path = require('path');
const fs   = require('fs');
const Cat  = require('../models/Cat');

/* ───────── helper ───────── */
const removeFile = (fname) => {
  if (!fname) return;
  const p = path.join(__dirname, '..', 'uploads', fname);
  if (fs.existsSync(p)) fs.unlinkSync(p);
};

/* ───────── CREATE (/api/cats) ───────── */
exports.createCat = async (req, res) => {
  try {
    const {
      name, category,
      color, sex, dob, pedigree,
      mother, father, status, price, availability,
    } = req.body;

    const mainFile = req.files?.mainImage?.[0];
    const gallery  = req.files?.galleryImages || [];

    if (!name?.trim() || !category?.trim() || !mainFile) {
      return res.status(400).json({ message: 'Ім’я, категорія й фото обов’язкові' });
    }

    const newCat = await Cat.create({
      /* базові */
      name: name.trim(),
      category: category.trim(),
      mainImage: mainFile.filename,
      galleryImages: gallery.map((f) => f.filename),

      /* додаткові */
      color: color?.trim(),
      sex,
      dob,
      pedigree: pedigree?.trim(),
      mother: mother?.trim(),
      father: father?.trim(),
      status,
      price: price ? Number(price) : undefined,
      availability,
    });

    res.status(201).json(newCat);
  } catch (err) {
    console.error('createCat error:', err);
    res.status(500).json({ message: 'Помилка сервера' });
  }
};

/* ───────── READ (/api/cats[?category=]) ───────── */
exports.getCats = async (req, res) => {
  try {
    const { category, search } = req.query;
    const filter = {};

    // Фільтрація по категорії (мапа синонімів + нечутливо до регістру)
    if (category) {
      const map = {
        kittens: 'кошенята',
        kitten: 'кошенята',
        'кошеня': 'кошенята',
        'кошенята': 'кошенята',
      };
      const norm = (category || '').toLowerCase();
      const mapped = map[norm] ?? category;

      // частковий або повний збіг без врахування регістру
      filter.category = { $regex: mapped, $options: 'i' };
    }

    // Пошук по імені або категорії (case-insensitive)
    if (search) {
      const regex = { $regex: search, $options: 'i' };
      filter.$or = [
        { name: regex },
        { category: regex },
      ];
    }

    const cats = await Cat.find(filter).sort({ createdAt: -1 });
    res.json(cats);
  } catch (err) {
    console.error('getCats error:', err);
    res.status(500).json({ message: 'Помилка сервера' });
  }
};

/* ───────── UPDATE (/api/cats/:id) ───────── */
exports.updateCat = async (req, res) => {
  try {
    const id   = req.params.id;
    const body = req.body;

    /* головне зображення */
    if (req.files?.mainImage?.[0]) {
      body.mainImage = req.files.mainImage[0].filename;
    }

    /* нові файли галереї */
    const newGallery = (req.files?.newGalleryImages || []).map((f) => f.filename);

    /* список на видалення */
    const toDelete = JSON.parse(body.galleryImagesToDelete || '[]');

    const cat = await Cat.findById(id);
    if (!cat) return res.status(404).json({ message: 'Not found' });

    /* оновлюємо mainImage (і видаляємо старий файл) */
    if (body.mainImage && cat.mainImage) removeFile(cat.mainImage);

    /* формуємо нову галерею */
    let gallery = cat.galleryImages || [];
    gallery = gallery.filter((name) => !toDelete.includes(name));
    gallery = [...gallery, ...newGallery];
    body.galleryImages = gallery;

    /* апдейтимо решту полів */
    const updated = await Cat.findByIdAndUpdate(id, body, { new: true });
    res.json(updated);
  } catch (err) {
    console.error('updateCat error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

/* ───────── DELETE (/api/cats/:id) ───────── */
exports.deleteCat = async (req, res) => {
  try {
    const cat = await Cat.findById(req.params.id);
    if (!cat) return res.status(404).json({ message: 'Not found' });

    /* видаляємо файли з диска */
    removeFile(cat.mainImage);
    (cat.galleryImages || []).forEach(removeFile);

    /* видаляємо документ */
    await cat.deleteOne();
    res.json({ ok: true });
  } catch (err) {
    console.error('deleteCat error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
