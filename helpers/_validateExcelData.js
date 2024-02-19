//Validate excel data
const isDate = require("./_isDate");
const validateExcelData = (mySqlData, excelData) => {
	try {
		if (!mySqlData || !excelData) return;

		return mySqlData?.map((item) => ({
			oldInvoiceId: item.InvoiceId,
			containerId: item.ContainerId,

			hbl: item.HBL,
			...findInvoices(item.InvoiceId, excelData),
		}));
	} catch (error) {
		console.log(error, "error on formatExcelData");
	}
};

const findInvoices = (invoiceId, excelData) => {
	const result = excelData.find((item) => item.invoiceId === invoiceId);
	const resultValidated = {
		customsDate: isDate(result.customsDate),
		pendingTransfertDate: isDate(result.pendingTransfertDate),
		invoiceDate: isDate(result.InvoiceDate),
		portDate: isDate(result.portDate),
		transfertDate: isDate(result.transfertDate),
		deliveredDate: isDate(result.deliveredDate),
		status: isDate(result.deliveredDate)
			? "Entregado"
			: isDate(result.transfertDate)
			? "En Traslado"
			: isDate(result.pendingTransfertDate)
			? "Listo para Traslado"
			: isDate(result.customDate)
			? "En Aduana"
			: isDate(result.portDate)
			? "en Puerto del Mariel"
			: result.customDate
			? result.customDate
			: result.pendingTransfertDate,
		locationId: isDate(result.deliveredDate)
			? 10 // Entregado
			: isDate(result.transfertDate)
			? 9 // En Traslado
			: isDate(result.pendingTransfertDate)
			? 8 // Listo para Traslado
			: isDate(result.customDate)
			? 6 // En Aduana
			: isDate(result.portDate)
			? 5 // en Puerto del Mariel
			: 1,

	};

	return resultValidated;
};

module.exports = validateExcelData;
