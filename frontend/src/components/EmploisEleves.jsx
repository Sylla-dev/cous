import { useContext, useEffect, useState } from 'react';
import api from '../services/api';
import { Table, Select, message } from 'antd';
import { AuthContext } from '../context/AuthContext';

const joursOrdre = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

export default function EmploiEleve() {
  const {user, token } = useContext(AuthContext);
  const [classes, setClasses] = useState([]);
  const [selectedClasse, setSelectedClasse] = useState('');
  const [emploi, setEmploi] = useState([]);


  useEffect(() => {
    api.get(`/api/emploi`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setEmploi(res.data))
      .catch(() => message.error("Erreur lors du chargement de l'emploi"));
  }, [user, token]);

  // Regroupe les créneaux par jour, triés par ordre des jours
  const groupedByJour = emploi.reduce((acc, creneau) => {
    if (!acc[creneau.jour_semaine]) acc[creneau.jour_semaine] = [];
    acc[creneau.jour_semaine].push(creneau);
    return acc;
  }, {});

  // Trie les jours selon l'ordre classique
  const joursTries = Object.keys(groupedByJour).sort((a, b) => {
    return joursOrdre.indexOf(a) - joursOrdre.indexOf(b);
  });

  const columns = [
    { title: 'Jour', dataIndex: 'jour_semaine' },
    { title: 'Heure', render: (_, r) => `${r.heure_debut} - ${r.heure_fin}` },
    { title: 'Matière', dataIndex: ['matiere', 'nom'] },
    { title: 'Enseignant', dataIndex: ['enseignant', 'nom'] },
    { title: 'Salle', dataIndex: 'salle' }
  ];

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Emploi du temps de la classe</h2>

      <Select
        placeholder="Sélectionner une classe"
        value={selectedClasse || undefined}
        onChange={value => setSelectedClasse(value)}
        style={{ width: '100%', maxWidth: 300, marginBottom: 20 }}
        showSearch
        optionFilterProp="children"
        filterOption={(input, option) =>
          option.children.toLowerCase().includes(input.toLowerCase())
        }
      >
        {classes.map(c => (
          <Select.Option key={c._id} value={c._id}>{c.nom}</Select.Option>
        ))}
      </Select>

      {/* Table affichée uniquement sur desktop */}
      <div className="hidden md:block">
        <Table
          columns={columns}
          dataSource={emploi}
          rowKey="_id"
          pagination={false}
          bordered
          size="middle"
        />
      </div>

      {/* Cartes mobiles */}
      <div className="md:hidden space-y-8">
        {joursTries.map(jour => (
          <section key={jour}>
            <h3 className="text-lg font-semibold mb-3">{jour}</h3>
            <div className="space-y-4">
              {groupedByJour[jour].map(creneau => (
                <div
                  key={creneau._id}
                  className="border rounded p-4 shadow-sm bg-white"
                >
                  <p><strong>Heure :</strong> {creneau.heure_debut} - {creneau.heure_fin}</p>
                  <p><strong>Matière :</strong> {creneau.matiere?.nom}</p>
                  <p><strong>Enseignant :</strong> {creneau.enseignant?.nom}</p>
                  <p><strong>Salle :</strong> {creneau.salle}</p>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
