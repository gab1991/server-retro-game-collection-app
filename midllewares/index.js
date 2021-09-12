const verification = require('./verification');
const errorHandling = require('./errorHandling');
const fetchVerifiedProfile = require('./fetchVerifiedProfile');

module.exports = {
  ...verification,
  ...errorHandling,
  ...fetchVerifiedProfile,
};
