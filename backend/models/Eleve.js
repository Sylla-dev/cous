const mongoose = require('mongoose');

const eleveSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  prenom: { type: String, required: true },
  matricule: { type: String, required: true, unique: true },
  genre: { type: String, enum: ['Masculin', 'Féminin'], required: true },
  dateNaissance: { type: Date, required: true },
  classe: { type: mongoose.Schema.Types.ObjectId, ref: 'Classe', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Eleve', eleveSchema);
