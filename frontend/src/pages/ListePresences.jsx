import { useEffect, useRef, useState, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { Table, Spin, Empty, Tag, Button } from 'antd';
import html2pdf from 'html2pdf.js';
import HistoriquePresence from '../components/HistoriquePresence';

export default function ListePresences() {
  const { token } = useContext(AuthContext);
  const [presences, setPresences] = useState([]);
  const [loading, setLoading] = useState(true);
  const pdfRef = useRef();

  useEffect(() => {
    const fetchPresences = async () => {
      try {
        const res = await api.get('/api/presences', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPresences(res.data || []);
      } catch (err) {
        console.error('Erreur récupération présences :', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPresences();
  }, [token]);

  const calculateStats = (elevePresences) => {
    const total = elevePresences.length;
    const presentes = elevePresences.filter((p) => p.status === 'présent').length;
    const justifiees = elevePresences.filter((p) => p.status === 'absent_justifie').length;
    const injustifiees = elevePresences.filter((p) => p.status === 'absent_non_justifie').length;
    const taux = total > 0 ? ((presentes / total) * 100).toFixed(1) : 0;
    return { total, presentes, justifiees, injustifiees, taux };
  };

  const exportPDF = () => {
    if (!pdfRef.current) return;
    html2pdf()
      .set({
        margin: 0.5,
        filename: 'historique_presences.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'landscape' },
      })
      .from(pdfRef.current)
      .save();
  };

  // Ici on ne groupe plus forcément, on affiche chaque présence en détail, ou tu peux garder grouping par élève pour stats
  // Exemple affichage détail par présence:
  const data = presences.map((p) => ({
    key: p._id,
    nom: p.eleve?.nom || '',
    prenom: p.eleve?.prenom || '',
    classe: p.eleve?.classe?.nom || '',
    cours: p.cours?.titre || '',
    dateCours: p.cours?.date ? new Date(p.cours.date).toLocaleDateString() : '',
    status: p.status,
  }));

  const columns = [
    {
      title: "Nom de l'élève",
      key: 'nom',
      render: (_, record) => `${record.nom} ${record.prenom ?? ''}`,
    },
    { title: 'Classe', dataIndex: 'classe', key: 'classe' },
    { title: 'Cours', dataIndex: 'cours', key: 'cours' },
    { title: 'Date du cours', dataIndex: 'dateCours', key: 'dateCours' },
    {
  title: 'Statut',
  dataIndex: 'status',
  key: 'status',
  render: (status) => {
    const color =
      status === 'présent' ? 'green' :
      status === 'absent_justifie' ? 'orange' :
      status === 'absent_non_justifie' ? 'red' : 'default';
    const label =
      status === 'présent' ? 'Présent' :
      status === 'absent_justifie' ? 'Absent Justifié' :
      status === 'absent_non_justifie' ? 'Absent Injustifié' : status;
    return <Tag color={color}>{label}</Tag>;
      },
    },
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Historique des présences</h1>
        <Button onClick={exportPDF} type="primary" danger>
          Exporter PDF
        </Button>
      </div>

      <HistoriquePresence />

      {loading ? (
        <Spin tip="Chargement..." style={{ display: 'block', margin: 'auto' }} />
      ) : data.length === 0 ? (
        <Empty description="Aucune donnée de présence" />
      ) : (
        <div ref={pdfRef} className="bg-white p-4 rounded shadow">
          <Table
            dataSource={data}
            columns={columns}
            pagination={{ pageSize: 12 }}
            scroll={{ x: 'max-content' }}
            bordered
          />
        </div>
      )}
    </div>
  );
}
