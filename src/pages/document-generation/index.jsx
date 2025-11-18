import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import DeliveryNote from './components/DeliveryNote';
import Icon from '../../components/AppIcon';

const DocumentGeneration = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedEquipment, employeeData, selectedAccessories } = location.state || {};

  if (!selectedEquipment || !employeeData) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
        <div className="text-center">
            <Icon name="FileX" className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Error en la Generación del Documento</h1>
            <p className="text-gray-600 mb-6">No se encontraron datos de asignación. Por favor, vuelva a intentarlo.</p>
            <Button onClick={() => navigate('/equipment-assignment')} variant="outline">
                Volver a Asignación de Equipos
            </Button>
        </div>
      </div>
    );
  }

  const handlePrint = () => {
    const printContent = document.getElementById('delivery-note-container').innerHTML;
    const originalContent = document.body.innerHTML;
    document.body.innerHTML = printContent;
    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload(); // Recargar para restaurar los scripts y el estado
  };

  return (
    <div className="bg-gray-100">
        <div className="fixed top-0 left-0 right-0 bg-white shadow-md z-10">
            <div className="container mx-auto px-6 py-3 flex justify-between items-center">
                <h1 className="text-xl font-bold text-gray-800">Acta de Entrega de Equipo</h1>
                <div className="flex items-center space-x-4">
                    <Button variant="outline" onClick={() => navigate('/main-dashboard')}>
                        <Icon name="Home" className="w-4 h-4 mr-2" />
                        Ir al Dashboard
                    </Button>
                    <Button onClick={handlePrint}>
                        <Icon name="Printer" className="w-4 h-4 mr-2" />
                        Imprimir o Guardar como PDF
                    </Button>
                </div>
            </div>
        </div>

      <main className="container mx-auto px-6 py-24">
        <div className="bg-white rounded-lg shadow-lg mx-auto max-w-4xl">
          <div id="delivery-note-container">
            <DeliveryNote 
                equipment={selectedEquipment} 
                employee={employeeData} 
                accessories={selectedAccessories} 
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default DocumentGeneration;
