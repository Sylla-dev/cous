import { useContext, useEffect, useState } from 'react';
import api from '../services/api';
import { Select } from 'antd';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function AffecterClasse() {
  const { token } = useContext(AuthContext);
  const [eleves, setEleves] = useState([]);
  const [classes, setClasses] = useState([]);
  const [selectedEleve, setSelectedEleve] = useState(null);
  const [selectedClasse, setSelectedClasse] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/api/eleves', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setEleves(res.data);

        const res1 = await api.get('/api/classes', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setClasses(res1.data);
      } catch (err) {
        console.error('Erreur de chargement des données :', err);
      }
    };

    fetchData();
  }, [token]);

  const handleAffectation = async () => {
    if (!selectedEleve || !selectedClasse) return;

    try {
      await api.put(
        `/api/eleves/${selectedEleve}/affecter`,
        { classeId: selectedClasse },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert('Élève affecté à la classe avec succès');
      setTimeout(() => navigate('/eleves'), 2000);
    } catch (err) {
      console.error('Erreur affectation :', err);
      alert('Erreur lors de l\'affectation');
    }
  };

  return (
    <div className="p-4 space-y-4 max-w-lg mx-auto">
      <h2 className="text-xl font-bold">Affecter un élève à une classe</h2>

      <Select
        placeholder="Choisir un élève"
        className="w-full"
        options={eleves.map(e => ({ label: e.nom, value: e._id }))}
        onChange={val => setSelectedEleve(val)}
      />

      <Select
        placeholder="Choisir une classe"
        className="w-full"
        options={classes.map(c => ({ label: c.nom, value: c._id }))}
        onChange={val => setSelectedClasse(val)}
      />

      <button className="btn btn-primary w-full" onClick={handleAffectation}>
        Affecter
      </button>
    </div>
  );
}
