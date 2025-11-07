import React, { useState, useEffect } from 'react';
import MainNavigation from '../../components/iu/MainNavigation';
import DashboardTabs from '../../components/iu/DashboardTabs';
import WorkflowBreadcrumbs from '../../components/iu/WorkflowBreadcrumbs';
import MetricsCard from './components/MetricsCard';
import EquipmentTable from './components/EquipmentTable';
import QuickActions from './components/QuickActions';
import StatusOverview from './components/StatusOverview';
import { useNavigate } from 'react-router-dom';

const MainDashboard = () => {
  const [activeTab, setActiveTab] = useState('todos');
  const [refreshKey, setRefreshKey] = useState(0);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();

  // Mock data for equipment metrics
  const equipmentMetrics = [
    {
      title: 'Total PC',
      count: 45,
      icon: 'Monitor',
      color: 'primary',
      trend: { type: 'up', value: '+3' },
      description: 'Computadoras de escritorio'
    },
    {
      title: 'Total Portátiles',
      count: 67,
      icon: 'Laptop',
      color: 'accent',
      trend: { type: 'up', value: '+5' },
      description: 'Computadoras portátiles'
    },
    {
      title: 'Total Tablets',
      count: 23,
      icon: 'Tablet',
      color: 'success',
      trend: { type: 'neutral', value: '0' },
      description: 'Dispositivos tablet'
    },
    {
      title: 'Equipos Dañados',
      count: 12,
      icon: 'AlertTriangle',
      color: 'error',
      trend: { type: 'down', value: '-2' },
      description: 'Requieren reparación'
    }
  ];

  // Mock data for status overview
  const statusData = [
    {
      status: 'Asignados',
      count: 89,
      description: 'Equipos asignados a empleados'
    },
    {
      status: 'Disponible',
      count: 45,
      description: 'Equipos disponibles para asignación'
    },
    {
      status: 'Dañados',
      count: 12,
      description: 'Equipos que requieren reparación'
    }
  ];

  // Mock data for recent equipment activity
  const equipmentData = [
    {
      id: 1,
      type: 'PC',
      brand: 'Dell',
      model: 'OptiPlex 7090',
      serviceTag: 'DL7090001',
      employeeName: 'Carlos Rodríguez',
      area: 'Sistemas',
      status: 'Asignado',
      lastUpdated: new Date('2025-11-05T14:30:00')
    },
    {
      id: 2,
      type: 'Portátil',
      brand: 'HP',
      model: 'EliteBook 840',
      serviceTag: 'HP840002',
      employeeName: 'María González',
      area: 'Contabilidad',
      status: 'Asignado',
      lastUpdated: new Date('2025-11-05T13:15:00')
    },
    {
      id: 3,
      type: 'Tablet',
      brand: 'Samsung',
      model: 'Galaxy Tab S8',
      serviceTag: 'SM-T870003',
      employeeName: 'Ana Martínez',
      area: 'Ventas',
      status: 'Asignado',
      lastUpdated: new Date('2025-11-05T12:45:00')
    },
    {
      id: 4,
      type: 'PC',
      brand: 'Lenovo',
      model: 'ThinkCentre M720',
      serviceTag: 'LN720004',
      employeeName: 'Sin asignar',
      area: 'Almacén',
      status: 'Disponible',
      lastUpdated: new Date('2025-11-05T11:20:00')
    },
    {
      id: 5,
      type: 'Portátil',
      brand: 'Dell',
      model: 'Latitude 5520',
      serviceTag: 'DL5520005',
      employeeName: 'Pedro Sánchez',
      area: 'Recursos Humanos',
      status: 'Dañado',
      lastUpdated: new Date('2025-11-05T10:30:00')
    },
    {
      id: 6,
      type: 'PC',
      brand: 'HP',
      model: 'ProDesk 600',
      serviceTag: 'HP600006',
      employeeName: 'Laura Jiménez',
      area: 'Marketing',
      status: 'Asignado',
      lastUpdated: new Date('2025-11-05T09:15:00')
    },
    {
      id: 7,
      type: 'Tablet',
      brand: 'iPad',
      model: 'Air 5th Gen',
      serviceTag: 'IPD-A5007',
      employeeName: 'Sin asignar',
      area: 'Almacén',
      status: 'Disponible',
      lastUpdated: new Date('2025-11-05T08:45:00')
    },
    {
      id: 8,
      type: 'Portátil',
      brand: 'Asus',
      model: 'VivoBook Pro',
      serviceTag: 'AS-VP008',
      employeeName: 'Roberto Torres',
      area: 'Desarrollo',
      status: 'Asignado',
      lastUpdated: new Date('2025-11-04T16:30:00')
    }
  ];

  const handleToggleCollapse = () => {
    setIsCollapsed(prev => !prev);
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  const handleMetricClick = (metricType) => {
    // Navigate to specific equipment type view
    console.log('Navigate to:', metricType);
  };

  const handleEquipmentAction = (action, equipment = null) => {
    switch (action) {
      case 'refresh':
        setRefreshKey(prev => prev + 1);
        break;
      case 'view': console.log('View equipment:', equipment);
        break;
      case 'edit': console.log('Edit equipment:', equipment);
        break;
      default:
        break;
    }
  };

  // Filter equipment data based on active tab
  const getFilteredEquipmentData = () => {
    switch (activeTab) {
      case 'pc':
        return equipmentData?.filter(item => item?.type === 'PC');
      case 'portatil':
        return equipmentData?.filter(item => item?.type === 'Portátil');
      case 'tablet':
        return equipmentData?.filter(item => item?.type === 'Tablet');
      case 'asignados':
        return equipmentData?.filter(item => item?.status === 'Asignado');
      case 'disponible':
        return equipmentData?.filter(item => item?.status === 'Disponible');
      case 'danados':
        return equipmentData?.filter(item => item?.status === 'Dañado');
      default:
        return equipmentData;
    }
  };

  useEffect(() => {
    // Simulate data refresh
    console.log('Dashboard data refreshed');
  }, [refreshKey]);

  return (
    <div className="min-h-screen bg-background">
      <MainNavigation onToggleCollapse={handleToggleCollapse} />
      <div className="pt-16">
        <WorkflowBreadcrumbs />
        
        <div className="container mx-auto px-4 py-6 space-y-6">
          {/* Header Section */}
          <div className="space-y-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Panel Principal</h1>
              <p className="text-muted-foreground">
                Gestión integral del inventario de equipos - EXPRESO VIAJES Y TURISMO
              </p>
            </div>
            
            {/* Dashboard Tabs */}
            <DashboardTabs 
              activeTab={activeTab} 
              onTabChange={handleTabChange} 
            />
          </div>

          {/* Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {equipmentMetrics?.map((metric, index) => (
              <MetricsCard
                key={index}
                title={metric?.title}
                count={metric?.count}
                icon={metric?.icon}
                color={metric?.color}
                trend={metric?.trend}
                description={metric?.description}
                onClick={() => handleMetricClick(metric?.title)}
              />
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Equipment Table - Takes 2 columns */}
            <div className="lg:col-span-2">
              <EquipmentTable 
                equipmentData={getFilteredEquipmentData()}
                onEquipmentAction={handleEquipmentAction}
              />
            </div>

            {/* Sidebar - Takes 1 column */}
            <div className="space-y-6">
              <StatusOverview statusData={statusData} />
            </div>
          </div>

          {/* Quick Actions */}
          <QuickActions />

          {/* Additional Information */}
          <div className="bg-card border border-border rounded-lg p-6 shadow-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Información del Sistema</h3>
              <div className="text-sm text-muted-foreground">
                Última actualización: {new Date()?.toLocaleDateString('es-ES', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="space-y-1">
                <p className="font-medium text-foreground">Empresa:</p>
                <p className="text-muted-foreground">EXPRESO VIAJES Y TURISMO</p>
              </div>
              <div className="space-y-1">
                <p className="font-medium text-foreground">Sistema:</p>
                <p className="text-muted-foreground">EquipManager v1.0</p>
              </div>
              <div className="space-y-1">
                <p className="font-medium text-foreground">Estado:</p>
                <p className="text-success">Operativo</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainDashboard;