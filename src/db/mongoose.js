const mongoose = require('mongoose');

const mongoURI = 'mongodb://127.0.0.1:27017/task-manager-api';

const connection = mongoose.connect(mongoURI, {
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true,
});
