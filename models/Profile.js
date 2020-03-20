const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  slug: { type: String, requred: true },
  name: { type: String, requred: true }
});
const platfromSchema = new mongoose.Schema({
  // name: { type: String, requred: true, unique: true, dropDups: true },
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
    platforms: { name: [platfromSchema] }
  },
  wish_list: {
    platforms: [platfromSchema]
  }
});

module.exports = mongoose.model('Profile', profileSchema);
