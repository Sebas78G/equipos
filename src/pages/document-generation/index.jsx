import React, { useRef, useState, useEffect } from 'react';
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
  const deliveryNoteRef = useRef();

  const [pdfUrl, setPdfUrl] = useState(null);
  const [error, setError] = useState(null);
  const [isGenerationMode, setIsGenerationMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const { 
        selectedEquipment, 
        employeeData, 
        selectedAccessories,
        equipment, 
        documentType 
    } = location.state || {};

    setPdfUrl(null);
    setError(null);
    setIsGenerationMode(false);
    setIsLoading(true);

    if (documentType === 'acta') {
        if (equipment?.acta) {
            try {
                let byteArray;

                if (typeof equipment.acta === 'string') {
                    const binaryString = window.atob(equipment.acta);
                    const len = binaryString.length;
                    byteArray = new Uint8Array(len);
                    for (let i = 0; i < len; i++) {
                        byteArray[i] = binaryString.charCodeAt(i);
                    }
                } else if (typeof equipment.acta === 'object' && equipment.acta.type === 'Buffer' && Array.isArray(equipment.acta.data)) {
                    byteArray = new Uint8Array(equipment.acta.data);
                } else {
                    throw new Error('Formato de acta no soportado.');
                }

                if (!byteArray || byteArray.length === 0) {
                    throw new Error('El acta está vacía o corrupta.');
                }

                const pdfSignature = String.fromCharCode(...byteArray.slice(0, 4));
                if (pdfSignature !== '%PDF') {
                    console.error("La firma del archivo no es \"%PDF\". Firma encontrada:", pdfSignature);
                    throw new Error('El archivo proporcionado no es un PDF válido.');
                }
                
                const blob = new Blob([byteArray], { type: 'application/pdf' });
                const objectUrl = URL.createObjectURL(blob);
                setPdfUrl(objectUrl);

            } catch (e) {
                console.error("Error al procesar el acta:", e);
                console.error("Datos del acta recibidos:", equipment.acta); // Log the problematic data
                setError(`No se pudo cargar el acta. El archivo puede estar corrupto o no es un PDF válido. Por favor, verifique el proceso de generación y guardado del documento en el backend. (Error: ${e.message})`);
            }
        } else {
            setError("No se encontró el acta para este equipo.");
        }
        setIsLoading(false);
    } else if (selectedEquipment && employeeData) {
        setIsGenerationMode(true);
        setIsLoading(false);
    } else {
        setError("No se encontraron los datos necesarios para la operación solicitada.");
        setIsLoading(false);
    }

    return () => {
        if (pdfUrl && pdfUrl.startsWith('blob:')) {
            URL.revokeObjectURL(pdfUrl);
        }
    };
  }, [location.state]);

  const handlePrint = useReactToPrint({
    content: () => deliveryNoteRef.current,
  });

  const handleDownloadPDF = () => {
    if (pdfUrl) {
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = 'acta_de_entrega.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleOpenInNewTab = () => {
    if (pdfUrl) {
      window.open(pdfUrl, '_blank', 'noopener,noreferrer');
    }
  };

  if (isLoading) {
    return (
      <div className="bg-gray-100 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando documento...</p>
        </div>
      </div>
    );
  }

  if (pdfUrl) {
    return (
        <div className="bg-gray-100 min-h-screen flex flex-col">
            <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-10">
                <div className="container mx-auto px-6 py-3 flex justify-between items-center">
                    <h1 className="text-xl font-bold text-gray-800">Visualización de Acta</h1>
                    <div className="flex items-center space-x-3">
                        <Button variant="outline" onClick={handleDownloadPDF}>
                            <Icon name="Download" className="w-4 h-4 mr-2" />
                            Descargar
                        </Button>
                        <Button variant="outline" onClick={handleOpenInNewTab}>
                            <Icon name="ExternalLink" className="w-4 h-4 mr-2" />
                            Abrir en pestaña nueva
                        </Button>
                        <Button variant="outline" onClick={() => navigate(-1)}>
                            <Icon name="ArrowLeft" className="w-4 h-4 mr-2" />
                            Volver
                        </Button>
                    </div>
                </div>
            </header>
            
            <main className="flex-1 pt-20 px-6 pb-6">
                <div className="bg-white rounded-lg shadow-lg h-full overflow-hidden">
                    <embed
                        src={pdfUrl}
                        type="application/pdf"
                        className="w-full h-full"
                        style={{ minHeight: '80vh' }}
                    />
                </div>
            </main>
        </div>
    );
  }

  if (isGenerationMode) {
    const { selectedEquipment, employeeData, selectedAccessories } = location.state;
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
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <div className="text-center p-6">
          <Icon name="FileX" className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Error al Visualizar el Documento</h1>
          <p className="text-gray-600 mb-6 max-w-md">{error || "No se pudo realizar la operación. Por favor, intente de nuevo."}</p>
          <Button onClick={() => navigate(-1)} variant="outline">
              Volver
          </Button>
      </div>
    </div>
  );
};

export default DocumentGeneration;
