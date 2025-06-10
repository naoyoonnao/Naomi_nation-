
const mongoose = require("mongoose");
const EventSchema = new mongoose.Schema(
  {
    title:       { type: String, required: true },
    date:        { type: Date,   required: true },
    description: { type: String },
    mainImage:   { type: String },        
    gallery:     [String],              
  },
  { timestamps: true }
);
module.exports = mongoose.model("Event", EventSchema);
