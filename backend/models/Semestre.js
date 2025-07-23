const mongoose = require('mongoose');

const semestreSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  dateDebut: { type: Date, required: true },
  dateFin: { type: Date, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Semestre', semestreSchema);
