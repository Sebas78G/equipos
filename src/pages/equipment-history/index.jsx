import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import MainNavigation from 'components/ui/MainNavigation';
import WorkflowBreadcrumbs from 'components/ui/WorkflowBreadcrumbs';
import EquipmentDetailsCard from './components/EquipmentDetailsCard';
import Icon from 'components/AppIcon';
import Button from 'components/ui/Button';
import { getEquipmentByServiceTag } from '../../services/equipmentService';

const EquipmentHistory = () => {
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  const fetchEquipmentData = useCallback(() => {
    const serviceTag = new URLSearchParams(location.search).get('service_tag');
    const passedDetails = location.state?.equipmentDetails;

    if (!serviceTag) {
      setError('No se ha especificado un service tag de equipo en la URL.');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    const loadData = async () => {
      if (passedDetails) {
        setSelectedEquipment(passedDetails);
        setIsLoading(false);
      } else {
        try {
          const equipmentDetails = await getEquipmentByServiceTag(serviceTag);
          if (equipmentDetails) {
            setSelectedEquipment(equipmentDetails);
          } else {
            throw new Error('No se pudo encontrar el equipo con el service tag especificado.');
          }
        } catch (e) {
          console.error("Error fetching equipment data:", e);
          const errorMessage = e.response?.status === 500 ? 'Request failed with status code 500' : (e.message || 'Ocurrió un error al cargar los datos del equipo.');
          setError(errorMessage);
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    loadData();
  }, [location.search, location.state]);

  useEffect(() => {
    fetchEquipmentData();
  }, [fetchEquipmentData]);

  const handleViewActa = () => {
    if (selectedEquipment) {
      navigate('/document-generation', { state: { equipment: selectedEquipment, documentType: 'acta' } });
    }
  };

  const handleViewHojaDeVida = () => {
    if (selectedEquipment) {
      navigate('/document-generation', { state: { equipment: selectedEquipment, documentType: 'hojaDeVida' } });
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Cargando información del equipo...</p>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="AlertTriangle" size={24} className="text-error" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">{error}</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Por favor, verifique que la URL contenga el parámetro 'service_tag' correcto.
          </p>
        </div>
      );
    }

    if (selectedEquipment) {
      return (
        <div className="space-y-6">
          <EquipmentDetailsCard 
            equipment={selectedEquipment} 
            onDamageReported={fetchEquipmentData}
            onStatusChange={fetchEquipmentData} 
          />
        </div>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-background">
      <MainNavigation />

      <div className="pt-16">
        <WorkflowBreadcrumbs showBack={true} />

        <div className="container mx-auto px-4 py-6 max-w-7xl">
          <div className="mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-foreground mb-2">Ficha de Equipo</h1>
                <p className="text-muted-foreground">
                  Consulta los detalles y el estado actual de un equipo corporativo.
                </p>
              </div>
              {selectedEquipment && (
                <div className="flex items-center space-x-3">
                  <Button variant="outline" size="sm" onClick={handleViewActa}>
                    <Icon name="FileText" size={16} className="mr-2" />
                    Ver Acta
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleViewHojaDeVida}>
                    <Icon name="Book" size={16} className="mr-2" />
                    Hoja de Vida
                  </Button>
                </div>
              )}
            </div>
          </div>

          {renderContent()}

        </div>
      </div>
    </div>);
};

export default EquipmentHistory;
