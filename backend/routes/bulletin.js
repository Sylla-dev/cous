const express = require('express');
const router = express.Router();
const Note = require('../models/Note');
const Eleve = require('../models/Eleve');
const Bulletin = require('../models/Bulletin');
const Classe = require('../models/Classe');
const PDFDocument = require('pdfkit');
const moment = require('moment');
require('moment/locale/fr');
moment.locale('fr');

// Lister tous les bulletins
router.get('/', async (req, res) => {
  const bulletins = await Bulletin.find().populate('eleve classe notes.matiere');
  res.json(bulletins);
});

// ➕ Créer un bulletin
router.post('/', async (req, res) => {
  try {
    const { eleve, classe, semestre, notes, appreciation } = req.body;

    const moyenneGenerale = notes.reduce((sum, n) => sum + n.moyenne, 0) / notes.length;

    const newBulletin = new Bulletin({
      eleve,
      classe,
      semestre,
      notes,
      moyenneGenerale,
      appreciation,
    });

    await newBulletin.save();
    res.status(201).json(newBulletin);
  } catch (err) {
    res.status(500).json({ error: 'Erreur création bulletin' });
  }
});

// ❌ Supprimer
router.delete('/:id', async (req, res) => {
  try {
    await Bulletin.findByIdAndDelete(req.params.id);
    res.json({ message: 'Supprimé' });
  } catch (err) {
    res.status(500).json({ error: 'Erreur suppression' });
  }
});

// Détails bulletin
router.get('/:id', async (req, res) => {
  const bulletin = await Bulletin.findById(req.params.id)
    .populate('eleve classe notes.matiere');
  res.json(bulletin);
});

// 📝 Modifier un bulletin
router.put('/:id', async (req, res) => {
  try {
    const { eleve, classe, semestre, notes, appreciation } = req.body;

    const moyenneGenerale = notes.reduce((sum, n) => sum + n.moyenne, 0) / notes.length;

    const updated = await Bulletin.findByIdAndUpdate(
      req.params.id,
      { eleve, classe, semestre, notes, moyenneGenerale, appreciation },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Erreur modification bulletin' });
  }
});

router.post('/generer/:eleveId', async (req, res) => {
  const { eleveId } = req.params;
  const semestre = parseInt(req.query.semestre);

  try {
    const eleve = await Eleve.findById(eleveId).populate('classe');
    if (!eleve) return res.status(404).json({ error: "Élève non trouvé" });

    // Regrouper les notes par matière
    const notes = await Note.find({ eleve: eleveId, semestre }).populate('matiere');
    if (!notes.length) return res.status(400).json({ error: "Aucune note pour ce semestre" });

    const notesParMatiere = {};
    notes.forEach(note => {
      const key = note.matiere._id;
      if (!notesParMatiere[key]) {
        notesParMatiere[key] = { matiere: note.matiere, valeurs: [] };
      }
      notesParMatiere[key].valeurs.push(note.valeur);
    });

    // Calcul des moyennes
    const notesFinales = [];
    let total = 0;
    let count = 0;

    for (const matiereId in notesParMatiere) {
      const { matiere, valeurs } = notesParMatiere[matiereId];
      const moyenne = valeurs.reduce((a, b) => a + b, 0) / valeurs.length;

      notesFinales.push({ matiere: matiere._id, moyenne });
      total += moyenne;
      count++;
    }

    const moyenneGenerale = total / count;

    // Créer bulletin
    const nouveauBulletin = new Bulletin({
      eleve: eleve._id,
      classe: eleve.classe._id,
      semestre,
      notes: notesFinales,
      moyenneGenerale,
      appreciation: moyenneGenerale >= 10 ? "Bon travail" : "Doit faire des efforts"
    });

    await nouveauBulletin.save();
    res.status(201).json({ message: "Bulletin généré", bulletin: nouveauBulletin });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur lors de la génération du bulletin" });
  }
});


// 📄 Export PDF d’un bulletin
router.get('/pdf/:id', async (req, res) => {
  try {
    const bulletin = await Bulletin.findById(req.params.id)
      .populate('eleve')
      .populate('classe')
      .populate('notes.matiere');

    if (!bulletin) return res.status(404).json({ error: 'Bulletin non trouvé' });

    const doc = new PDFDocument({ margin: 50 });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename=bulletin_${bulletin.eleve.nom}.pdf`);
    doc.pipe(res);

    doc.fontSize(18).text(`Bulletin Scolaire - Semestre ${bulletin.semestre}`, { align: 'center' }).moveDown();

    doc.fontSize(12)
      .text(`Nom de l'élève : ${bulletin.eleve.nom}`)
      .text(`Classe : ${bulletin.classe.nom}`)
      .text(`Date : ${moment().format('LL')}`)
      .moveDown();

    doc.fontSize(14).text('Notes :', { underline: true }).moveDown(0.5);

    bulletin.notes.forEach(note => {
      doc.text(`${note.matiere.nom} : ${note.moyenne.toFixed(2)}/20`);
    });

    doc.moveDown().fontSize(13).text(`Moyenne Générale : ${bulletin.moyenneGenerale.toFixed(2)}/20`);
    doc.moveDown().fontSize(12).text(`Appréciation : ${bulletin.appreciation}`);

    doc.end();
  } catch (err) {
    res.status(500).json({ error: 'Erreur PDF' });
  }
});


module.exports = router;
