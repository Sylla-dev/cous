const mongoose = require('mongoose');

const presenceSchema = new mongoose.Schema({
  eleve: { type: mongoose.Schema.Types.ObjectId, ref: 'Eleve', required: true },
  cours: { type: mongoose.Schema.Types.ObjectId, ref: 'Cours', required: true },
  date: { type: Date, default: Date.now },
  present: { type: Boolean, default: false }
});

presenceSchema.index({ eleve: 1, cours: 1, date: 1 }, { unique: true }); // éviter doublons

module.exports = mongoose.model('Presence', presenceSchema);
