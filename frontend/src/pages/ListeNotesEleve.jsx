import { useEffect, useState, useContext } from 'react';
import { Table, Tag, message, Collapse, Spin, Empty } from 'antd';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const { Panel } = Collapse;

export default function ListeNotesEleve() {
  const { token } = useContext(AuthContext);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await api.get('/api/notes', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNotes(res.data);
      } catch (err) {
        message.error('Erreur lors du chargement des notes');
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, [token]);

  if (loading) return <Spin tip="Chargement des notes..." style={{ display: 'block', margin: 'auto' }} />;
  if (notes.length === 0) return <Empty description="Aucune note disponible" />;

  // Regroupement des notes par niveau de classe
  // Supposons que chaque note a un champ note.classe.niveau
  const notesByNiveau = {};
  notes.forEach((note) => {
    const niveau = note.classe?.niveau || 'Niveau inconnu';
    if (!notesByNiveau[niveau]) notesByNiveau[niveau] = [];
    notesByNiveau[niveau].push(note);
  });

  const columns = [
    {
      title: 'Matière',
      dataIndex: ['matiere', 'nom'],
      key: 'matiere',
      responsive: ['sm'], // caché sur très petits écrans
    },
    {
      title: 'Note',
      dataIndex: 'valeur',
      key: 'valeur',
      render: (val) => <strong>{val}/20</strong>,
      width: 80,
      align: 'center',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type) => <Tag color="blue">{type}</Tag>,
      responsive: ['md'], // visible à partir de md
    },
    {
      title: 'Enseignant',
      dataIndex: ['enseignant', 'nom'],
      key: 'enseignant',
      responsive: ['lg'], // visible à partir de lg
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (date) => new Date(date).toLocaleDateString(),
      responsive: ['md'],
    },
  ];

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Mes Notes</h2>

      <Collapse accordion>
        {Object.entries(notesByNiveau)
          .sort((a, b) => a[0].localeCompare(b[0]))
          .map(([niveau, notesDuNiveau]) => (
            <Panel header={`Niveau : ${niveau}`} key={niveau}>
              <Table
                columns={columns}
                dataSource={notesDuNiveau}
                rowKey="_id"
                pagination={false}
                size="small"
                scroll={{ x: 'max-content' }}
              />
            </Panel>
          ))}
      </Collapse>
    </div>
  );
}
