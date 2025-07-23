import { useEffect, useState, useContext } from 'react';
import { Table, Button, Popconfirm, message, Collapse, Spin, Empty } from 'antd';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const { Panel } = Collapse;

export default function ListeNotesEnseignant() {
  const { token } = useContext(AuthContext);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/notes', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotes(res.data);
    } catch (err) {
      message.error("Erreur lors du chargement des notes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [token]);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/notes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      message.success('Note supprimée');
      fetchNotes();
    } catch (err) {
      message.error("Erreur lors de la suppression");
    }
  };

  if (loading) return <Spin tip="Chargement des notes..." style={{ display: 'block', margin: 'auto' }} />;
  if (notes.length === 0) return <Empty description="Aucune note disponible" />;

  // Regrouper par niveau de classe (note.classe.niveau)
  const notesByNiveau = {};
  notes.forEach((note) => {
    const niveau = note.classe?.niveau || 'Niveau inconnu';
    if (!notesByNiveau[niveau]) notesByNiveau[niveau] = [];
    notesByNiveau[niveau].push(note);
  });

  const columns = [
    {
      title: 'Élève',
      dataIndex: ['eleve', 'nom'],
      key: 'eleve',
      responsive: ['sm'],
      ellipsis: true,
    },
    {
      title: 'Classe',
      dataIndex: ['classe', 'nom'],
      key: 'classe',
      responsive: ['md'],
      ellipsis: true,
    },
    {
      title: 'Matière',
      dataIndex: ['matiere', 'nom'],
      key: 'matiere',
      responsive: ['sm'],
      ellipsis: true,
    },
    {
      title: 'Note',
      dataIndex: 'valeur',
      key: 'valeur',
      width: 80,
      align: 'center',
      render: val => <strong>{val}/20</strong>,
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      responsive: ['md'],
      ellipsis: true,
    },
    {
      title: 'Semestre',
      dataIndex: ['semestre', 'nom'],
      key: 'semestre',
      responsive: ['lg'],
      ellipsis: true,
    },
    {
      title: 'Enseignant',
      dataIndex: ['enseignant', 'nom'],
      key: 'enseignant',
      responsive: ['lg'],
      ellipsis: true,
    },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right',
      width: 120,
      render: (_, record) => (
        <div className="space-x-2">
          <Link to={`/enseignant/notes/modifier/${record._id}`}>
            <Button type="primary" size="small">Modifier</Button>
          </Link>
          <Popconfirm
            title="Confirmer la suppression ?"
            onConfirm={() => handleDelete(record._id)}
            okText="Oui"
            cancelText="Non"
          >
            <Button danger size="small">Supprimer</Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-lg font-semibold mb-4">Liste des Notes par Niveau de Classe</h2>

      <Collapse accordion>
        {Object.entries(notesByNiveau)
          .sort((a, b) => a[0].localeCompare(b[0]))
          .map(([niveau, notesDuNiveau]) => (
            <Panel header={`Niveau : ${niveau}`} key={niveau}>
              <Table
                columns={columns}
                dataSource={notesDuNiveau}
                rowKey="_id"
                pagination={{ pageSize: 5 }}
                size="small"
                scroll={{ x: 'max-content' }}
              />
            </Panel>
          ))}
      </Collapse>
    </div>
  );
}
