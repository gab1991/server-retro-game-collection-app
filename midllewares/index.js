const verification = require('./verification');
const errorHandling = require('./errorHandling');

module.exports = {
  ...verification,
  ...errorHandling,
};
