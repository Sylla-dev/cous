import { Routes, Route } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Eleves from './pages/Eleves';
import Cours from './pages/Cours';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './layouts/MainLayout';
import Classes from './pages/Classes';
import Semestres from './pages/Semestres';
import Matieres from './pages/Matieres';
import Enseignants from './pages/Enseignants';
import MesClasses from './pages/MesClasses';
import ListeCoursEleve from './pages/ListeCoursEleve';
import AjouterNote from './pages/AjouterNote';
import ListeNotesEleve from './pages/ListeNotesEleve';
import AnalyseNotes from './components/AnalyseNotes';
import ListeNotesEnseignant from './pages/ListeNotesEnseignant';
import ModifierNote from './pages/ModifierNote';
import EmploiEnseignant from './pages/EmploiEnseignant';
import EmploiEleve from './pages/EmploiEleve';
import AjoutEmploi from './pages/AjoutEmploi';
import AdminEmploiPage from './pages/admin-emploi';
import NotesEleve from './components/NotesEleve';
import MoyennesEleve from './components/MoyennesEleve';
import BulletinsAdmin from './pages/BulletinAdmin';
import BulletinDetails from './components/BulletinDetails';
import AjouterBulletin from './pages/AjouterBulletin';
import AffecterClasse from './pages/AffecterClasse';
import ClasseDetail from './pages/ClasseDetail';
import AdminEnseignantAffectation from './pages/AdminEnseignantAffectation';
import MarquagePresence from './components/MarquagePresence';
import ListePresences from './pages/ListePresences';

export default function App() {
  return (
    <Routes>
      {/* Routes publiques */}
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />

      {/* Routes protégées (authentification requise) */}
      <Route
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Dashboard />} />
        <Route path="/eleves" element={<Eleves />} />
        <Route path="/cours" element={<Cours />} />
        <Route path="/classes" element={<Classes />} />
        <Route path="/semestres" element={<Semestres />} />
        <Route path="/matieres" element={<Matieres />} />
        <Route path="/enseignants" element={<Enseignants />} />
        <Route path="/enseignants/mes-classes" element={<MesClasses />} />
        <Route path="/par-eleves" element={<ListeCoursEleve />} />
        <Route path="/notes-liste" element={<ListeNotesEleve />} />
        <Route path="/analyse-notes" element={<AnalyseNotes />} />
        <Route path="/eleve/emploi" element={<EmploiEleve />} />
        <Route path="/admin/emplois/add" element={<AjoutEmploi />} />
        <Route path="/admin/emploi" element={<AdminEmploiPage />} />
        <Route path="/eleve/notes" element={<NotesEleve />} />
        <Route path="/eleve/moyennes" element={<MoyennesEleve />} />
        <Route path="/admin/bulletins" element={<BulletinsAdmin />} />
        <Route path="/admin/bulletins/:id" element={<BulletinDetails />} />
        <Route path="/admin/bulletins/add" element={<AjouterBulletin />} />
        <Route path='/eleves/:id/affecter' element={<AffecterClasse />} />
        <Route path='/eleves/:id' element={<ClasseDetail />} />
        <Route path='/admin/affecter-enseignant' element={<AdminEnseignantAffectation />} />
        <Route path='admin/presences' element={<ListePresences />} />
        {/* 🧑‍🏫 Routes Enseignant */}
        <Route path="/enseignant/notes" element={<ListeNotesEnseignant />} />
        <Route path="/enseignant/notes/add" element={<AjouterNote />} />
        <Route path="/enseignant/notes/modifier/:id" element={<ModifierNote />} />
        <Route path="/enseignant/emplois/:id" element={<EmploiEnseignant />} />
        <Route path='/cours/:coursId/presence' element={<MarquagePresence />} />
      </Route>
        
        
      

      {/* Route 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
