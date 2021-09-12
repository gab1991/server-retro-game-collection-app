const Profile = require('../models/Profile.js');

const fetchVerifiedProfile = async (req, res, next) => {
  const verifiedId = req.verifiedUserId;

  const profile = await Profile.findOne({
    _id: verifiedId,
  });

  if (!profile) {
    return res.status(400).send({
      err_message: 'No such user',
    });
  }

  req.profile = profile;
  return next();
};

module.exports = { fetchVerifiedProfile };
