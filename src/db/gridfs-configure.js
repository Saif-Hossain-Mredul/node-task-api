const { GridFsStorage } = require('multer-gridfs-storage');
const crypto = require('crypto');
const path = require('path');

const mongoURI = 'mongodb://127.0.0.1:27017/task-manager-api';

const storageConfig = new GridFsStorage({
	url: mongoURI,
	file: (req, file) => {
		return new Promise((resolve, reject) => {
			crypto.randomBytes(16, (err, buf) => {
				if (err) {
					return reject(err);
				}

				const fileName = buf.toString(16) + path.extname(file.originalname);
				const fileInfo = {
					fileName,
					bucketName: 'avatars',
				};
				resolve(fileInfo);
			});
		});
	},
});

module.exports = storageConfig;
