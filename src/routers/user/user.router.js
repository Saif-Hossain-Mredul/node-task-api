const express = require('express');
const multer = require('multer');

const User = require('../../models/user.model');
const auth = require('../../middlewares/auth.middleware');
const storage = require('../../db/gridfs-configure');
const mongoose = require('mongoose');
const Grid = require('gridfs-stream');

const { conn } = require('../../db/mongoose');
const createUser = require('./route-functions/create-user.rf');
const loginUser = require('./route-functions/login-user.rf');
const logOut = require('./route-functions/logout-user.rf');
const logOutAllSessions = require('./route-functions/logoutAll.rf');
const getUser = require('./route-functions/get-user.rf');
const updateUserById = require('./route-functions/update-user-by-id.rf');
const deleteUser = require('./route-functions/delete-user.rf');
const deleteAvatar = require('./route-functions/delete-avatar.rf');

const userRouter = new express.Router();

// Create user
userRouter.post('/users', createUser);

// Login user
userRouter.post('/users/login', loginUser);

// Logging out user
userRouter.post('/users/logout', auth, logOut);

// Logging out from all sessions
userRouter.post('/users/logoutAll', auth, logOutAllSessions);

// Get profile
userRouter.get('/users/me', auth, getUser);

// Update an user by his id
userRouter.patch('/users/me', auth, updateUserById);

// Delete and use by his id
userRouter.delete('/users/me', auth, deleteUser);

// Init gfs
let gfs;

conn.once('open', async () => {
	// Init stream
	gfs = Grid(conn.db, mongoose.mongo);
	gfs.collection('avatars');
});

const upload = multer({
	storage,
	// limits: {
	// 	fileSize: 1000000,
	// },
	fileFilter(req, file, cb) {
		if (!file.originalname.match(/\.(jpg|jpeg|png|mp3)$/)) {
			return cb(new Error('Please upload an image'));
		}

		cb(undefined, true);
	},
});

userRouter.get('/files/:filename', async (req, res) => {
	const file = await gfs.files.findOne({ filename: req.params.filename });

	if (!file || file.length === 0) {
		return res.status(404).json({
			err: 'No file exists',
		});
	}
	// File exists
	const readstream = gfs.createReadStream(file.filename);
	readstream.pipe(res);
	// return res.json(file);
});

userRouter.post(
	'/users/me/avatar',
	auth,
	upload.single('file'),
	async (req, res) => {
		// console.log(req.file);
		console.log(req.fileInfo);

		const fileUp = await gfs.files.findOne({
			filename: req.fileInfo.filename,
		});

		try {
			req.user.avatar = fileUp;
			await req.user.save();

			res.send(req.user);
		} catch (err) {
			console.log(err);
			res.status(400).send();
		}
	},
	(error, req, res, next) => {
		res.status(400).send({ error: error.message });
	}
);

// Delete avatar
userRouter.delete('/users/me/avatar', auth, deleteAvatar);

userRouter.get('/users/:id/avatar', async (req, res) => {
	try {
		const user = await User.findById(req.params.id);

		if (!user || !user.avatar) throw new Error();

		// res.set('Content-Type', 'image/jpg')
		res.send(user.avatar);
	} catch (err) {
		res.status(404).send();
	}
});

module.exports = userRouter;
