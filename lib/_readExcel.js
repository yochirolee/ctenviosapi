const excelToJson = require("convert-excel-to-json");

const readExcelData = (tempFilePath) => {
	if (!tempFilePath) return;
	try {
		const excelData = excelToJson({
			sourceFile: tempFilePath,
			columnToKey: {
				A: "number",
				E: "invoiceId",
				B: "customsDate",
				C: "pendingTransfertDate",
				D: "transfertDate",
				F: "deliveredDate",
			},
			header: {
				rows: 4,
			},
		});
		return excelData;
	} catch (err) {
		console.log(err, "error on reading excel file");
	}
};

module.exports = readExcelData;
