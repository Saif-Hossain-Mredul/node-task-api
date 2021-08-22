const mongoose = require('mongoose');

const {conn} = require('../db/mongoose');

const taskSchema = new mongoose.Schema({
	description: {
		type: String,
		required: true,
		trim: true,
	},
	completed: {
		type: Boolean,
		default: false,
	},
	owner: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: 'User',
		},
		ownerName: {
			type: String,
			required: true,
		},
	},
}, {
	timestamps: true,
});

const Task = conn.model('Task', taskSchema);

module.exports = Task;
