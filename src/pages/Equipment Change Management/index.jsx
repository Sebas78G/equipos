import React, { useState } from 'react';
import MainNavigation from '../../components/iu/MainNavigation';
import WorkflowBreadcrumbs from '../../components/iu/WorkflowBreadcrumbs';
import ChangeManagementTabs from './components/ChangeManagementTabs';
import EquipmentSearchBar from './components/EquipmentSearchBar';
import EquipmentList from './components/EquipmentList';
import DamageReportModal from './components/DamageReportModal';
import ResignationProcessModal from './components/ResignationProcessModal';
import Icon from '../../components/Applcon';

const EquipmentChangeManagement = () => {
  const [activeTab, setActiveTab] = useState('damage');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [isDamageModalOpen, setIsDamageModalOpen] = useState(false);
  const [isResignationModalOpen, setIsResignationModalOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Mock data for assigned equipment
  const assignedEquipments = [
  {
    id: 1,
    serviceTag: "ST001234",
    brand: "Dell",
    model: "Latitude 5520",
    type: "Portátil",
    status: "Asignado",
    assignmentDate: "15/10/2024",
    image: "https://images.unsplash.com/photo-1599685171149-d2a83dc4a32f",
    imageAlt: "Dell Latitude laptop open on wooden desk showing professional workspace setup",
    assignedEmployee: {
      name: "María González Rodríguez",
      email: "maria.gonzalez@expresoviajes.com",
      cedula: "12345678",
      area: "Contabilidad"
    }
  },
  {
    id: 2,
    serviceTag: "ST001235",
    brand: "HP",
    model: "EliteDesk 800",
    type: "PC",
    status: "Asignado",
    assignmentDate: "12/10/2024",
    image: "https://images.unsplash.com/photo-1670818936538-d7ce01235442",
    imageAlt: "HP desktop computer tower in modern office environment with monitor and keyboard",
    assignedEmployee: {
      name: "Carlos Mendoza López",
      email: "carlos.mendoza@expresoviajes.com",
      cedula: "87654321",
      area: "Ventas"
    }
  },
  {
    id: 3,
    serviceTag: "ST001236",
    brand: "Lenovo",
    model: "ThinkPad X1",
    type: "Portátil",
    status: "Asignado",
    assignmentDate: "08/10/2024",
    image: "https://images.unsplash.com/photo-1649573650925-d88c805444ea",
    imageAlt: "Lenovo ThinkPad laptop with black finish on conference table in meeting room",
    assignedEmployee: {
      name: "Ana Patricia Herrera",
      email: "ana.herrera@expresoviajes.com",
      cedula: "11223344",
      area: "Recursos Humanos"
    }
  },
  {
    id: 4,
    serviceTag: "ST001237",
    brand: "Samsung",
    model: "Galaxy Tab S8",
    type: "Tablet",
    status: "Asignado",
    assignmentDate: "05/10/2024",
    image: "https://images.unsplash.com/photo-1590103515336-6e211e1ace1f",
    imageAlt: "Samsung Galaxy tablet displaying business presentation on conference room table",
    assignedEmployee: {
      name: "Roberto Silva Martínez",
      email: "roberto.silva@expresoviajes.com",
      cedula: "55667788",
      area: "Marketing"
    }
  },
  {
    id: 5,
    serviceTag: "ST001238",
    brand: "Apple",
    model: "MacBook Pro 14",
    type: "Portátil",
    status: "Asignado",
    assignmentDate: "02/10/2024",
    image: "https://images.unsplash.com/photo-1591548745205-001fd9ef73f2",
    imageAlt: "Apple MacBook Pro with silver finish open on modern desk with coffee cup nearby",
    assignedEmployee: {
      name: "Laura Fernández Castro",
      email: "laura.fernandez@expresoviajes.com",
      cedula: "99887766",
      area: "Diseño Gráfico"
    }
  },
  {
    id: 6,
    serviceTag: "ST001239",
    brand: "Asus",
    model: "VivoBook 15",
    type: "Portátil",
    status: "Asignado",
    assignmentDate: "28/09/2024",
    image: "https://images.unsplash.com/photo-1666926785795-936c30b52bb0",
    imageAlt: "Asus VivoBook laptop with dark gray finish on office desk with documents and pen",
    assignedEmployee: {
      name: "Diego Ramírez Vega",
      email: "diego.ramirez@expresoviajes.com",
      cedula: "33445566",
      area: "Operaciones"
    }
  }];


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
    // Here you would typically send the data to your backend
    alert(`Reporte de daño enviado para el equipo ${damageData?.serviceTag}`);
  };

  const handleResignationSubmit = (resignationData) => {
    console.log('Resignation processed:', resignationData);
    // Here you would typically send the data to your backend
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
                <p className="text-2xl font-bold text-foreground">12</p>
                <p className="text-xs text-muted-foreground">Equipos con problemas</p>
              </div>
              
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Icon name="UserMinus" size={16} className="text-warning" />
                  <span className="text-sm font-medium text-foreground">Renuncias</span>
                </div>
                <p className="text-2xl font-bold text-foreground">8</p>
                <p className="text-xs text-muted-foreground">Equipos por procesar</p>
              </div>
              
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Icon name="Package" size={16} className="text-accent" />
                  <span className="text-sm font-medium text-foreground">Total Asignados</span>
                </div>
                <p className="text-2xl font-bold text-foreground">{assignedEquipments?.length}</p>
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