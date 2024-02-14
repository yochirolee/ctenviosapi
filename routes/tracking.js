const express = require("express");
const router = express.Router();
const mysqlService = require("../services/mysql/mysqlService");
const { prismaService } = require("../services/prisma/prismaService");
const { formatInvoice } = require("../helpers/_formatInvoice");

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
router.post("/", async (req, res) => {
	try {
		const { invoicesArray } = req.body;
		if (!invoicesArray)
			return res.status(400).send("Please provide invoicesArray Example: {invoicesArray: [1,2,3]}");
		let result = await mysqlService.findInvoices(invoicesArray);
		res.send(result);
	} catch (err) {
		return res.status(500).send(err);
	}
});

module.exports = router;
