const Joi = require("joi");

const cityValidate = (data) => {
  const schema = Joi.object({
    id: Joi.number(),
    NAME: Joi.string().max(255).required().label("NAME"),
    DESC: Joi.string().label("DESC"),
    CD: Joi.string().max(255).label("CD"),
    COUNTRY_ID: Joi.number().required(),
    NOTE: Joi.string().label("NOTE"),
  });

  return schema.validate(data);
};
const countryValidate = (data) => {
  const schema = Joi.object({
    id: Joi.number(),
    NAME: Joi.string().max(255).required().label("NAME"),
    DESC: Joi.string().label("DESC"),
    CD: Joi.string().max(255).label("CD"),
    NOTE: Joi.string().label("NOTE"),
  });

  return schema.validate(data);
};
const loginValidate = (data) => {
  const schema = Joi.object({
    USER_PW: Joi.string().required().label("Password"),
    USER_NAME: Joi.string().required().label("User Name"),
    remember: Joi.boolean().allow(null).label("Remember Me"),
  });

  return schema.validate(data);
};
module.exports = {
  cityValidate,
  countryValidate,
  loginValidate,
};
