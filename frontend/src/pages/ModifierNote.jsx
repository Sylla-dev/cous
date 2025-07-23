import { useEffect, useState, useContext } from 'react';
import { InputNumber, Button, Select, message, Form, Spin } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

export default function ModifierNote() {
  const { id } = useParams();
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchNote = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/api/notes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNote(res.data);
    } catch {
      message.error('Erreur lors du chargement de la note');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNote();
  }, [id]);

  const handleSubmit = async () => {
    if (note.valeur < 0 || note.valeur > 20) {
      message.error('La note doit être comprise entre 0 et 20');
      return;
    }
    setSaving(true);
    try {
      await api.put(`/api/notes/${id}`, note, {
        headers: { Authorization: `Bearer ${token}` },
      });
      message.success('Note modifiée avec succès');
      navigate('/enseignant/notes');
    } catch {
      message.error("Erreur lors de la modification");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !note) return <Spin tip="Chargement..." style={{ display: 'block', margin: 'auto' }} />;

  return (
    <div className="max-w-xl mx-auto p-4 bg-white rounded shadow space-y-6">
      <h2 className="text-lg font-semibold">Modifier la Note</h2>

      <Form layout="vertical" onFinish={handleSubmit}>
        <Form.Item label="Valeur de la note (0-20)" required>
          <InputNumber
            min={0}
            max={20}
            value={note.valeur}
            onChange={val => setNote({ ...note, valeur: val })}
            style={{ width: '100%' }}
          />
        </Form.Item>

        <Form.Item label="Type de note" required>
          <Select
            value={note.type}
            onChange={val => setNote({ ...note, type: val })}
            style={{ width: '100%' }}
          >
            <Select.Option value="Devoir">Devoir</Select.Option>
            <Select.Option value="Composition">Composition</Select.Option>
            <Select.Option value="Contrôle">Contrôle</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item label="Semestre" required>
          <Select
            value={note.semestre}
            onChange={val => setNote({ ...note, semestre: val })}
            style={{ width: '100%' }}
          >
            <Select.Option value="Semestre 1">Semestre 1</Select.Option>
            <Select.Option value="Semestre 2">Semestre 2</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={saving} block>
            Enregistrer les modifications
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
