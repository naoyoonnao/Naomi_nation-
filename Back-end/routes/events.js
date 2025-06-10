/* Back-end / routes / events.js */
const router  = require('express').Router();
const multer  = require('multer');
const path    = require('path');
const fs      = require('fs');
const Event   = require('../models/Event');

/* зберігаємо файли у папку uploads/ */
const upload = multer({ dest: 'uploads/' });

/* допоміжне видалення файлу */
function removeFile(fname) {
  const p = path.join(__dirname, '..', 'uploads', fname);
  if (fs.existsSync(p)) fs.unlinkSync(p);
}

/* ─────────────────── CREATE ─────────────────── */
router.post(
  '/',
  upload.fields([
    { name: 'mainImage',     maxCount: 1 },
    { name: 'galleryImages', maxCount: 10 },
  ]),
  async (req, res, next) => {
    try {
      const { title, date, description } = req.body;
      const mainImage = req.files?.mainImage?.[0]?.filename;
      const gallery   = (req.files?.galleryImages || []).map((f) => f.filename);

      if (!title?.trim() || !date || !description?.trim() || !mainImage) {
        return res.status(400).json({ message: 'Усі поля та головне фото обов’язкові' });
      }

      const ev = await Event.create({
        title: title.trim(),
        date,
        description: description.trim(),
        mainImage,
        gallery,             // ← зберігаємо у gallery
      });

      res.status(201).json(ev);
    } catch (err) {
      next(err);
    }
  },
);

/* ─────────────────── READ ─────────────────── */
router.get('/', async (_, res, next) => {
  try {
    const list = await Event.find().sort('-createdAt');
    res.json(list);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const ev = await Event.findById(req.params.id);
    if (!ev) return res.status(404).json({ message: 'Not found' });
    res.json(ev);
  } catch (err) {
    next(err);
  }
});

/* ─────────────────── UPDATE ─────────────────── */
router.patch(
  '/:id',
  upload.fields([
    { name: 'mainImage',     maxCount: 1 },
    { name: 'galleryImages', maxCount: 10 },
  ]),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const { title, date, description } = req.body;

      const ev = await Event.findById(id);
      if (!ev) return res.status(404).json({ message: 'Not found' });

      /* scalar */
      if (title)       ev.title       = title.trim();
      if (date)        ev.date        = date;
      if (description) ev.description = description.trim();

      /* головне фото */
      if (req.files?.mainImage?.[0]) {
        if (ev.mainImage) removeFile(ev.mainImage);
        ev.mainImage = req.files.mainImage[0].filename;
      }

      /* видалити зі старої галереї */
      if (req.body.remove) {
        let toRemove = [];
        try { toRemove = JSON.parse(req.body.remove); } catch {}
        if (toRemove.length) {
          ev.gallery = ev.gallery.filter((fname) => !toRemove.includes(fname));
          toRemove.forEach(removeFile);
        }
      }

      /* додати нові */
      if (req.files?.galleryImages?.length) {
        req.files.galleryImages.forEach((f) => ev.gallery.push(f.filename));
      }

      await ev.save();
      res.json(ev);
    } catch (err) {
      next(err);
    }
  },
);

/* ─────────────────── DELETE ─────────────────── */
router.delete('/:id', async (req, res, next) => {
  try {
    const ev = await Event.findById(req.params.id);
    if (!ev) return res.status(404).json({ message: 'Not found' });

    /* прибираємо файли з диска */
    if (ev.mainImage) removeFile(ev.mainImage);
    ev.gallery.forEach(removeFile);

    await ev.deleteOne();
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
