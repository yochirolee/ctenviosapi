const config = {
	host: "systemcaribetravel.com",
	user: "u373067935_caeenvio_mysgc",
	password: "CaribeAgencia*2022",
	database: "u373067935_cte",
	connectionLimit: 10,
	dateStrings: true,
	multipleStatements: true,
	waitForConnections: true,
	connectionLimit: 10,
	maxIdle: 10, // max idle connections, the default value is the same as `connectionLimit`
	idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
	queueLimit: 0,
	enableKeepAlive: true,
	keepAliveInitialDelay: 0,
};

module.exports = config;
