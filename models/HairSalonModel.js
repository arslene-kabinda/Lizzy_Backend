const mongoose = require("mongoose");

const hairSalonSchema = new mongoose.Schema({
  name: {
    unique: true,
    type: String,
    required: [true, "an hairSalon must have a name"],
  },
  description: {
    type: String,
    required: [true, "an hairSalon must have  a small description "],
  },
  coverImage: {
    type: String,
    // required: [true, "an hairSalon must have a cover picture"],
  },
  adress: {
    type: [
      {
        township: { type: String },
        quater: { type: String },
        street: { type: String },
        number: { type: Number },
        reference: { type: String },
      },
    ],
  },
  openingTime: {
    type: Date,
    // required: [true, "give the opening hour"],
  },
  closingTime: {
    type: Date,
    // required: [true, "give the closing hour"],
  },
  map: {
    type: String,
  },
  images: {
    type: String,
  },
  ratingsAverage: {
    type: Number,
    default: 2,
  },
  CreatedAt: {
    type: Date,
    default: Date.now(),
  },
});

const HairSalon = mongoose.model("HairSalon", hairSalonSchema);

module.exports = HairSalon;
