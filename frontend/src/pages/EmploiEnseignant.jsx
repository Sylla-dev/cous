import React from 'react';
import EmploiEnseignants from '../components/EmploiEnseignants';

export default function EmploiEnseignantPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Mon emploi du temps</h1>
      <EmploiEnseignants />
    </div>
  );
}
