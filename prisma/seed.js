const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const userData = [
	{
		name: "Alice",
		email: "alice@prisma.io",
		posts: {
			create: [
				{
					title: "Join the Prisma Slack",
					content: "https://slack.prisma.io",
					published: true,
				},
			],
		},
	},
	{
		name: "Nilu",
		email: "nilu@prisma.io",
		posts: {
			create: [
				{
					title: "Follow Prisma on Twitter",
					content: "https://www.twitter.com/prisma",
					published: true,
					viewCount: 42,
				},
			],
		},
	},
	{
		name: "Mahmoud",
		email: "mahmoud@prisma.io",
		posts: {
			create: [
				{
					title: "Ask a question about Prisma on GitHub",
					content: "https://www.github.com/prisma/prisma/discussions",
					published: true,
					viewCount: 128,
				},
				{
					title: "Prisma on YouTube",
					content: "https://pris.ly/youtube",
				},
			],
		},
	},
];

const locations = [
	{ name: "Facturado" },
	{ name: "Despacho" },
	{ name: "En Pallet" },
	{ name: "En Contenedor" },
	{ name: "En Puerto del Mariel" },
	{ name: "Aduana" },
	{ name: "Canal Rojo" },
	{ name: "Listo para Traslado" },
	{ name: "En Traslado" },
	{ name: "Entregado" },
];

async function main() {
	console.log(`Start seeding ...`);
	
	for (const l of locations) {
		const location = await prisma.trackingLocations.create({
			data: l,
		});
		console.log(`Created location with id: ${location.id}`);
	}
	console.log(`Seeding finished.`);
}

main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
