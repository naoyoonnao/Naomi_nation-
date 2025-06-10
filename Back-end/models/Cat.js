// Back-end/models/Cat.js
const mongoose = require('mongoose');

const CatSchema = new mongoose.Schema({
  /* базові */
  name:       { type: String, required: true, trim: true },
  category:   { type: String, required: true, trim: true },
  mainImage:  { type: String, required: true },
  galleryImages: [String],

  /* нові поля */
  color:       String,
  sex:         { type: String, enum: ['Female', 'Male'] },
  dob:         Date,
  pedigree:    String,
  mother:      String,
  father:      String,
  status:      { type: String, enum: ['for breeding', 'as a pet'] },
  price:       Number,
  availability:{ type: String, enum: ['AVAILABLE', 'RESERVED', 'SOLD'], default: 'AVAILABLE' },
}, { timestamps: true });

module.exports = mongoose.model('Cat', CatSchema);
