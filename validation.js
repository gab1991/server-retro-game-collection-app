const Joi = require('@hapi/joi');

// Sign-up validation
const divideStr = (message) => {
  const regex = /"([^"]*)"/;
  const match = message.match(regex);
  const leftover = message.replace(regex, '');
  return [match[1], leftover];
};

const signUpValidation = (body) => {
  const schema = Joi.object({
    username: Joi.string().min(1).required(),
    email: Joi.string().required().email(),
    password: Joi.string().min(4).required(),
  });
  return schema.validate(body);
};

const signInValidation = (body) => {
  const schema = Joi.object({
    username: Joi.string().min(1).required(),
    password: Joi.string().min(4).required(),
  });
  return schema.validate(body);
};

module.exports = {
  signUpValidation,
  signInValidation,
  divideStr,
};
