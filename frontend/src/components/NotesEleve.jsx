import { useEffect, useState, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { Table, message } from 'antd';

export default function NotesEleve() {
  const { user, token } = useContext(AuthContext);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user?._id || !token) return;

    const fetchNotes = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/api/notes/eleve/${user._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNotes(res.data || []);
      } catch (err) {
        message.error("Erreur lors du chargement des notes");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotes();
  }, [user, token]);

  const columns = [
    {
      title: 'Matière',
      dataIndex: ['matiere', 'nom'],
      key: 'matiere',
      responsive: ['md'], // affiché à partir de md (table responsive d'antd)
    },
    {
      title: 'Note',
      dataIndex: 'valeur',
      key: 'valeur',
      render: (val) => (typeof val === 'number' ? val.toFixed(2) : val),
      responsive: ['sm'], // visible dès sm (pour garder visible sur mobile)
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      responsive: ['md'],
    },
    {
      title: 'Semestre',
      dataIndex: 'semestre',
      key: 'semestre',
      responsive: ['md'],
    },
  ];

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Mes Notes</h2>

      {/* Table responsive via antd */}
      <Table
        dataSource={notes}
        columns={columns}
        rowKey="_id"
        loading={loading}
        pagination={false}
        scroll={{ x: 'max-content' }}
        locale={{ emptyText: loading ? 'Chargement...' : 'Aucune note disponible' }}
      />

      {/* Vue cartes mobile custom (optionnel si tu préfères un rendu plus lisible sur petit écran) */}
      <div className="md:hidden mt-4 space-y-3">
        {loading && <p>Chargement...</p>}
        {!loading && notes.length === 0 && (
          <p className="text-center text-gray-500">Aucune note disponible.</p>
        )}
        {notes.map((note) => (
          <div key={note._id} className="border rounded p-4 shadow-sm bg-white">
            <p><strong>Matière:</strong> {note.matiere?.nom || '—'}</p>
            <p><strong>Note:</strong> {typeof note.valeur === 'number' ? note.valeur.toFixed(2) : note.valeur || '—'}</p>
            <p><strong>Type:</strong> {note.type || '—'}</p>
            <p><strong>Semestre:</strong> {note.semestre || '—'}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
