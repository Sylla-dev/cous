const mongoose = require('mongoose');

const emploiSchema = new mongoose.Schema({
  classe: { type: mongoose.Schema.Types.ObjectId, ref: 'Classe', required: true },
  enseignant: { type: mongoose.Schema.Types.ObjectId, ref: 'Enseignant', required: true },
  matiere: { type: mongoose.Schema.Types.ObjectId, ref: 'Matiere', required: true },
  jour_semaine: { type: String, enum: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'], required: true },
  heure_debut: { type: String, required: true }, // Format HH:mm
  heure_fin: { type: String, required: true },
  salle: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Emploi', emploiSchema);
