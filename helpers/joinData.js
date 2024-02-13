const { valid } = require("joi");
const validateDate = require("./_validateDate.js");

const joinData = (mySqlData, excelData) => {
	try {
		if (!mySqlData || !excelData) return;
		return mySqlData?.map((item) => ({
			invoiceId: item.InvoiceId,
			containerId: item.ContainerId,
			hbl: item.HBL,
			...excelData.find((excelItem) => excelItem.invoiceId === item.InvoiceId),
		}));
	} catch (error) {
		throw new Error(error);
	}
};

module.exports = joinData;
