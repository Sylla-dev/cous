import { useContext, useEffect, useState } from 'react';
import api from '../services/api';
import { Button, Input, Select, message } from 'antd';
import { AuthContext } from '../context/AuthContext';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const jours = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

export default function AdminEmploiManager() {
  const { token } = useContext(AuthContext);
  const [creneaux, setCreneaux] = useState([]);
  const [classes, setClasses] = useState([]);
  const [enseignants, setEnseignants] = useState([]);
  const [matieres, setMatieres] = useState([]);
  const [form, setForm] = useState({});

  const fetchAll = async () => {
    try {
      const [c, e, m, emploi] = await Promise.all([
        api.get('/api/classes', { headers: { Authorization: `Bearer ${token}` } }),
        api.get('/api/enseignants', { headers: { Authorization: `Bearer ${token}` } }),
        api.get('/api/matieres', { headers: { Authorization: `Bearer ${token}` } }),
        api.get('/api/emploi'),
      ]);
      setClasses(c.data);
      setEnseignants(e.data);
      setMatieres(m.data);
      setCreneaux(emploi.data);
    } catch {
      message.error("Erreur lors du chargement");
    }
  };

  const exportPDF = () => {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text('Emploi du temps', 14, 22);

  autoTable(doc, {
    startY: 30,
    head: [['Jour', 'Heure', 'Classe', 'Matière', 'Enseignant', 'Salle']],
    body: creneaux.map(c => [
      c.jour_semaine,
      `${c.heure_debut} - ${c.heure_fin}`,
      c.classe?.nom || '',
      c.matiere?.nom || '',
      c.enseignant?.nom || '',
      c.salle,
    ]),
  });

  doc.save('emploi-du-temps.pdf');
};

  useEffect(() => { fetchAll(); }, []);

  const handleChange = (field, value) => setForm({ ...form, [field]: value });

  const handleSubmit = async () => {
    try {
      if (form._id) {
        await api.put(`/api/emploi/${form._id}`, form);
        message.success("Modifié !");
      } else {
        await api.post('/api/emploi', form);
        message.success("Ajouté !");
      }
      setForm({});
      fetchAll();
    } catch {
      message.error("Erreur lors de l'enregistrement");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer ce créneau ?")) return;
    try {
      await api.delete(`/api/emploi/${id}`);
      message.success("Supprimé");
      fetchAll();
    } catch {
      message.error("Erreur de suppression");
    }
  };

  const getNiveau = (classeNom) => {
    if (!classeNom) return "Autres";
    const match = classeNom.match(/^\d+ème/);
    return match ? match[0] : "Autres";
  };

  // Regrouper par niveau
  const groupes = creneaux.reduce((acc, c) => {
    const niveau = getNiveau(c.classe?.nom);
    if (!acc[niveau]) acc[niveau] = [];
    acc[niveau].push(c);
    return acc;
  }, {});

  return (
    <div className="space-y-6 p-4">
      <h2 className="text-xl font-semibold text-center md:text-left">Gérer l'emploi du temps</h2>

      {/* Formulaire */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
        <Select
          placeholder="Classe"
          value={form.classe}
          onChange={v => handleChange('classe', v)}
          allowClear
          showSearch
          optionFilterProp="children"
          filterOption={(input, option) =>
            option.children.toLowerCase().includes(input.toLowerCase())
          }
        >
          {classes.map(c => <Select.Option key={c._id} value={c._id}>{c.nom}</Select.Option>)}
        </Select>

        <Select
          placeholder="Matière"
          value={form.matiere}
          onChange={v => handleChange('matiere', v)}
          allowClear
          showSearch
          optionFilterProp="children"
          filterOption={(input, option) =>
            option.children.toLowerCase().includes(input.toLowerCase())
          }
        >
          {matieres.map(m => <Select.Option key={m._id} value={m._id}>{m.nom}</Select.Option>)}
        </Select>

        <Select
          placeholder="Enseignant"
          value={form.enseignant}
          onChange={v => handleChange('enseignant', v)}
          allowClear
          showSearch
          optionFilterProp="children"
          filterOption={(input, option) =>
            option.children.toLowerCase().includes(input.toLowerCase())
          }
        >
          {enseignants.map(e => <Select.Option key={e._id} value={e._id}>{e.nom}</Select.Option>)}
        </Select>

        <Select
          placeholder="Jour"
          value={form.jour_semaine}
          onChange={v => handleChange('jour_semaine', v)}
          allowClear
        >
          {jours.map(j => <Select.Option key={j} value={j}>{j}</Select.Option>)}
        </Select>

        <Input
          placeholder="Début (ex: 08:00)"
          value={form.heure_debut}
          onChange={e => handleChange('heure_debut', e.target.value)}
        />
        <Input
          placeholder="Fin (ex: 10:00)"
          value={form.heure_fin}
          onChange={e => handleChange('heure_fin', e.target.value)}
        />
        <Input
          placeholder="Salle"
          value={form.salle}
          onChange={e => handleChange('salle', e.target.value)}
        />

        <div className="flex items-end">
          <Button type="primary" onClick={handleSubmit} block>
            {form._id ? "Modifier" : "Ajouter"}
          </Button>
        </div>
      </div>

      <div className="flex justify-end">
        <button onClick={exportPDF} className="btn btn-outline btn-accent">
          Exporter en PDF
        </button>
      </div>


      {/* Liste groupée par niveau */}
      <div className="space-y-8 max-w-5xl mx-auto">
        {Object.entries(groupes).map(([niveau, creneauxNiveau]) => (
          <section key={niveau}>
            <h3 className="text-lg font-semibold mb-3 border-b border-gray-300 pb-1">{niveau}</h3>

            {/* TABLEAU pour desktop */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm border-collapse border border-gray-300 min-w-[700px]">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border border-gray-300 p-2 text-left">Classe</th>
                    <th className="border border-gray-300 p-2 text-left">Jour</th>
                    <th className="border border-gray-300 p-2 text-left">Heures</th>
                    <th className="border border-gray-300 p-2 text-left">Matière</th>
                    <th className="border border-gray-300 p-2 text-left">Enseignant</th>
                    <th className="border border-gray-300 p-2 text-left">Salle</th>
                    <th className="border border-gray-300 p-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {creneauxNiveau.map(c => (
                    <tr key={c._id} className="even:bg-gray-50">
                      <td className="border border-gray-300 p-2">{c.classe?.nom}</td>
                      <td className="border border-gray-300 p-2">{c.jour_semaine}</td>
                      <td className="border border-gray-300 p-2">{c.heure_debut} - {c.heure_fin}</td>
                      <td className="border border-gray-300 p-2">{c.matiere?.nom}</td>
                      <td className="border border-gray-300 p-2">{c.enseignant?.nom}</td>
                      <td className="border border-gray-300 p-2">{c.salle}</td>
                      <td className="border border-gray-300 p-2 flex flex-wrap gap-2">
                        <Button size="small" onClick={() => setForm(c)}>Modifier</Button>
                        <Button size="small" danger onClick={() => handleDelete(c._id)}>Supprimer</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* CARTES pour mobile */}
            <div className="md:hidden space-y-4">
              {creneauxNiveau.map(c => (
                <div
                  key={c._id}
                  className="border border-gray-300 rounded-md p-4 shadow-sm"
                >
                  <div className="font-semibold text-lg mb-1">{c.classe?.nom}</div>
                  <div><strong>Jour :</strong> {c.jour_semaine}</div>
                  <div><strong>Heures :</strong> {c.heure_debut} - {c.heure_fin}</div>
                  <div><strong>Matière :</strong> {c.matiere?.nom}</div>
                  <div><strong>Enseignant :</strong> {c.enseignant?.nom}</div>
                  <div><strong>Salle :</strong> {c.salle}</div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Button size="small" onClick={() => setForm(c)} block>
                      Modifier
                    </Button>
                    <Button size="small" danger onClick={() => handleDelete(c._id)} block>
                      Supprimer
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
