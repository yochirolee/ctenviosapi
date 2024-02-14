const express = require("express");
const router = express.Router();
const mysqlService = require("../services/mysql/mysqlService");
const supabaseService = require("../services/supabase/supabaseService");
const { prismaService } = require("../services/prisma/prismaService");
const { formatInvoice } = require("../helpers/_formatInvoice");
const upload = require("../lib/_uploadExcel");
const readExcelData = require("../lib/_readExcel");
const validateExcelData = require("../helpers/_validateExcelData");

router.get("/", async (req, res) => {
	let result = await prismaService.tracking.getTracking();
	res.send(result);
});

router.get("/hbl/:hbl", async (req, res) => {
	try {
		if (!req.params.hbl) return res.json({ message: "HBL is required" });
		const pack = await mysqlService.packages.getPackageByHBL(req.params.hbl);

		const tracking = await prismaService.tracking.getTrackingByHBL(req.params.hbl);

		const newInvoice = await formatInvoice(pack, tracking);
		res.json(newInvoice);
	} catch (error) {
		console.log(error);
	}
});

router.get("/invoice/:invoiceId", async (req, res) => {
	try {
		const invoice = await mysqlService.invoices.getInvoiceById(req.params.invoiceId);
		const tracking = await prismaService.tracking.getTrackingByInvoiceId(req.params.invoiceId);
		const newInvoice = await formatInvoice(invoice, tracking);

		res.json(newInvoice);
	} catch (error) {
		console.log(error);
	}
});

// this route will move to a different file
router.post("/excel", upload, async (req, res) => {
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

				let existingInvoices = await mysqlService.invoices.findInvoices(invoicesId);

				const result = validateExcelData(existingInvoices, sheetData);
				const { data, error } = await supabaseService.upsertTracking(result);
				finalResult.push({
					container: sheet,
					updated: data?.length ? data.length : null,
					error: error ? error.message : null,
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
