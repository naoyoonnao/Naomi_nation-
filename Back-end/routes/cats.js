/* routes/cats.js */
const express  = require('express');
const multer   = require('multer');

const {
  createCat,
  getCats,
  updateCat,
  deleteCat,          // ← новий експорт
} = require('../controllers/catController');

const router  = express.Router();
const upload  = multer({ dest: 'uploads/' });

/* ---------- CREATE ---------- */
router.post(
  '/',
  upload.fields([
    { name: 'mainImage',       maxCount: 1 },
    { name: 'galleryImages',   maxCount: 10 },
  ]),
  createCat,
);

/* ---------- READ ---------- */
router.get('/', getCats);

/* ---------- UPDATE ---------- */
router.patch(
  '/:id',
  upload.fields([
    { name: 'mainImage',         maxCount: 1 },
    { name: 'newGalleryImages',  maxCount: 10 },
  ]),
  updateCat,
);

/* ---------- DELETE ---------- */
router.delete('/:id', deleteCat);   // ← додаємо повне видалення поста

module.exports = router;
