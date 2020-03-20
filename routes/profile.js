const express = require('express');
const router = express.Router();
const verify = require('./verifyToken.js');
const Profile = require('../models/Profile.js');

router.get('/:username/:token', verify.verifyToken, async (req, res) => {
  const username = req.params.username;
  try {
    const profile = await Profile.findOne({ username: username });
    if (profile.length === 0) {
      return res.status(400).send({ err_message: 'no such user' });
    }
    return res.send(profile);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

router.post(
  '/:username/update/:token',
  verify.verifyToken,
  async (req, res) => {
    console.log(req.body);
    const username = req.params.username;
    const { action, platform, name } = req.body;
    try {
      const profile = await Profile.findOne({ username: username });
      if (profile.length === 0) {
        return res.status(400).send({ err_message: 'no such user' });
      }

      switch (action) {
        case 'addGame':
          const userPlatforms = profile.owned_list.platforms;
          userPlatforms.forEach();
          console.log(userPlatforms);
          break;
        default:
          break;
      }
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  }
);

const profile = async () => {
  const p = await Profile.findOne({ username: 'gab1' });
  const pls = p.owned_list.platforms;
  pls = { name: 'Genesis', games: '' };
  p.save();
};

profile();

module.exports = router;
