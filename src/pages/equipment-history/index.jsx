import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import MainNavigation from 'components/ui/MainNavigation';
import WorkflowBreadcrumbs from 'components/ui/WorkflowBreadcrumbs';
import EquipmentDetailsCard from './components/EquipmentDetailsCard';
import HistoryFilters from './components/HistoryFilters';
import HistoryTimeline from './components/HistoryTimeline';
import Icon from 'components/AppIcon';
import Button from 'components/ui/Button';
import { getHistoryByServiceTag } from '../../services/historyService';
import { getEquipmentByServiceTag } from '../../services/equipmentService';

const EquipmentHistory = () => {
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [historyEntries, setHistoryEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();

  const fetchData = useCallback(() => {
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
      let equipmentDetails;
      // Step 1: Get Equipment Details
      if (passedDetails) {
        equipmentDetails = passedDetails;
        setSelectedEquipment(equipmentDetails);
      } else {
        try {
          equipmentDetails = await getEquipmentByServiceTag(serviceTag);
          if (equipmentDetails) {
            setSelectedEquipment(equipmentDetails);
          } else {
            throw new Error('No se pudo encontrar el equipo con el service tag especificado.');
          }
        } catch (e) {
          console.error("Error fetching equipment data:", e);
          const errorMessage = e.response?.status === 500 ? 'Request failed with status code 500' : (e.message || 'Ocurrió un error al cargar los datos del equipo.');
          setError(errorMessage);
          setIsLoading(false);
          return; // Stop if we can't get equipment details
        }
      }
      
      // Step 2: Get History
      try {
        const historyResponse = await getHistoryByServiceTag(serviceTag);
        setHistoryEntries(historyResponse?.history || []);
      } catch (historyError) {
        console.error("Error fetching history:", historyError);
        // Backend fails on this for assigned items.
        // We will show the equipment details but the history will be empty.
        // We avoid setting a page-wide error.
        setHistoryEntries([]);
      }

      setIsLoading(false);
    };
    
    loadData();
  }, [location.search, location.state]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleExport = () => {
    console.log('Exporting equipment history report...');
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
          <EquipmentDetailsCard equipment={selectedEquipment} onDamageReported={fetchData} />
          <HistoryFilters onFiltersChange={() => { }} onExport={handleExport} />
          <HistoryTimeline historyEntries={historyEntries} />
        </div>
      );
    }

    return null; // Should not be reached if logic is correct
  };

  return (
    <div className="min-h-screen bg-background">
      <MainNavigation />

      <div className="pt-16">
        <WorkflowBreadcrumbs showBack={true} />

        <div className="container mx-auto px-4 py-6 max-w-7xl">
          {/* Page Header */}
          <div className="mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-foreground mb-2">Historial de Equipo</h1>
                <p className="text-muted-foreground">
                  Consulta el historial completo y trazabilidad de un equipo corporativo.
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Button variant="outline" size="sm" onClick={handleExport} disabled={!selectedEquipment}>
                  <Icon name="FileText" size={16} className="mr-2" />
                  Generar Reporte
                </Button>
              </div>
            </div>
          </div>

          {renderContent()}

        </div>
      </div>
    </div>);
};

export default EquipmentHistory;
