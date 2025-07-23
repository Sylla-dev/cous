const mongoose = require('mongoose');

const bulletinSchema = new mongoose.Schema({
  eleve: { type: mongoose.Schema.Types.ObjectId, ref: 'Eleve', required: true },
  classe: { type: mongoose.Schema.Types.ObjectId, ref: 'Classe', required: true },
  semestre: { type: Number, required: true },
  notes: [{
    matiere: { type: mongoose.Schema.Types.ObjectId, ref: 'Matiere' },
    moyenne: Number
  }],
  moyenneGenerale: Number,
  appreciation: String,
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Bulletin', bulletinSchema);
