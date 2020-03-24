const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  slug: { type: String, requred: true },
  name: { type: String, requred: true },
  date: { type: Date, default: Date.now }
});
const platfromSchema = new mongoose.Schema({
  name: { type: String, defaultL: undefined },
  games: [gameSchema]
});

const profileSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    dropDups: true
  },
  owned_list: {
    platforms: [platfromSchema]
  },
  wish_list: {
    platforms: [platfromSchema]
  }
});

module.exports = mongoose.model('profile', profileSchema);
