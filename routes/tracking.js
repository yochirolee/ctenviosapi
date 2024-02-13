const express = require("express");
const router = express.Router();
const query = require("../services/mysql/query");
const mysql_service = require("../services/mysql/mysql_service");

router.get("/", async (req, res) => {
	let result = await query("SELECT * FROM `tracking` limit 10;");
	res.send(result);
});

router.post("/", async (req, res) => {
	try {
		const { invoices_array } = req.body;
		if (!invoices_array)
			return res
				.status(400)
				.send("Please provide invoices_array Example: {invoices_array: [1,2,3]}");
		let result = await mysql_service.findInvoices(invoices_array);
		res.send(result);
	} catch (err) {
		return res.status(500).send(err);
	}
});

module.exports = router;
