import React, { useState, useEffect } from 'react';
import MainNavigation from '../../components/iu/MainNavigation';
import WorkflowBreadcrumbs from '../../components/iu/WorkflowBreadcrumbs';
import EquipmentSearchBar from './components/EquipmentSearchBar';
import EquipmentDetailsCard from './components/EquipmentDetailsCard';
import HistoryFilters from './components/HistoryFilters';
import HistoryTimeline from './components/HistoryTimeline';
import Icon from '../../components/Applcon';
import Button from '../../components/iu/Button';

const EquipmentHistory = () => {
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [historyEntries, setHistoryEntries] = useState([]);
  const [filters, setFilters] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Mock equipment data
  const mockEquipment = {
    id: 'EQ001234',
    serviceTag: 'ST001234',
    brand: 'Dell',
    model: 'OptiPlex 7090',
    type: 'PC',
    status: 'Asignado',
    processor: 'Intel Core i7-11700',
    ram: '16GB DDR4',
    storage: '512GB SSD',
    os: 'Windows 11 Pro',
    purchaseDate: '15/03/2023',
    lastUpdated: '05/11/2024 14:30',
    image: "https://images.unsplash.com/photo-1681422480634-62baf0c7336e",
    imageAlt: 'Modern desktop computer setup with Dell monitor and tower on clean white desk',
    currentAssignment: {
      employeeName: 'Carlos Rodríguez Martínez',
      department: 'Sistemas',
      assignedDate: '20/10/2024',
      email: 'carlos.rodriguez@expresoviajes.com'
    }
  };

  // Mock history entries
  const mockHistoryEntries = [
  {
    id: 'H001',
    eventType: 'assignment',
    title: 'Equipo Asignado',
    description: 'Equipo asignado a empleado del área de Sistemas',
    date: '20/10/2024',
    time: '09:15',
    administrator: 'Admin Sistema',
    employee: {
      name: 'Carlos Rodríguez Martínez',
      department: 'Sistemas',
      cedula: '12345678',
      email: 'carlos.rodriguez@expresoviajes.com'
    },
    details: 'Asignación inicial del equipo para labores de desarrollo y soporte técnico.',
    documents: [
    { name: 'Acta_Entrega_ST001234.pdf', type: 'delivery' },
    { name: 'Checklist_Accesorios.pdf', type: 'checklist' }],

    hasAdditionalInfo: true,
    additionalInfo: {
      accessories: ['Mouse óptico', 'Teclado USB', 'Monitor 24"', 'Cable HDMI', 'Base refrigerante'],
      notes: `Equipo entregado en perfecto estado. Se realizó configuración inicial del sistema operativo y software corporativo.\nSe instalaron las siguientes aplicaciones: Office 365, Antivirus corporativo, VPN cliente.\nEmpleado capacitado en el uso correcto del equipo y políticas de seguridad informática.`,
      reason: 'Nuevo ingreso - Requerimiento del área de Sistemas'
    }
  },
  {
    id: 'H002',
    eventType: 'repair',
    title: 'Mantenimiento Preventivo',
    description: 'Mantenimiento preventivo programado realizado',
    date: '15/09/2024',
    time: '14:30',
    administrator: 'Técnico Soporte',
    details: 'Se realizó limpieza interna, actualización de drivers y verificación de componentes.',
    documents: [
    { name: 'Reporte_Mantenimiento.pdf', type: 'maintenance' }],

    hasAdditionalInfo: true,
    additionalInfo: {
      notes: `Mantenimiento preventivo completado exitosamente.\n- Limpieza interna de componentes\n- Actualización de drivers de sistema\n- Verificación de temperatura de CPU\n- Desfragmentación de disco duro\n- Actualización de antivirus`,
      reason: 'Mantenimiento preventivo programado'
    }
  },
  {
    id: 'H003',
    eventType: 'unassignment',
    title: 'Equipo Desasignado',
    description: 'Equipo devuelto por cambio de área del empleado',
    date: '10/08/2024',
    time: '16:45',
    administrator: 'Admin Sistema',
    employee: {
      name: 'María González López',
      department: 'Contabilidad',
      cedula: '87654321',
      email: 'maria.gonzalez@expresoviajes.com'
    },
    details: 'Empleado trasladado al área de Ventas, equipo devuelto para reasignación.',
    documents: [
    { name: 'Acta_Devolucion_ST001234.pdf', type: 'return' }],

    hasAdditionalInfo: true,
    additionalInfo: {
      accessories: ['Mouse óptico', 'Teclado USB', 'Monitor 24"', 'Cable HDMI'],
      notes: `Equipo devuelto en buen estado general.\nSe realizó respaldo de información personal del usuario.\nSe ejecutó formateo completo del disco duro por políticas de seguridad.\nTodos los accesorios fueron devueltos en perfecto estado.`,
      reason: 'Cambio de área - Traslado a Ventas'
    }
  },
  {
    id: 'H004',
    eventType: 'assignment',
    title: 'Equipo Asignado',
    description: 'Primera asignación del equipo a empleado de Contabilidad',
    date: '25/07/2024',
    time: '10:20',
    administrator: 'Admin Sistema',
    employee: {
      name: 'María González López',
      department: 'Contabilidad',
      cedula: '87654321',
      email: 'maria.gonzalez@expresoviajes.com'
    },
    details: 'Asignación inicial para labores contables y administrativas.',
    documents: [
    { name: 'Acta_Entrega_Inicial_ST001234.pdf', type: 'delivery' }],

    hasAdditionalInfo: true,
    additionalInfo: {
      accessories: ['Mouse óptico', 'Teclado USB', 'Monitor 24"', 'Cable HDMI'],
      notes: `Primera asignación del equipo.\nInstalación de software contable especializado.\nConfiguración de accesos a sistemas financieros.\nCapacitación en políticas de uso y seguridad.`,
      reason: 'Nuevo ingreso - Área de Contabilidad'
    }
  },
  {
    id: 'H005',
    eventType: 'available',
    title: 'Equipo Disponible',
    description: 'Equipo configurado y listo para asignación',
    date: '20/07/2024',
    time: '11:00',
    administrator: 'Técnico Soporte',
    details: 'Configuración inicial completada, equipo listo para primera asignación.',
    hasAdditionalInfo: true,
    additionalInfo: {
      notes: `Equipo configurado con imagen corporativa estándar.\nInstalación de software base completada.\nPruebas de funcionamiento realizadas exitosamente.\nEquipo registrado en inventario corporativo.`,
      reason: 'Configuración inicial completada'
    }
  },
  {
    id: 'H006',
    eventType: 'purchase',
    title: 'Equipo Adquirido',
    description: 'Compra e ingreso al inventario corporativo',
    date: '15/07/2024',
    time: '08:30',
    administrator: 'Compras',
    details: 'Equipo adquirido según orden de compra OC-2024-0789.',
    documents: [
    { name: 'Factura_Compra_ST001234.pdf', type: 'invoice' },
    { name: 'Garantia_Fabricante.pdf', type: 'warranty' }],

    hasAdditionalInfo: true,
    additionalInfo: {
      notes: `Equipo nuevo adquirido de proveedor autorizado Dell.\nGarantía del fabricante: 3 años on-site.\nIncluye licencia Windows 11 Pro corporativa.\nRecibido en perfecto estado según checklist de recepción.`,
      reason: 'Ampliación de inventario - Crecimiento del equipo de trabajo'
    }
  }];


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

  const recentSearches = ['ST001234', 'ST001235', 'Dell OptiPlex', 'HP EliteBook'];

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