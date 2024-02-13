const Joi = require("joi");

const validateDate = {
	isDate: (date) => {
		const schema = Joi.object({
			invoiceId: Joi.number().required(),
			containerId: Joi.number().required(),
			hbl: Joi.string().required(),
			number: Joi.number().required(),
			customDate: Joi.date(),
			pendingTransferDate: Joi.date(),
			transferDate: Joi.date(),
		});

		return schema.validate(date);
	},
};

module.exports = validateDate;
