import { useEffect, useState, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { message } from 'antd';

export default function MoyennesEleve() {
  const { user, token } = useContext(AuthContext);
  const [moyennes, setMoyennes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMoyennes = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/api/notes/eleve/${user._id}/moyennes`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMoyennes(res.data);
      } catch (err) {
        console.error(err);
        message.error("Erreur lors du chargement des moyennes.");
      } finally {
        setLoading(false);
      }
    };
    if (user?._id && token) {
      fetchMoyennes();
    }
  }, [user, token]);

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Mes Moyennes</h2>

      {/* Table desktop */}
      <table className="min-w-full border-collapse border mb-6 hidden md:table">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2 border">Matière</th>
            <th className="p-2 border">Semestre</th>
            <th className="p-2 border">Moyenne</th>
            <th className="p-2 border">Nombre de Notes</th>
          </tr>
        </thead>
        <tbody>
          {!loading && moyennes.length === 0 && (
            <tr>
              <td colSpan={4} className="p-4 text-center text-gray-500">
                Aucune moyenne disponible.
              </td>
            </tr>
          )}
          {moyennes.map((item, idx) => (
            <tr key={item._id || idx} className="hover:bg-gray-50">
              <td className="p-2 border">{item.matiere}</td>
              <td className="p-2 border">{item.semestre}</td>
              <td className="p-2 border font-semibold">
                {typeof item.moyenne === 'number' ? item.moyenne.toFixed(2) : '—'}
              </td>
              <td className="p-2 border">{item.count ?? '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Cartes mobiles */}
      <div className="space-y-4 md:hidden">
        {loading && <p>Chargement...</p>}
        {!loading && moyennes.length === 0 && (
          <p className="text-center text-gray-500">Aucune moyenne disponible.</p>
        )}
        {moyennes.map((item, idx) => (
          <div
            key={item._id || idx}
            className="border rounded p-4 shadow-sm bg-white"
          >
            <p><strong>Matière :</strong> {item.matiere}</p>
            <p><strong>Semestre :</strong> {item.semestre}</p>
            <p><strong>Moyenne :</strong> {typeof item.moyenne === 'number' ? item.moyenne.toFixed(2) : '—'}</p>
            <p><strong>Nombre de Notes :</strong> {item.count ?? '—'}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
