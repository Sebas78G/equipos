import React, { useState, useEffect } from 'react';
import MainNavigation from 'components/ui/MainNavigation';
import DashboardTabs from 'components/ui/DashboardTabs';
import WorkflowBreadcrumbs from 'components/ui/WorkflowBreadcrumbs';
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
  const equipmentMetrics = [];

  // Mock data for status overview
  const statusData = [];

  // Mock data for recent equipment activity
  const equipmentData = [];

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
                <p className="text-muted-foreground">Equipos EVT v1.0</p>
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