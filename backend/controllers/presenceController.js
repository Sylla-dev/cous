const Presence = require('../models/Presence');
const Eleve = require('../models/Eleve');
const PDFDocument = require('pdfkit');

// 📌 Marquer la présence
exports.marquerPresence = async (req, res) => {
  try {
    const { eleveId, coursId, present } = req.body;
    const date = new Date().setHours(0, 0, 0, 0);

    const presence = await Presence.findOneAndUpdate(
      { eleve: eleveId, cours: coursId, date },
      { present },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.json(presence);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🔍 Voir les présences d'une classe
exports.getPresencesParClasse = async (req, res) => {
  try {
    const { classeId } = req.params;
    const eleves = await Eleve.find({ classe: classeId });

    const presences = await Promise.all(
      eleves.map(async (eleve) => {
        const today = new Date().setHours(0, 0, 0, 0);
        const presence = await Presence.findOne({ eleve: eleve._id, date: today });
        return {
          eleve,
          present: presence ? presence.present : null,
        };
      })
    );

    res.json(presences);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🔄 Historique d'un élève + taux de présence
exports.historiquePresenceEleve = async (req, res) => {
  try {
    const eleveId = req.params.id;

    if (!eleveId || eleveId === 'undefined') {
      return res.status(400).json({ error: 'ID élève invalide ou manquant' });
    }

    const presences = await Presence.find({ eleve: eleveId }).sort({ date: 1 });

    const total = presences.length;
    const presents = presences.filter(p => p.present).length;
    const taux = total > 0 ? (presents / total) * 100 : 0;

    res.json({
      total,
      presents,
      absents: total - presents,
      taux: taux.toFixed(1),
      historique: presences,
    });
  } catch (err) {
    console.error('Erreur historiquePresenceEleve:', err);
    res.status(500).json({ error: err.message });
  }
};

// 💾 Export PDF
exports.exportPresencePDF = async (req, res) => {
  try {
    const { eleveId } = req.params;
    const eleve = await Eleve.findById(eleveId);
    const presences = await Presence.find({ eleve: eleveId }).sort({ date: 1 });

    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="presence_${eleve.nom}.pdf"`);

    doc.pipe(res);
    doc.fontSize(20).text(`Historique de présence - ${eleve.nom}`, { align: 'center' });
    doc.moveDown();

    presences.forEach(p => {
      const d = new Date(p.date).toLocaleDateString();
      const status = p.present ? 'Présent' : 'Absent';
      doc.text(`${d}: ${status}`);
    });

    doc.end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getPresences = async (req, res) => {
  try {
    // Optionnel : filtrer par cours si coursId est fourni (ex: via /api/presences?coursId=xyz)
    const filter = {};
    if (req.query.coursId) {
      filter.cours = req.query.coursId;
    }

    const presences = await Presence.find(filter)
      .populate({
        path: 'eleve',
        select: 'nom prenom classe',
        populate: { path: 'classe', select: 'nom' }
      })
      .populate({
        path: 'cours',
        select: 'titre date classe',
        populate: { path: 'classe', select: 'nom' }
      })
      .sort({ date: -1 });

    // Filtrer les présences incomplètes (sécurité)
    const presencesFiltrees = presences.filter(p => p.eleve && p.cours);

    res.json(presencesFiltrees);
  } catch (err) {
    console.error('Erreur récupération des présences:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};


