const mongoose = require('mongoose');
const User = require('./user')
const Journal = require('./journal')

const EntriesSchema = mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId, ref: 'User',
	},
	journal: {
		type: String,
		require: true
	},
	title: {
		type: Object,
		require: false
	},
	content: {
		type: Object,
		require: true
	},
	created_on: {
		type: Date,
		require: true
	}
})

const Entry = module.exports = mongoose.model('Entry', EntriesSchema)
