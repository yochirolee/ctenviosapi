const Joi = require("joi");

const isDate = (date) => {
	const schema = Joi.date().iso();
	const result = schema.validate(date);
	return result.error ? null : date;
};

module.exports = isDate;