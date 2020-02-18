const mongoose = require('mongoose');
const Entry = require('./entries');
const User = require('./user')

const JournalSchema = mongoose.Schema({
	id: {
		type:String,
		require: true
	},
	user: {
		type: mongoose.Schema.Types.ObjectId, ref: 'User',
	},
	posts: [{
		type: mongoose.Schema.Types.ObjectId, ref: 'Entry'
	}],
	name: {
		type: String,
		require: true
	},
	created_on: {
		type: Date,
		require: true
	}
})


const Journal = module.exports = mongoose.model('Journal', JournalSchema)