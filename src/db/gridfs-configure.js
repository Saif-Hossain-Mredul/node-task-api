const path = require('path');
const crypto = require('crypto');
const { GridFsStorage } = require('multer-gridfs-storage');

const mongoURI = 'mongodb://127.0.0.1:27017/task-manager-api';

const storage = new GridFsStorage({
	url: mongoURI,
	file: async (req, file) => {
		return new Promise((resolve, reject) => {
			console.log('came here');
			crypto.randomBytes(16, (err, buf) => {
				if (err) {
					return reject(err);
				}
				const filename =
					buf.toString('hex') + path.extname(file.originalname);
				const fileInfo = {
					filename: filename,
					bucketName: 'avatars',
				};
				
				console.log(fileInfo);
				req.fileInfo = fileInfo;
				resolve(fileInfo);
			});
		});
	},
});

module.exports = storage;
