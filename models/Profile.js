const mongoose = require('mongoose');

const ebayOffersSchema = new mongoose.Schema({
  id: { type: String },
  date: { type: Date, default: Date.now },
});

const gameSchema = new mongoose.Schema({
  slug: { type: String, requred: true },
  name: { type: String, requred: true },
  date: { type: Date, default: Date.now },
  watchedEbayOffers: [ebayOffersSchema],
});

const platfromSchema = new mongoose.Schema({
  name: { type: String, defaultL: undefined },
  games: [gameSchema],
});

const profileSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    dropDups: true,
  },
  password: {
    type: String,
    required: true,
    max: 1024,
    min: 4,
  },
  email: {
    type: String,
    required: true,
  },
  createdDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  owned_list: {
    platforms: [platfromSchema],
  },
  wish_list: {
    platforms: [platfromSchema],
  },
});

module.exports = mongoose.model('profile', profileSchema);
