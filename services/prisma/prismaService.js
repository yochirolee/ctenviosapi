const {PrismaClient}= require("@prisma/client");
const prisma = new PrismaClient();

const prismaService = {
	containers: {
		getContainers: async () => {
			try {
				const containers = await prisma.container.findMany();
				return containers;
			} catch (error) {
				console.log(error);
			}
		},
		getContainerById: async (containerId) => {
			try {
				const container = await prisma.container.findUnique({
					where: { id: Number(containerId) },
				});
				return container;
			} catch (error) {
				console.log(error);
			}
		},
	},

	tracking: {
		getTracking: async () => {
			try {
				const tracking = await prisma.tracking.findMany({ take: 100 });
				return tracking;
			} catch (error) {
				console.log(error);
			}
		},
		getTrackingByHBL: async (hbl) => {
			try {
				const tracking = await prisma.tracking.findMany({
					where: { hbl: hbl },
				});
				return tracking;
			} catch (error) {
				console.log(error);
			}
		},
		getTrackingByInvoiceId: async (invoiceId) => {
			try {
				const tracking = await prisma.tracking.findMany({
					where: { oldInvoiceId: Number(invoiceId) },
				});
				return tracking;
			} catch (error) {
				console.log(error);
			}
		},
		getTrackingByContainerId: async (containerId) => {
			try {
				const tracking = await prisma.tracking.findMany({
					where: { containerId: Number(containerId) },
				});
				return tracking;
			} catch (error) {
				console.log(error);
			}
		},
		updateTrackingByHBL: async (hbl, data) => {
			try {
				const tracking = await prisma.tracking.update({
					where: { hbl: hbl },
					data: data,
				});
				return tracking;
			} catch (error) {
				console.log(error);
			}
		},
	},
};

module.exports = { prismaService };
