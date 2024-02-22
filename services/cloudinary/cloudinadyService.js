const config = require("./config");
const cloudinary = require("cloudinary").v2;
cloudinary.config(config);
const { Readable } = require("stream");
const sharp = require("sharp");

const bufferToStream = (buffer) => {
	const readable = new Readable({
		read() {
			this.push(buffer);
			this.push(null);
		},
	});
	return readable;
};

const uploadImageToCloudinary = async (file,hbl) => {
	try {
		if (!file) throw new Error("No file provided");
        file.filename = hbl
		const data = await sharp(file.buffer).webp({ quality: 10 }).toBuffer();
		const result = await new Promise((resolve, reject) => {
			const stream = cloudinary.uploader.upload_stream(
				{ folder: "ctenvios", public_id: file.filename},
				(error, result) => {
					if (error) {
						reject(error);
					} else {
						resolve(result);
					}
				},
			);

			bufferToStream(data).pipe(stream);
		});

		return result.secure_url;
	} catch (error) {
		console.error(error);
	}
};

module.exports = uploadImageToCloudinary;
