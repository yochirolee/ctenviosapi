const express = require("express");
const router = express.Router();
const upload = require("../lib/_uploadExcel");
const readExcelData = require("../lib/_readExcel");
const myslqService = require("../services/mysql/mysqlService");
const joinData = require("../helpers/_joinData");

router.post("/", upload, async (req, res) => {
	try {
		if (req.file === undefined) {
			return res.status(400).send("Please upload an excel file");
		}

		if (req.file.mimetype !== "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
			return res.status(400).send("Please upload only xlsx file");
		}

		const excelData = readExcelData(req.file.path);
		if (excelData === undefined) {
			return res.status(500).send("Error reading excel file");
		}

		const sheets = Object.keys(excelData);
		const finalResult = [];
		if (sheets?.length === 0)
			return res.status(500).send("Error reading excel file no sheet data found.");

		await Promise.all(
			sheets.map(async (sheet) => {
				const sheetData = excelData[sheet];
				if (!sheetData)
					return res.status(500).send("Error reading excel file no sheet data found.");

				const uniqueInvoices = [...new Set(sheetData?.map((item) => item?.invoiceId))];
				const invoicesId = uniqueInvoices?.filter((item) => Number(item));

				let existingInvoices = await myslqService.invoices.findInvoices(invoicesId);

				const result = joinData(existingInvoices, sheetData);

				finalResult.push({
					sheet: sheet,
					invoicesCount: invoicesId?.length,
					hblCount: result?.length,
					result: result,
				});
			}),
		);
		res.send({
			message: "Excel file uploaded successfully.",
			finalResult: finalResult,
		});
	} catch (err) {
		console.log(err, "error on reading excel file");
		return res.status(500).send(err);
	}
});

module.exports = router;
