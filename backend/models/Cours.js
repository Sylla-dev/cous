const mongoose = require('mongoose');

const coursSchema = new mongoose.Schema({
  titre: { type: String, required: true },
  contenu: { type: String, required: true },
  date: { type: Date, default: Date.now },
  matiere: { type: mongoose.Schema.Types.ObjectId, ref: 'Matiere', required: true },
  classe: { type: mongoose.Schema.Types.ObjectId, ref: 'Classe', required: true },
  enseignant: { type: mongoose.Schema.Types.ObjectId, ref: 'Enseignant', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Cours', coursSchema);
