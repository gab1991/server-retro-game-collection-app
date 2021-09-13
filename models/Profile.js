const mongoose = require('mongoose');
const validator = require('validator');

const ebayOffersSchema = new mongoose.Schema({
  id: { type: String },
  date: { type: Date, default: Date.now },
});

const gameSchema = new mongoose.Schema({
  slug: { type: String, requred: true },
  name: { type: String, requred: true },
  date: { type: Date, default: Date.now },
  isShowEbay: { type: Boolean, default: true },
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
    maxLength: 1024,
    minlength: 4,
  },
  email: {
    type: String,
    required: true,
    validate: [validator.isEmail, 'Your email is not valid'],
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

const Profile = mongoose.model('Profile', profileSchema);

module.exports = Profile;
