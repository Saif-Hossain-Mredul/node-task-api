const mongoose = require('mongoose');
const Grid = require('gridfs-stream');

const mongoURI = 'mongodb://127.0.0.1:27017/task-manager-api';

// const connection = mongoose.connect(mongoURI, {
// 	useNewUrlParser: true,
// 	useCreateIndex: true,
// 	useUnifiedTopology: true,
// });

const conn = mongoose.createConnection(mongoURI, {
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true,
});

let gfs;

conn.once('open', async () => {
	// Init stream
	gfs = Grid(conn.db, mongoose.mongo);
	gfs.collection('avatars');
});

module.exports = { conn, gfs };
