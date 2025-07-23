import { useEffect, useState, useContext, useMemo } from 'react';
import { message } from 'antd';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

export default function EmploiEnseignant() {
  const { user, token } = useContext(AuthContext);
  const [emploi, setEmploi] = useState([]);

  useEffect(() => {
    if (!user?.id || !token) return;

    const fetchEmploi = async () => {
      try {
        const res = await api.get(`/api/emploi`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEmploi(res.data);
      } catch (err) {
        message.error("Erreur lors du chargement de l'emploi du temps");
      }
    };

    fetchEmploi();
  }, [user, token]);

  // 🔄 Regroupe l'emploi par niveau de classe
  const groupedByNiveau = useMemo(() => {
    return emploi.reduce((acc, creneau) => {
      const niveau = creneau.classe?.niveau || 'Inconnu';
      if (!acc[niveau]) acc[niveau] = [];
      acc[niveau].push(creneau);
      return acc;
    }, {});
  }, [emploi]);

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">📅 Mon Emploi du Temps</h2>

      {/* 🖥️ Version Desktop */}
      <div className="hidden md:block space-y-10">
        {Object.entries(groupedByNiveau).map(([niveau, creneaux]) => (
          <section key={niveau}>
            <h3 className="text-lg font-semibold mb-3">{niveau}</h3>
            <div className="overflow-x-auto rounded shadow">
              <table className="table w-full">
                <thead className="bg-base-200">
                  <tr>
                    <th>Jour</th>
                    <th>Heure</th>
                    <th>Classe</th>
                    <th>Matière</th>
                    <th>Salle</th>
                  </tr>
                </thead>
                <tbody>
                  {creneaux.map((c) => (
                    <tr key={c._id} className="hover">
                      <td>{c.jour_semaine}</td>
                      <td>{`${c.heure_debut} - ${c.heure_fin}`}</td>
                      <td>{c.classe?.nom || '-'}</td>
                      <td>{c.matiere?.nom || '-'}</td>
                      <td>{c.salle || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ))}
      </div>

      {/* 📱 Version Mobile */}
      <div className="md:hidden space-y-8">
        {Object.entries(groupedByNiveau).map(([niveau, creneaux]) => (
          <section key={niveau}>
            <h3 className="text-lg font-semibold mb-4">{niveau}</h3>
            <div className="space-y-4">
              {creneaux.map((c) => (
                <div
                  key={c._id}
                  className="card shadow bg-base-100 text-base-content p-4"
                >
                  <p><strong>Jour :</strong> {c.jour_semaine}</p>
                  <p><strong>Heure :</strong> {c.heure_debut} - {c.heure_fin}</p>
                  <p><strong>Classe :</strong> {c.classe?.nom}</p>
                  <p><strong>Matière :</strong> {c.matiere?.nom}</p>
                  <p><strong>Salle :</strong> {c.salle}</p>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
