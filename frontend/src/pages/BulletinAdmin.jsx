import { useEffect, useState } from 'react';
import api from '../services/api';
import { Edit, Trash, Eye } from 'lucide-react';
import { Modal, Input, Button } from 'antd';
import { Link } from 'react-router-dom';

export default function AdminBulletins() {
  const [bulletins, setBulletins] = useState([]);
  const [loading, setLoading] = useState(false);

  const [editingBulletin, setEditingBulletin] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [updatedNotes, setUpdatedNotes] = useState([]);
  const [appreciation, setAppreciation] = useState('');

  useEffect(() => {
    fetchBulletins();
  }, []);

  const fetchBulletins = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/bulletins');
      setBulletins(res.data);
    } catch (err) {
      alert("Erreur lors du chargement des bulletins.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (bulletin) => {
    setEditingBulletin(bulletin);
    setUpdatedNotes(bulletin.notes.map(n => ({ ...n })));
    setAppreciation(bulletin.appreciation || '');
    setShowModal(true);
  };

  const handleNoteChange = (index, field, value) => {
    const newNotes = [...updatedNotes];
    newNotes[index][field] = value;
    setUpdatedNotes(newNotes);
  };

  const updateBulletin = async () => {
    try {
      const payload = {
        notes: updatedNotes.map(n => ({
          matiere: n.matiere?._id || n.matiere,
          moyenne: parseFloat(n.moyenne),
        })),
        appreciation,
      };
      await api.put(`/api/bulletins/${editingBulletin._id}`, payload);
      alert('Bulletin mis à jour !');
      setShowModal(false);
      fetchBulletins();
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la mise à jour.");
    }
  };

  const supprimer = async (id) => {
    if (!window.confirm('Supprimer ce bulletin ?')) return;
    try {
      await api.delete(`/api/bulletins/${id}`);
      fetchBulletins();
    } catch (err) {
      alert("Erreur lors de la suppression.");
    }
  };


  // Grouper les bulletins par niveau
  const bulletinsParNiveau = bulletins.reduce((acc, b) => {
    const niveau = b.classe?.niveau || 'Inconnu';
    if (!acc[niveau]) acc[niveau] = [];
    acc[niveau].push(b);
    return acc;
  }, {});

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Gestion des Bulletins</h2>

      {loading ? (
        <p>Chargement...</p>
      ) : (
        Object.entries(bulletinsParNiveau).map(([niveau, items]) => (
          <div key={niveau} className="mb-8">
            <h3 className="text-lg font-semibold text-primary mb-3">
              Niveau : {niveau}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map((b) => (
                <div
                  key={b._id}
                  className="bg-white border rounded shadow-sm p-4 flex flex-col justify-between"
                >
                  <div className="space-y-1">
                    <p><strong>Élève :</strong> {b.eleve?.nom}</p>
                    <p><strong>Classe :</strong> {b.classe?.nom}</p>
                    <p><strong>Semestre :</strong> {b.semestre}</p>
                    <p><strong>Moyenne :</strong> {b.moyenneGenerale.toFixed(2)}</p>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-4">
                    <button
                      title="Modifier"
                      onClick={() => openEditModal(b)}
                      className="btn btn-sm bg-blue-600 text-white hover:bg-blue-700"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      title="Supprimer"
                      onClick={() => supprimer(b._id)}
                      className="btn btn-sm bg-red-600 text-white hover:bg-red-700"
                    >
                      <Trash size={16} />
                    </button>
                 <Link to={`/admin/bulletins/${b._id}`} className="btn btn-xs btn-info">
                  <Eye size={16} />
                </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}

      {/* 💡 Modale d'édition du bulletin */}
      <Modal
        open={showModal}
        title="Modifier le bulletin"
        onCancel={() => setShowModal(false)}
        footer={null}
      >
        {editingBulletin && (
          <div className="space-y-4">
            {updatedNotes.map((note, index) => (
              <div key={index} className="flex gap-2 items-center">
                <span className="w-1/2">{note.matiere?.nom || ''}</span>
                <Input
                  type="number"
                  min={0}
                  max={20}
                  value={note.moyenne}
                  onChange={(e) => handleNoteChange(index, 'moyenne', e.target.value)}
                />
              </div>
            ))}

            <Input.TextArea
              rows={3}
              value={appreciation}
              onChange={(e) => setAppreciation(e.target.value)}
              placeholder="Appréciation"
            />

            <Button type="primary" block onClick={updateBulletin}>
              Enregistrer les modifications
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
}
