const Event = require('../models/Event');

exports.createEvent = async (req, res) => {
  try {
    const { title, desc, dob } = req.body;
    const mainFile = req.files?.mainImage?.[0];
    const gallery = req.files?.galleryImages || [];

    if (!title || !desc || !dob || !mainFile) {
      return res.status(400).json({ message: 'Усі поля та головне фото обов’язкові' });
    }

    const newEvent = await Event.create({
      title,
      desc,
      dob,
      mainImage: mainFile.filename,
      galleryImages: gallery.map(f => f.filename),
    });

    res.status(201).json(newEvent);
  } catch (err) {
    console.error('createEvent error:', err);
    res.status(500).json({ message: 'Помилка сервера' });
  }
};
