const mongoose = require('mongoose');

const classeSchema = new mongoose.Schema({
	nom: { type: String, required: true },
	niveau: { type: String, required: true },
	section: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Classe', classeSchema);