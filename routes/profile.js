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
    const username = req.params.username;
    const { action, platform, game } = req.body;
    try {
      const profile = await Profile.findOne({ username: username });
      if (profile.length === 0) {
        return res.status(400).send({ err_message: 'no such user' });
      }

      switch (action) {
        case 'addGame':
          {
            const userPlatforms = profile.owned_list.platforms;
            let updPlatform;

            for (let i = 0; i < userPlatforms.length; i++) {
              if (platform === userPlatforms[i].name) {
                updPlatform = userPlatforms[i];
                break;
              }
            }

            // if this platform is not in the userlist
            if (!updPlatform) {
              userPlatforms.push({ name: platform, games: [] });
              const lastIdx = userPlatforms.length - 1;
              updPlatform = userPlatforms[lastIdx];
              console.log(updPlatform);
            }

            const gamesForPlatform = updPlatform.games;
            // check for existing games
            for (let i = 0; i < gamesForPlatform.length; i++) {
              if (game.name === gamesForPlatform[i].name) {
                return res.status(400).send({
                  err_message: `${game.name} is already in your colletion`
                });
              }
            }
            gamesForPlatform.push({
              slug: game.slug,
              name: game.name,
              date: Date.now()
            });
            await profile.save();
            res.send({ success: `${game.name} has been added successfully` });
          }

          break;

        case 'removeGame': {
          const userPlatforms = profile.owned_list.platforms;
          let updPlatform;
          let updIdx;

          for (let i = 0; i < userPlatforms.length; i++) {
            if (platform === userPlatforms[i].name) {
              updPlatform = userPlatforms[i];
              updIdx = i;
              break;
            }
          }

          // if this platform is not in the userlist
          if (!updPlatform) {
            return res.status(400).send({
              err_message: `Could'nt find this platfrom in user's platforms`
            });
          }

          let gamesForPlatform = updPlatform.games;
          // check for existing games
          for (let i = 0; i < gamesForPlatform.length; i++) {
            if (game.name === gamesForPlatform[i].name) {
              gamesForPlatform.splice(i, 1);
            }
          }
          // Check wheter remove directory or not
          if (gamesForPlatform.length === 0) userPlatforms.splice(updIdx, 1);

          await profile.save();
          res.send({ success: `${game.name} has been removed successfully` });
        }

        default:
          break;
      }
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  }
);

module.exports = router;
