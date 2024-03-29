const query = require("./query");

const mysqlService = {
	invoices: {
		findInvoices: async (array_of_invoices_id) => {
			if (!array_of_invoices_id || array_of_invoices_id.length === 0) return [];
			return await query(
				"SELECT HBL,InvoiceId,ContainerId FROM `tracking` where InvoiceId IN (?);",
				[array_of_invoices_id],
			);
		},
		getInvoicesLimit: async (limit) => {
			if (!limit) return [];
			try {
				const invoicesFound = await query(
					"SELECT * FROM `tracking` order by InvoiceId DESC LIMIT ?;",
					[limit],
				);
				return invoicesFound;
			} catch (error) {
				console.log(error);
			}
		},
		getInvoiceById: async (invoiceId) => {
			try {
				const invoiceFound = await query("select * from tracking where InvoiceId=?", [invoiceId]);
				if (invoiceFound?.length === 0) return [];
				return invoiceFound;
			} catch (error) {
				console.log(error);
			}
		},
	},
	packages: {
		getPackageByHBL: async (hbl) => {
			try {
				const packagesFound = await query("select * from tracking where HBL=?", [hbl]);
				if (packagesFound?.length === 0) return [];
				return packagesFound;
			} catch (error) {
				console.log(error);
			}
		},
	},

	customers: {
		getCustomerById: async (customerId) => {
			try {
				const customer = {};
				const [result] = await query("select * from clientes where codigo=?", [customerId]);
				if (result?.length === 0) return [];
				customer.name = result?.nombre + " " + result?.nombre2;
				customer.lastName = result?.apellido + " " + result?.apellido2;
				customer.mobile = result?.cel;
				customer.phone = result?.tel;

				return customer;
			} catch (error) {
				console.log(error);
			}
		},
	},
	recievers: {
		getRecieverById: async (id) => {
			try {
				const [result] = await query("SELECT * FROM destinatarios WHERE codigo=?", [id]);
				if(result?.length === 0) return [];
				const [state] = await query("SELECT ciudad as Province FROM ciudades where id=?", [
					result.estado,
				]);
				const [city] = await query(
					"SELECT ciudad as Municipality FROM ciudades_cuba where codigo=?",
					[result.ciudad],
				);
				const reciever = {};

				reciever.name = result?.nombre + " " + result?.nombre2;
				reciever.lastName = result?.apellido + " " + result?.apellido2;
				reciever.mobile = result?.cel;
				reciever.phone = result?.tel;
				reciever.ci = result?.documento;
				reciever.passport = result?.pasaporte;
				reciever.address =
					result?.cll +
					" " +
					result?.entre_cll +
					" " +
					"No: " +
					result?.no +
					" " +
					result?.apto +
					" " +
					result?.reparto;
				reciever.province = state?.Province;
				reciever.municipality = city?.Municipality;
				return reciever;
			} catch (error) {
				console.log(error);
			}
		},
	},
	pallets: {
		getPalletById: async (id) => {
			try {
				const [result] = await query("SELECT * FROM pallets WHERE codigo=?", [id]);
				return result;
			} catch (error) {
				console.log(error);
			}
		},
	},
	dispatch: {
		getDispatchById: async (id) => {
			try {
				const dispatchId = id.slice(1);
				const [result] = await query("SELECT fecha as createdAt FROM despachos WHERE codigo=?", [
					dispatchId,
				]);
				return result?.createdAt;
			} catch (error) {
				console.log(error);
			}
		},
	},
	container: {
		getContainerById: async (id) => {
			try {
				const [result] = await query(
					"select codigo as containerId, fecha as createdAt, numero as containerNumber, servicio as service, master, paquetes as packages,peso as weight from contenedores WHERE codigo=?",
					[id],
				);
				return result;
			} catch (error) {
				console.log(error);
			}
		},
		getContainers: async () => {
			try {
				const result = await query(
					"select codigo as containerId, fecha as createdAt, numero as containerNumber, servicio as service, master, paquetes as packages,peso as weight from contenedores order by codigo DESC;",
				);
				return result;
			} catch (error) {
				console.log(error);
			}
		},
		getPackagesByContainerId: async (id) => {
			try {
				const result = await query("select hbl,InvoiceId from tracking where containerId=?", [id]);
				return result;
			} catch (error) {
				console.log(error);
			}
		},
	},
};

module.exports = mysqlService;
