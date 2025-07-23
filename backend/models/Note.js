const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  eleve: { type: mongoose.Schema.Types.ObjectId, ref: 'Eleve', required: true },
  matiere: { type: mongoose.Schema.Types.ObjectId, ref: 'Matiere', required: true },
  enseignant: { type: mongoose.Schema.Types.ObjectId, ref: 'Enseignant', required: true },
  classe: { type: mongoose.Schema.Types.ObjectId, ref: 'Classe', required: true },
  semestre: { type: mongoose.Schema.Types.ObjectId, ref: 'Semestre', required: true },
  type: { type: String, enum: ['Devoir', 'Composition'], required: true },
  valeur: { type: Number, required: true },
  date: { type: Date, default: Date.now },
});


module.exports = mongoose.model('Note', noteSchema);
