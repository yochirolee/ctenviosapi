const excelToJson = require("convert-excel-to-json");

const readExcelData = (tempFilePath) => {
	if (!tempFilePath) return;
	try {
		const excelData = excelToJson({
			sourceFile: tempFilePath,
			columnToKey: {
				A: "number",
				E: "invoiceId",
				B: "customDate",
				C: "pendingTransferDate",
				D: "transferDate",
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
