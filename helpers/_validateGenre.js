const Joi = require("joi");

const validate = {
	genre: (genre) => {
		const schema = Joi.object({
			name: Joi.string().min(3).required(),
            created_at: Joi.date().min(8).required().messages({
                "date.base": "Date should be a valid date format",
                "date.empty": "Date should not be empty",
                "date.required": "Date is required",
            }),
		});

		return schema.validate(genre);
	},
};

module.exports = validate;
