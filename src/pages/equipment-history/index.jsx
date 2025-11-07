import React, { useState, useEffect } from 'react';
import MainNavigation from 'components/ui/MainNavigation';
import WorkflowBreadcrumbs from 'components/ui/WorkflowBreadcrumbs';
import EquipmentSearchBar from './components/EquipmentSearchBar';
import EquipmentDetailsCard from './components/EquipmentDetailsCard';
import HistoryFilters from './components/HistoryFilters';
import HistoryTimeline from './components/HistoryTimeline';
import Icon from 'components/AppIcon';
import Button from 'components/ui/Button';

const EquipmentHistory = () => {
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [historyEntries, setHistoryEntries] = useState([]);
  const [filters, setFilters] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Mock equipment data
  const mockEquipment = {};

  // Mock history entries
  const mockHistoryEntries = [];


  useEffect(() => {
    // Simulate loading equipment data
    setIsLoading(true);
    setTimeout(() => {
      setSelectedEquipment(mockEquipment);
      setHistoryEntries(mockHistoryEntries);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleEquipmentSearch = (query) => {
    setIsLoading(true);
    // Simulate search API call
    setTimeout(() => {
      setSelectedEquipment(mockEquipment);
      setHistoryEntries(mockHistoryEntries);
      setIsLoading(false);
    }, 800);
  };

  const handleEquipmentSelect = (equipment) => {
    setIsLoading(true);
    // Simulate loading specific equipment
    setTimeout(() => {
      setSelectedEquipment(mockEquipment);
      setHistoryEntries(mockHistoryEntries);
      setIsLoading(false);
    }, 500);
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    // Apply filters to history entries
    // This would typically filter the historyEntries array
  };

  const handleExport = () => {
    // Simulate export functionality
    console.log('Exporting equipment history report...');
    // In a real application, this would generate and download a PDF or Excel file
  };

  const recentSearches = [];

  return (
    <div className="min-h-screen bg-background">
      <MainNavigation />
      
      <div className="pt-16">
        <WorkflowBreadcrumbs />
        
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          {/* Page Header */}
          <div className="mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-foreground mb-2">Historial de Equipos</h1>
                <p className="text-muted-foreground">
                  Consulte el historial completo y trazabilidad de equipos corporativos
                </p>
              </div>
              
              <div className="flex items-center space-x-3">
                <Button variant="outline" size="sm">
                  <Icon name="FileText" size={16} className="mr-2" />
                  Generar Reporte
                </Button>
                <Button variant="outline" size="sm">
                  <Icon name="Settings" size={16} className="mr-2" />
                  Configurar Vista
                </Button>
              </div>
            </div>
          </div>

          {/* Equipment Search */}
          <EquipmentSearchBar
            onSearch={handleEquipmentSearch}
            onEquipmentSelect={handleEquipmentSelect}
            recentSearches={recentSearches} />


          {/* Loading State */}
          {isLoading &&
          <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-muted-foreground">Cargando información del equipo...</p>
              </div>
            </div>
          }

          {/* Equipment Details and History */}
          {!isLoading && selectedEquipment &&
          <div className="space-y-6">
              {/* Equipment Details */}
              <EquipmentDetailsCard equipment={selectedEquipment} />

              {/* History Filters */}
              <HistoryFilters
              onFiltersChange={handleFiltersChange}
              onExport={handleExport} />


              {/* History Timeline */}
              <HistoryTimeline historyEntries={historyEntries} />
            </div>
          }

          {/* No Equipment Selected State */}
          {!isLoading && !selectedEquipment &&
          <div className="text-center py-12">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="Search" size={24} className="text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Busque un equipo para ver su historial
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Utilice la barra de búsqueda superior para encontrar un equipo por service tag, 
                marca o modelo y consultar su historial completo.
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                <Button
                variant="outline"
                size="sm"
                onClick={() => handleEquipmentSearch('ST001234')}>

                  Ver ejemplo: ST001234
                </Button>
                <Button
                variant="outline"
                size="sm"
                onClick={() => handleEquipmentSearch('Dell')}>

                  Buscar equipos Dell
                </Button>
              </div>
            </div>
          }
        </div>
      </div>
    </div>);

};

export default EquipmentHistory;