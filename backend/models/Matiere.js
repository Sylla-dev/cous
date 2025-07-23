const mongoose = require('mongoose');

const matiereSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  coefficient: { type: Number, required: true },
  classe: { type: mongoose.Schema.Types.ObjectId, ref: 'Classe', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Matiere', matiereSchema);
