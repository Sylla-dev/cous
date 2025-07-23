import React, { useState } from 'react';
import api from '../services/api';
import { Input, Select, Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'eleve' });
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleRoleChange = val => setForm({ ...form, role: val });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await api.post('/api/auth/register', form);
      message.success('Compte créé, veuillez vous connecter.');
      navigate('/login');
    } catch {
      message.error('Erreur: email existant ?');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-4">
      <div className="card w-full max-w-md shadow-lg p-8 bg-base-100 rounded-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">Inscription</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <Input
            name="name"
            placeholder="Nom complet"
            onChange={handleChange}
            value={form.name}
            required
            size="large"
            style={{ width: '100%' }}
          />
          <Input
            name="email"
            placeholder="Email"
            onChange={handleChange}
            value={form.email}
            required
            size="large"
            style={{ width: '100%' }}
          />
          <Input.Password
            name="password"
            placeholder="Mot de passe"
            onChange={handleChange}
            value={form.password}
            required
            size="large"
            style={{ width: '100%' }}
          />
          <Select
            value={form.role}
            onChange={handleRoleChange}
            size="large"
            style={{ width: '100%' }}
          >
            <Select.Option value="eleve">Élève</Select.Option>
            <Select.Option value="enseignant">Enseignant</Select.Option>
            <Select.Option value="admin">Admin</Select.Option>
          </Select>
          <Button type="primary" htmlType="submit" size="large" block>
            S'inscrire
          </Button>
        </form>
      </div>
    </div>
  );
}
