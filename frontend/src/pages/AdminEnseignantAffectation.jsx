import { useContext, useEffect, useState } from 'react';
import api from '../services/api';
import { Select, message } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { AuthContext } from '../context/AuthContext';

export default function AdminEnseignantAffectation() {
  const { token } = useContext(AuthContext);
  const [enseignants, setEnseignants] = useState([]);
  const [classes, setClasses] = useState([]);
  const [matieres, setMatieres] = useState([]);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ classes: [], matieres: [], cahierCharges: '' });

  useEffect(() => {
	const fetchData = async () => {
	  const [ens, cls, mats] = await Promise.all([
		api.get('/api/enseignants', {
	  headers: { Authorization: `Bearer ${token}` }
	}),
		api.get('/api/classes', {
	  headers: { Authorization: `Bearer ${token}` }
	}),
		api.get('/api/matieres', {
	  headers: { Authorization: `Bearer ${token}` }
	})
	  ]);
	  setEnseignants(ens.data);
	  setClasses(cls.data);
	  setMatieres(mats.data);
	};
	fetchData();
  }, []);

  const handleAffectation = async () => {
	try {
	  await api.put(`/api/enseignants/${selected}/classes`, { classes: form.classes }, {
	  headers: { Authorization: `Bearer ${token}` }
	});
	  await api.put(`/api/enseignants/${selected}/matieres`, { matieres: form.matieres }, {
	  headers: { Authorization: `Bearer ${token}` }
	});
	  await api.put(`/api/enseignants/${selected}/cahier`, { contenu: form.cahierCharges }, {
	  headers: { Authorization: `Bearer ${token}` }
	});
	  setForm({classe: '', matiere: '', cahierCharges: '' });
	  message.success('Affectation mise à jour');
	} catch (err) {
	  message.error('Erreur lors de l’affectation');
	}
  };

  return (
	<div className="p-4 space-y-6">
	  <h2 className="text-2xl font-bold">🎓 Affectation Enseignants</h2>

	  {/* Sélection enseignant */}
	  <div className="form-control">
		<label className="label">Sélectionner un enseignant</label>
		<select
		  className="select select-bordered w-full"
		  onChange={(e) => setSelected(e.target.value)}
		>
		  <option>-- Choisir --</option>
		  {enseignants.map(e => (
			<option key={e._id} value={e._id}>{e.nom}</option>
		  ))}
		</select>
	  </div>

	  {selected && (
		<div className="card bg-base-100 shadow p-4 space-y-4">
		  <div>
			<label className="label">Classes</label>
			<Select
			  mode="multiple"
			  className="w-full"
			  options={classes.map(c => ({ value: c._id, label: c.nom }))}
			  onChange={(classes) => setForm(prev => ({ ...prev, classes }))}
			/>
		  </div>

		  <div>
			<label className="label">Matières</label>
			<Select
			  mode="multiple"
			  className="w-full"
			  options={matieres.map(m => ({ value: m._id, label: m.nom }))}
			  onChange={(matieres) => setForm(prev => ({ ...prev, matieres }))}
			/>
		  </div>

		  <div>
			<label className="label">Cahier des charges</label>
			<TextArea
			  rows={4}
			  placeholder="Ex: heures / objectifs / matières..."
			  onChange={(e) => setForm(prev => ({ ...prev, cahierCharges: e.target.value }))}
			/>
		  </div>

		  <button className="btn btn-primary" onClick={handleAffectation}>
			✅ Enregistrer l’affectation
		  </button>
		</div>
	  )}

	  {/* Tableau résumé */}
	  <div className="overflow-x-auto">
		<table className="table table-zebra w-full mt-8">
		  <thead>
			<tr>
			  <th>Nom</th>
			  <th>Classes</th>
			  <th>Matières</th>
			  <th>Cahier des charges</th>
			</tr>
		  </thead>
		  <tbody>
			{enseignants.map(e => (
			  <tr key={e._id}>
				<td>{e.nom}</td>
				<td>{e.classes?.map(c => c.nom).join(', ')}</td>
				<td>{e.matieres?.map(m => m.nom).join(', ')}</td>
				<td className="whitespace-pre-wrap">{e.cahierCharges || '-'}</td>
			  </tr>
			))}
		  </tbody>
		</table>
	  </div>
	</div>
  );
}
