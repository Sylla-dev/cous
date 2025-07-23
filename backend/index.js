const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const classeRoutes = require('./routes/classe');
const semestreRoutes = require('./routes/semestre');
const eleveRoutes = require('./routes/eleve');
const matiereRoutes = require('./routes/matiere');
const enseignantRoutes = require('./routes/enseignant');
const coursRoutes = require('./routes/cours');
const noteRoutes = require('./routes/notes');
const emploiRoutes = require('./routes/emploi');
const bulletinRoutes = require('./routes/bulletin');
const statRoutes = require('./routes/stats');
const presenceRoutes = require('./routes/presences');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/classes', classeRoutes);
app.use('/api/semestres', semestreRoutes);
app.use('/api/eleves', eleveRoutes);
app.use('/api/matieres', matiereRoutes);
app.use('/api/enseignants', enseignantRoutes);
app.use('/api/cours', coursRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/emploi', emploiRoutes);
app.use('/api/bulletins', bulletinRoutes);
app.use('/api/stats', statRoutes);
app.use('/api/presences', presenceRoutes);

const PORT = process.env.PORT || 5000

mongoose.connect(process.env.MONGO_URI)
     .then(() => {
		console.log('MongoDb connecte');
		app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
	 })
	 .catch(err => console.log(err));