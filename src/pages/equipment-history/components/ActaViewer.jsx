import React, { useState, useEffect } from 'react';
import { getActaByServiceTag } from 'services/historyService';
import Icon from 'components/AppIcon';


const ActaViewer = ({ serviceTag, onClose, asesorNombre }) => {
  const [pdfUrl, setPdfUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // This flag is used to prevent state updates on an unmounted component.
    let isMounted = true;
    let objectUrl = null;

    const fetchActa = async () => {
      if (!serviceTag) {
        if (isMounted) {
          setError('No se ha proporcionado un service tag.');
          setIsLoading(false);
        }
        return;
      }
      
      try {
        if (isMounted) setIsLoading(true);

        const actaBlob = await getActaByServiceTag(serviceTag);

        if (isMounted) {
            const file = new Blob([actaBlob], { type: 'application/pdf' });
            objectUrl = URL.createObjectURL(file);
            setPdfUrl(objectUrl);
            setError(null);
        }
      } catch (e) {
        console.error('Error fetching acta in ActaViewer:', e);
        if (isMounted) {
            // As requested, display a specific message for the 500 internal server error.
            if (e.response && e.response.status === 500) {
                setError('No se pudo cargar el acta. El servidor encontró un error interno.');
            } else if (e.response && e.response.status === 404) {
                setError('No se encontró un acta para este equipo. Puede que aún no se haya generado.');
            } else {
                setError('No se pudo cargar el acta debido a un error inesperado.');
            }
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchActa();

    // Cleanup function to revoke the object URL and prevent memory leaks.
    return () => {
      isMounted = false;
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [serviceTag]); // Effect runs again if serviceTag changes.

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl h-full max-h-[90vh] flex flex-col">
        <header className="flex items-center justify-between p-4 border-b bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-800">
            {asesorNombre ? `Acta de Entrega - ${asesorNombre}` : 'Visor de Acta'}
          </h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200">
            <Icon name="X" size={20} />
          </button>
        </header>
        <div className="flex-grow p-4 overflow-auto flex items-center justify-center relative">
          {isLoading && (
            <div className="text-center">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Cargando acta...</p>
            </div>
          )}
          {!isLoading && error && (
            <div className="text-center px-6">
                <Icon name="AlertTriangle" className="text-red-500 mx-auto mb-4" size={40} />
                <p className="text-red-600 font-semibold">{error}</p>
            </div>
          )}
          {!isLoading && !error && pdfUrl && (
            <iframe
              src={pdfUrl}
              title={asesorNombre ? `Acta - ${asesorNombre}` : 'Visor de Acta'}
              className="w-full h-full border-0"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ActaViewer;
