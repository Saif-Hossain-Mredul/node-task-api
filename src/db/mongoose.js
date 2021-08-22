const mongoose = require('mongoose');
const Grid = require('gridfs-stream');

const mongoURI = 'mongodb://127.0.0.1:27017/task-manager-api';

// const connection = mongoose.connect(mongoURI, {
// 	useNewUrlParser: true,
// 	useCreateIndex: true,
// 	useUnifiedTopology: true,
// });

// const estbConnection = async (mongoURI) => {
// 	const conn = mongoose.createConnection(mongoURI, {
// 		useNewUrlParser: true,
// 		useCreateIndex: true,
// 		useUnifiedTopology: true,
// 	});

// 	let gfs;

// 	gfs = conn.once('open', async () => {
// 		gfs = Grid(conn.db, mongoose.mongo);
// 		gfs.collection('avatars');

// 		return gfs;
// 	});

// 	// console.log('printing outside', {conn, gfs});

// 	return { conn, gfs };
// };

// const getData = async () => {
// 	const data = await estbConnection(mongoURI);

// 	return data;
// };

// const data = getData();

const conn = mongoose.createConnection(mongoURI, {
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true,
});

let gfs;

gfs = conn.once('open', async () => {
	gfs = Grid(conn.db, mongoose.mongo);
	gfs.collection('avatars');

	// console.log('gfs', gfs);
	return gfs;
});

// console.log('printing gfs grid',gfs);
module.exports = { conn, gfs };
