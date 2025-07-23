// pages/FicheEleve.js
import { useParams } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

export default function FicheEleve() {
    const { token } = useContext(AuthContext);
  const { id } = useParams();
  const [eleve, setEleve] = useState(null);

  useEffect(() => {
    const fetchEleve = async () => {
      const res = await api.get(`/api/classes/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEleve(res.data);
    };
    fetchEleve();
  }, [id]);

  if (!eleve) return <p>Chargement...</p>;

  return (
    <div className="p-6 max-w-xl mx-auto card bg-base-100 shadow">
      <h2 className="text-2xl font-bold mb-4">{eleve.nom}</h2>
      <p>Email : {eleve.email}</p>
      <p>
        Classe :{' '}
        {eleve.classe ? (
          <span className="badge badge-info">{eleve.classe.nom}</span>
        ) : (
          <span className="badge badge-outline">Non affecté</span>
        )}
      </p>
    </div>
  );
}
