import React, { useState } from 'react';
import Button from '../../../components/ui/Button';

const RepairModal = ({ isOpen, onClose, onSubmit, isSubmitting }) => {
  const [repairNotes, setRepairNotes] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) {
    return null;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!repairNotes.trim()) {
      setError('Las notas de la reparación son obligatorias.');
      return;
    }
    setError('');
    onSubmit(repairNotes);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Reparar Equipo</h2>
        <p className="mb-4">Para mover el equipo a "Disponibles", por favor ingrese las notas de la reparación.</p>
        <form onSubmit={handleSubmit}>
          <textarea
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows="4"
            placeholder="Ej: Se reemplazó el disco duro y se reinstaló el sistema operativo..."
            value={repairNotes}
            onChange={(e) => setRepairNotes(e.target.value)}
          ></textarea>
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          <div className="mt-6 flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Reparando...' : 'Mover a Disponibles'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RepairModal;
