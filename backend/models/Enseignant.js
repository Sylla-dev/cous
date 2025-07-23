const mongoose = require('mongoose');

const enseignantSchema = new mongoose.Schema({
  nom: String,
  email: String,
  password: String,
  classes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Classe' }],
  matieres: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Matiere' }],
  emploiDuTemps: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Emploi' }],
  cahierCharges: {
    type: String, // ou un fichier PDF si tu veux
    default: ''
  }
});

module.exports = mongoose.model('Enseignant', enseignantSchema);
