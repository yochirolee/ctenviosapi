const query = require("./query");

const mysql_service = {
	findInvoices: async (array_of_invoices_id) => {
		if (!array_of_invoices_id || array_of_invoices_id.length === 0) return [];
		return await query("SELECT HBL,InvoiceId,ContainerId FROM `tracking` where InvoiceId IN (?);", [
			array_of_invoices_id,
		]);
	},
};

module.exports = mysql_service;
