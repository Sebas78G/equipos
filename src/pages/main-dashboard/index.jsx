import React, { useState, useEffect, useCallback } from 'react';
import MainNavigation from 'components/ui/MainNavigation';
import DashboardTabs from 'components/ui/DashboardTabs';
import WorkflowBreadcrumbs from 'components/ui/WorkflowBreadcrumbs';
import MetricsCard from './components/MetricsCard';
import EquipmentTable from './components/EquipmentTable';
import StatusOverview from './components/StatusOverview';
import { useNavigate } from 'react-router-dom';
import { getDashboardData } from 'services/dashboardService';
import Spinner from '../../components/ui/Spinner';
import ErrorDisplay from '../../components/ui/ErrorDisplay';

const MainDashboard = () => {
  const [activeTab, setActiveTab] = useState('todos');
  const [refreshKey, setRefreshKey] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [equipmentData, setEquipmentData] = useState([]);
  const [dashboardCounts, setDashboardCounts] = useState({});
  
  const navigate = useNavigate();

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
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

  const getFilteredEquipmentData = () => {
    if (!equipmentData) return [];
    switch (activeTab) {
      case 'pc':
        return equipmentData.filter(item => item.tipo && item.tipo.toLowerCase() === 'pc');
      case 'portatil':
        return equipmentData.filter(item => item.tipo && item.tipo.toLowerCase() === 'portatil');
      case 'tablet':
        return equipmentData.filter(item => item.tipo && item.tipo.toLowerCase() === 'tablet');
      case 'asignados':
        return equipmentData.filter(item => item.status === 'Asignado');
      case 'disponible':
        return equipmentData.filter(item => item.status === 'Disponible');
      case 'danados':
        return equipmentData.filter(item => item.status === 'Dañado');
      default:
        return equipmentData;
    }
  };

  const equipmentMetrics = [
    { title: 'Todos', count: dashboardCounts.total, icon: 'Computer', color: 'primary', description: `${dashboardCounts.disponible} disponibles` },
    { title: 'PC', count: dashboardCounts.pc, icon: 'Monitor', color: 'success', description: `${dashboardCounts.disponiblePc} disponibles` },
    { title: 'Portátil', count: dashboardCounts.portatil, icon: 'Laptop', color: 'warning', description: `${dashboardCounts.disponiblePortatil} disponibles` },
    { title: 'Tablet', count: dashboardCounts.tablet, icon: 'Tablet', color: 'danger', description: `${dashboardCounts.disponibleTablet} disponibles` },
  ];

  const statusData = [
    { status: 'PCs Disponibles', count: dashboardCounts.disponiblePc, type: 'Disponible', icon: 'Monitor' },
    { status: 'Portátiles Disponibles', count: dashboardCounts.disponiblePortatil, type: 'Disponible', icon: 'Laptop' },
    { status: 'Tablets Disponibles', count: dashboardCounts.disponibleTablet, type: 'Disponible', icon: 'Tablet' },
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
            <div>
              <h1 className="text-3xl font-bold text-foreground">Panel Principal</h1>
              <p className="text-muted-foreground">
                Gestión integral del inventario de equipos - EXPRESO VIAJES Y TURISMO
              </p>
            </div>

            <ErrorDisplay message={error} />

            <DashboardTabs 
              activeTab={activeTab} 
              onTabChange={handleTabChange}
              counts={dashboardCounts} 
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {equipmentMetrics.map((metric, index) => (
              <MetricsCard
                key={index}
                {...metric}
                onClick={() => handleMetricClick(metric.title)}
              />
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <EquipmentTable 
                equipmentData={getFilteredEquipmentData()}
                onEquipmentAction={handleEquipmentAction}
              />
            </div>
            <div className="space-y-6">
              <StatusOverview statusData={statusData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainDashboard;
