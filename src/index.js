const express = require('express');
require('./db/mongoose');

const userRouter = require('./routers/user.router');
const taskRouter = require('./routers/task.router');

const app = express();
const port = process.env.PORT || 3000;

// const multer = require('multer');
// const upload = multer({
// 	dest: 'images',
// 	limits: {
// 		fileSize: 1000000,
// 	},
// 	fileFilter(req, file, cb) {
// 		// Using regular expressions
// 		if (!file.originalname.match(/\.(doc|docx)$/)) {
// 			return cb(new Error('Please upload a pdf'));
// 		}

// 		cb(undefined, true);
// 	},
// });

// app.post('/upload', upload.single('upload'), (req, res) => {
// 	res.send();
// });

app.use(express.json());

app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
	console.log(`Server is up on ${port}`);
});
