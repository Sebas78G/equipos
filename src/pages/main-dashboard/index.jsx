import React, { useState, useEffect, useCallback } from 'react';
import MainNavigation from 'components/ui/MainNavigation';
import DashboardTabs from 'components/ui/DashboardTabs';
import WorkflowBreadcrumbs from 'components/ui/WorkflowBreadcrumbs';
import MetricsCard from './components/MetricsCard';
import EquipmentTable from './components/EquipmentTable';
import StatusOverview from './components/StatusOverview';
import { useNavigate, useLocation } from 'react-router-dom';
import { getDashboardData, updateMaintenanceDate } from 'services/dashboardService';
import Spinner from '../../components/ui/Spinner';
import ErrorDisplay from '../../components/ui/ErrorDisplay';

const MainDashboard = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.state?.activeTab || 'todos');
  const [refreshKey, setRefreshKey] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState('Todas');

  const [equipmentData, setEquipmentData] = useState([]);
  const [dashboardCounts, setDashboardCounts] = useState({});

  const navigate = useNavigate();

  const LOCATIONS = [
    'Todas',
    'Calle 72',
    'Floresta',
    'Kennedy',
    'Barranquilla',
    'Cartagena',
    'Popayan',
    'Medellin',
    'Cali',
    'Aeropuerto',
    'American Express',
    'Servicio Emergencia',
    'Boston Consulting'
  ];

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  const handleLocationChange = (e) => {
    setSelectedLocation(e.target.value);
  };

  const handleMetricClick = (metricType) => {
    const tabMapping = {
      'Todos': 'todos',
      'PC': 'pc',
      'Portátil': 'portatil',
      'Tablet': 'tablet',
    };
    if (tabMapping[metricType]) {
      setActiveTab(tabMapping[metricType]);
    }
  };

  const handleMaintenanceAction = async (item, maintenanceType) => {
    try {
      await updateMaintenanceDate(item.serviceTag, maintenanceType);
      setRefreshKey(prev => prev + 1);
    } catch (error) {
      console.error("Failed to update maintenance date:", error);
      setError('No se pudo actualizar la fecha de mantenimiento.');
    }
  };

  const handleEquipmentAction = (action, equipment = null) => {
    if (!equipment || !equipment.serviceTag) return;

    switch (action) {
      case 'refresh':
        setRefreshKey(prev => prev + 1);
        break;
      case 'view':
        navigate(`/equipment-history?service_tag=${equipment.serviceTag}`);
        break;
      case 'edit':
        navigate(`/edit-equipment?service_tag=${equipment.serviceTag}`);
        break;
      case 'maintenance':
        handleMaintenanceAction(equipment, equipment.maintenanceType);
        break;
      default:
        break;
    }
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { recentActivity, dashboardCounts: counts } = await getDashboardData();
      setEquipmentData(recentActivity);
      setDashboardCounts(counts);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
      setError('No se pudieron cargar los datos del panel. Verifique la conexión con el servidor.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData, refreshKey]);

  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
    }
  }, [location.state]);

  // Filter data by location first
  const getLocationFilteredData = () => {
    if (!equipmentData) return [];
    if (selectedLocation === 'Todas') return equipmentData;

    return equipmentData.filter(item => {
      const locationName = selectedLocation.toLowerCase();
      const itemSucursal = (item.sucursal || '').toLowerCase();
      const itemImplant = (item.implant || '').toLowerCase();

      // Mapping for special cases if needed, otherwise simple includes/match
      if (locationName === 'american express') return itemImplant.includes('american') || itemSucursal.includes('american');
      if (locationName === 'boston consulting') return itemImplant.includes('boston') || itemSucursal.includes('boston');
      if (locationName === 'servicio emergencia') return itemSucursal.includes('emergencia');

      return itemSucursal.includes(locationName) || itemImplant.includes(locationName);
    });
  };

  const locationFilteredData = getLocationFilteredData();

  // Calculate counts based on location filtered data
  const currentCounts = {
    total: locationFilteredData.length,
    pc: locationFilteredData.filter(e => e.type && (e.type.toLowerCase() === 'pc' || e.type.toLowerCase() === 'escritorio')).length,
    portatil: locationFilteredData.filter(e => e.type && e.type.toLowerCase() === 'portatil').length,
    tablet: locationFilteredData.filter(e => e.type && e.type.toLowerCase() === 'tablet').length,
    asignados: locationFilteredData.filter(e => e.status === 'Asignado').length,
    disponible: locationFilteredData.filter(e => e.status === 'Disponible').length,
    danados: locationFilteredData.filter(e => e.status === 'Dañado').length,
    disponiblePc: locationFilteredData.filter(e => e.type && (e.type.toLowerCase() === 'pc' || e.type.toLowerCase() === 'escritorio') && e.status === 'Disponible').length,
    disponiblePortatil: locationFilteredData.filter(e => e.type && e.type.toLowerCase() === 'portatil' && e.status === 'Disponible').length,
    disponibleTablet: locationFilteredData.filter(e => e.type && e.type.toLowerCase() === 'tablet' && e.status === 'Disponible').length,
  };

  const getFilteredEquipmentData = () => {
    switch (activeTab) {
      case 'pc':
        return locationFilteredData.filter(item => item.tipo && (item.tipo.toLowerCase() === 'pc' || item.tipo.toLowerCase() === 'escritorio'));
      case 'portatil':
        return locationFilteredData.filter(item => item.tipo && item.tipo.toLowerCase() === 'portatil');
      case 'tablet':
        return locationFilteredData.filter(item => item.tipo && item.tipo.toLowerCase() === 'tablet');
      case 'asignados':
        return locationFilteredData.filter(item => item.status === 'Asignado');
      case 'disponible':
        return locationFilteredData.filter(item => item.status === 'Disponible');
      case 'danados':
        return locationFilteredData.filter(item => item.status === 'Dañado');
      default:
        return locationFilteredData;
    }
  };

  const equipmentMetrics = [
    { title: 'Todos', count: currentCounts.total, icon: 'Computer', color: 'primary', description: `${currentCounts.disponible} disponibles` },
    { title: 'PC', count: currentCounts.pc, icon: 'Monitor', color: 'success', description: `${currentCounts.disponiblePc} disponibles` },
    { title: 'Portátil', count: currentCounts.portatil, icon: 'Laptop', color: 'warning', description: `${currentCounts.disponiblePortatil} disponibles` },
    { title: 'Tablet', count: currentCounts.tablet, icon: 'danger', description: `${currentCounts.disponibleTablet} disponibles` },
  ];

  const statusData = [
    { status: 'PCs Disponibles', count: currentCounts.disponiblePc, type: 'Disponible', icon: 'Monitor' },
    { status: 'Portátiles Disponibles', count: currentCounts.disponiblePortatil, type: 'Disponible', icon: 'Laptop' },
    { status: 'Tablets Disponibles', count: currentCounts.disponibleTablet, type: 'Disponible', icon: 'Tablet' },
  ];

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><Spinner /></div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <MainNavigation />
      <div className="pt-16">
        <WorkflowBreadcrumbs />

        <div className="container mx-auto px-4 py-6 space-y-6">
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Panel Principal</h1>
                <p className="text-muted-foreground">
                  Gestión integral del inventario de equipos - EXPRESO VIAJES Y TURISMO
                </p>
              </div>

              <div className="w-full md:w-64">
                <label htmlFor="location-select" className="block text-sm font-medium text-gray-700 mb-1">
                  Filtrar por Sucursal/Implant
                </label>
                <select
                  id="location-select"
                  value={selectedLocation}
                  onChange={handleLocationChange}
                  className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  {LOCATIONS.map(loc => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>
            </div>

            <ErrorDisplay message={error} />

            <DashboardTabs
              activeTab={activeTab}
              onTabChange={handleTabChange}
              counts={currentCounts}
            />
          </div>

          {activeTab === 'todos' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {equipmentMetrics.map((metric, index) => (
                <MetricsCard
                  key={index}
                  {...metric}
                  onClick={() => handleMetricClick(metric.title)}
                />
              ))}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className={activeTab === 'asignados' ? "lg:col-span-3" : "lg:col-span-2"}>
              <EquipmentTable
                equipmentData={getFilteredEquipmentData()}
                onEquipmentAction={handleEquipmentAction}
                activeTab={activeTab}
              />
            </div>
            {activeTab !== 'asignados' && (
              <div className="space-y-6">
                <StatusOverview statusData={statusData} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainDashboard;
