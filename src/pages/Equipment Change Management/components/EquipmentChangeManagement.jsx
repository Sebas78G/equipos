import React, { useState, useEffect } from 'react';
import MainNavigation from 'components/ui/MainNavigation';
import WorkflowBreadcrumbs from 'components/ui/WorkflowBreadcrumbs';
import ChangeManagementTabs from './ChangeManagementTabs';
import EquipmentSearchBar from './EquipmentSearchBar';
import EquipmentList from './EquipmentList';
import DamageReportModal from './DamageReportModal';
import ResignationProcessModal from './ResignationProcessModal';
import Icon from 'components/AppIcon';
import { getDashboardData } from '../../../services/dashboardService';

const EquipmentChangeManagement = () => {
  const [activeTab, setActiveTab] = useState('damage');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [isDamageModalOpen, setIsDamageModalOpen] = useState(false);
  const [isResignationModalOpen, setIsResignationModalOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [assignedEquipments, setAssignedEquipments] = useState([]);
  const [dashboardCounts, setDashboardCounts] = useState({});


  useEffect(() => {
    const fetchData = async () => {
      try {
        const { recentActivity, dashboardCounts } = await getDashboardData();
        const assigned = recentActivity.filter(eq => eq.status === 'Asignado');
        setAssignedEquipments(assigned);
        setDashboardCounts(dashboardCounts);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchData();
  }, []);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setSearchTerm('');
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleReportDamage = (equipment) => {
    setSelectedEquipment(equipment);
    setIsDamageModalOpen(true);
  };

  const handleProcessResignation = (equipment) => {
    setSelectedEquipment(equipment);
    setIsResignationModalOpen(true);
  };

  const handleDamageSubmit = (damageData) => {
    console.log('Damage report submitted:', damageData);
    alert(`Reporte de daño enviado para el equipo ${damageData?.serviceTag}`);
  };

  const handleResignationSubmit = (resignationData) => {
    console.log('Resignation processed:', resignationData);
    alert(`Renuncia procesada para el equipo ${resignationData?.serviceTag}`);
  };

  const handleToggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="min-h-screen bg-background">
      <MainNavigation onToggleCollapse={handleToggleCollapse} />
      <div className="pt-16">
        <WorkflowBreadcrumbs />
        
        <main className="container mx-auto px-4 py-6 space-y-6">
          {/* Header Section */}
          <div className="bg-card border border-border rounded-lg p-6 shadow-card">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Icon name="RefreshCw" size={24} className="text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Gestión de Cambios de Equipos</h1>
                <p className="text-muted-foreground">
                  Administre transiciones de equipos por daños técnicos o cambios de personal
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Icon name="AlertTriangle" size={16} className="text-error" />
                  <span className="text-sm font-medium text-foreground">Reportes de Daños</span>
                </div>
                <p className="text-2xl font-bold text-foreground">{dashboardCounts.danados || 0}</p>
                <p className="text-xs text-muted-foreground">Equipos con problemas</p>
              </div>
              
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Icon name="UserMinus" size={16} className="text-warning" />
                  <span className="text-sm font-medium text-foreground">Renuncias</span>
                </div>
                <p className="text-2xl font-bold text-foreground">0</p>
                <p className="text-xs text-muted-foreground">Equipos por procesar</p>
              </div>
              
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Icon name="Package" size={16} className="text-accent" />
                  <span className="text-sm font-medium text-foreground">Total Asignados</span>
                </div>
                <p className="text-2xl font-bold text-foreground">{dashboardCounts.asignados || 0}</p>
                <p className="text-xs text-muted-foreground">Equipos en uso</p>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <ChangeManagementTabs
            activeTab={activeTab}
            onTabChange={handleTabChange} />


          {/* Search Bar */}
          <EquipmentSearchBar
            onSearch={handleSearch}
            placeholder={
            activeTab === 'damage' ?
            "Buscar equipos para reportar daños..." : "Buscar equipos de empleados que renuncian..."
            } />


          {/* Equipment List */}
          <EquipmentList
            equipments={assignedEquipments}
            activeTab={activeTab}
            searchTerm={searchTerm}
            onReportDamage={handleReportDamage}
            onProcessResignation={handleProcessResignation} />


          {/* Modals */}
          <DamageReportModal
            equipment={selectedEquipment}
            isOpen={isDamageModalOpen}
            onClose={() => setIsDamageModalOpen(false)}
            onSubmit={handleDamageSubmit} />


          <ResignationProcessModal
            equipment={selectedEquipment}
            isOpen={isResignationModalOpen}
            onClose={() => setIsResignationModalOpen(false)}
            onSubmit={handleResignationSubmit} />

        </main>
      </div>
    </div>);

};

export default EquipmentChangeManagement;