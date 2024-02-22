const express = require("express");
const router = express.Router();
const mysqlService = require("../services/mysql/mysqlService");
const supabaseService = require("../services/supabase/supabaseService");
const { prismaService } = require("../services/prisma/prismaService");
const { formatInvoice } = require("../helpers/_formatInvoice");
const upload = require("../lib/_uploadExcel");
const readExcelData = require("../lib/_readExcel");
const validateExcelData = require("../helpers/_validateExcelData");
const isDate = require("../helpers/_isDate");
const uploadImage = require("../lib/_uploadImage");
const uploadImageToCloudinary = require("../services/cloudinary/cloudinadyService");

router.get("/", async (req, res) => {
	let result = await prismaService.tracking.getTracking();
	res.send(result);
});

router.get("/hbl/:hbl", async (req, res) => {
	try {
		if (!req.params.hbl) return res.json({ message: "HBL is required" });
		const pack = await mysqlService.packages.getPackageByHBL(req.params.hbl);

		const tracking = await prismaService.tracking.getTrackingByHBL(req.params.hbl);
		console.log(tracking, "tracking");
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
		console.log(req.params.invoiceId, tracking, "tracking");
		const newInvoice = await formatInvoice(invoice, tracking);

		res.json(newInvoice);
	} catch (error) {
		console.log(error);
	}
});

// update tracking from Excel File
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

router.post("/image", uploadImage,async (req, res) => {
	try {
		if (req.file === undefined) return res.status(400).send("Please upload an image file");
		const hbl= req.body.hbl;
		console.log(hbl, "hbl")
		console.log(req.file.originalname, "req.file");
		const url =await uploadImageToCloudinary(req.file,hbl);
		console.log(url, "url on router"	)
		res.json(url);
	} catch (error) {
		console.log(error);
	}
});

// get tracking by containerId
router.get("/container/:containerId", async (req, res) => {
	const tracking = await prismaService.tracking.getTrackingByContainerId(req.params.containerId);
	if (!tracking) return res.json({ message: "No tracking found for this container" });
	const delivered = tracking.filter((track) => track.status === "Entregado").length;
	const customs = tracking.filter((track) => track.status === "En Aduana").length;
	const transfert = tracking.filter((track) => track.status === "En Traslado").length;
	const transfertReady = tracking.filter((track) => track.status === "Listo para Traslado").length;
	const port = tracking.filter((track) => track.locationId === 5).length;

	res.json({
		data: tracking,
		tracking: {
			total: tracking.length,
			delivered: delivered,
			customs: customs,
			transfer: transfert,
			transferReady: transfertReady,
			port: port,
		},
	});
});

router.post("/containerToPort", async (req, res) => {
	try {
		const { containerId, date } = req.body;
		console.log(containerId, isDate(date), "containerId, portDate");
		if (!containerId) return res.json({ error: "ContainerId is required" });

		const container = await mysqlService.container.getPackagesByContainerId(containerId);
		const dataToUpsert = container.map((item) => {
			return {
				hbl: item.HBL,
				portDate: date,
				containerId: containerId,
				oldInvoiceId: item.InvoiceId,
				status: "Puerto del Mariel",
				locationId: 5,
			};
		});
		const { data, error } = await supabaseService.upsertTracking(dataToUpsert);
		if (error) return res.json({ error });
		res.json(data);
	} catch (error) {
		console.log(error);
	}
});

router.post("/containerToCustom", async (req, res) => {
	try {
		const { containerId, date } = req.body;
		console.log(containerId, isDate(date), "containerId, portDate");
		if (!containerId) return res.json({ error: "ContainerId is required" });

		const container = await mysqlService.container.getPackagesByContainerId(containerId);
		const dataToUpsert = container.map((item) => {
			return {
				hbl: item.HBL,
				customsDate: date,
				containerId: containerId,
				oldInvoiceId: item.InvoiceId,
				status: "Aduana",
				locationId: 6,
			};
		});
		console.log(dataToUpsert, "dateToUpsert")
		const { data, error } = await supabaseService.upsertTracking(dataToUpsert);
		if (error) return res.json({ error });
		res.json(data);
	} catch (error) {
		console.log(error);
	}
});

router.get("/containers", async (req, res) => {
	try {
		const containers = await mysqlService.container.getContainers();
		res.status(200).json(containers);
	} catch (error) {
		console.log(error);
	}
});

module.exports = router;
