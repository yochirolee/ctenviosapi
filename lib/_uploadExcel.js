const fs = require("fs");
const multer = require("multer");
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		const dir = "./uploads";
		if (!fs.existsSync(dir)) {
			fs.mkdirSync(dir);
		}
		cb(null, dir);
	},
	filename: (req, file, cb) => {
		cb(null, "excel.xlsx");
	},
});

multer({ storage: storage }).single("file");

const xlsxFilter = (req, file, cb) => {
	console.log("xlxs filter working");
	if (file.mimetype.includes("xlsx")) {
		cb(null, true);
	} else {
		cb("Please upload only xlsx file.", false);
	}
};

function uploadFile(req, res, next) {
	try{
	const upload = multer({ storage: storage }).single("file");
	upload.fileFilter = xlsxFilter;
	upload(req, res, function (err) {
		if (err instanceof multer.MulterError) {
			return res.status(500).json(err);
		} else if (err) {
			return res.status(500).json(err);
		}
		next();
	});}
	catch(err){
		console.log(err);
	}
}

module.exports = uploadFile;
