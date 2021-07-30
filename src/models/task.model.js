const mongoose = require('mongoose');

const Task = mongoose.model('Task', {
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
			ref: 'User' 
		},
		ownerName: {
			type: String,
			required: true,
		},
	},
});

module.exports = Task;
