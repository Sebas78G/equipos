import React, { useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import Button from '../../components/ui/Button';
import DeliveryNote from './components/DeliveryNote';
import Icon from '../../components/AppIcon';

const ALL_ACCESSORIES = [
    { id: 'base', name: 'Base', type: 'Accesorio', icon: 'Desktop' },
    { id: 'guaya', name: 'Guaya', type: 'Accesorio', icon: 'Lock' },
    { id: 'mouse', name: 'Mouse', type: 'Accesorio', icon: 'Mouse' },
    { id: 'teclado', name: 'Teclado', type: 'Accesorio', icon: 'Keyboard' },
    { id: 'cargador', name: 'Cargador', type: 'Accesorio', icon: 'Plug' },
    { id: 'cable_red', name: 'Cable de red', type: 'Accesorio', icon: 'Cable' },
    { id: 'cable_poder', name: 'Cable de poder', type: 'Accesorio', icon: 'Zap' },
    { id: 'adaptador_pantalla', name: 'Adaptador de pantalla', type: 'Elemento adicional', icon: 'Monitor' },
    { id: 'adaptador_red', name: 'Adaptador de red', type: 'Elemento adicional', icon: 'Router' },
    { id: 'adaptador_multipuertos', name: 'Adaptador Multipuertos', type: 'Elemento adicional', icon: 'Usb' },
    { id: 'antena_wireless', name: 'Antena Wireless', type: 'Elemento adicional', icon: 'Wifi' },
    { id: 'base_adicional', name: 'Base adicional', type: 'Elemento adicional', icon: 'Desktop' },
    { id: 'cable_poder_adicional', name: 'Cable de poder adicional', type: 'Elemento adicional', icon: 'Zap' },
    { id: 'guaya_adicional', name: 'Guaya adicional', type: 'Elemento adicional', icon: 'Lock' },
    { id: 'pantalla_adicional', name: 'Pantalla adicional', type: 'Elemento adicional', icon: 'Monitor' },
];

const DocumentGeneration = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedEquipment, employeeData, selectedAccessories } = location.state || {};
  const deliveryNoteRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => deliveryNoteRef.current,
  });

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

      <main className="container mx-auto px-6 py-24 flex justify-center">
        <div className="bg-white rounded-lg shadow-lg overflow-auto">
            <DeliveryNote 
                ref={deliveryNoteRef}
                equipment={selectedEquipment} 
                employee={employeeData} 
                accessories={selectedAccessories} 
                allAccessories={ALL_ACCESSORIES}
            />
        </div>
      </main>
    </div>
  );
};

export default DocumentGeneration;
