// components/PresenceCours.jsx
import { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Table, Tag, Button, Spin, message } from 'antd';

export default function PresenceCours() {
  const { token } = useContext(AuthContext);
  const { coursId } = useParams();
  const [eleves, setEleves] = useState([]);
  const [classe, setClasse] = useState(null);
  const [presences, setPresences] = useState({}); // { eleveId: boolean }
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!coursId) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        // Récupérer cours (avec classe)
        const { data: coursData } = await api.get(`/api/cours/${coursId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setClasse(coursData.classe);

        // Récupérer élèves
        const { data: elevesData } = await api.get(`/api/eleves`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setEleves(elevesData);

        // Récupérer présences déjà enregistrées pour ce cours
        const { data: presencesData } = await api.get(`/api/presences?coursId=${coursId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        // Construire objet de présences par eleveId
        const presMap = {};
        presencesData.forEach(p => {
          if (p.eleve && p.status === 'présent') presMap[p.eleve._id] = true;
          else if (p.eleve) presMap[p.eleve._id] = false;
        });
        setPresences(presMap);
      } catch (error) {
        message.error("Erreur lors du chargement des données");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [coursId, token]);

  const togglePresence = async (eleveId) => {
    const current = presences[eleveId] || false;
    setSaving(true);
    try {
      await api.post('/api/presences', {
        eleveId,
        coursId,
        present: !current
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setPresences(prev => ({ ...prev, [eleveId]: !current }));
      message.success(`Présence mise à jour pour l'élève`);
    } catch (error) {
      message.error("Erreur lors de la mise à jour");
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const columns = [
    {
      title: 'Élève',
      dataIndex: 'nom',
      key: 'nom',
      render: (_, record) => `${record.nom} ${record.prenom}`
    },
    {
      title: 'Présence',
      key: 'presence',
      render: (_, record) => {
        const present = presences[record._id] || false;
        return (
          <Button
            type={present ? 'primary' : 'default'}
            danger={!present}
            loading={saving}
            onClick={() => togglePresence(record._id)}
          >
            {present ? 'Présent' : 'Absent'}
          </Button>
        );
      }
    }
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">
        Présences pour le cours {coursId} {classe ? `- Classe: ${classe.nom}` : ''}
      </h2>

      {loading ? (
        <Spin tip="Chargement..." style={{ display: 'block', margin: 'auto' }} />
      ) : (
        <Table
          dataSource={eleves}
          columns={columns}
          rowKey={(record) => record._id}
          pagination={{ pageSize: 10 }}
          bordered
        />
      )}
    </div>
  );
}
