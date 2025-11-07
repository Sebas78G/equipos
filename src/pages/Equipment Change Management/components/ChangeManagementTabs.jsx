import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ChangeManagementTabs = ({ activeTab, onTabChange }) => {
  const tabs = [
    {
      id: 'damage',
      label: 'Daños/Problemas',
      icon: 'AlertTriangle',
      description: 'Reportar equipos dañados o con problemas técnicos',
      count: 12
    },
    {
      id: 'resignation',
      label: 'Renuncia',
      icon: 'UserMinus',
      description: 'Procesar equipos de empleados que renuncian',
      count: 8
    }
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-card">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-2">Gestión de Cambios de Equipos</h2>
          <p className="text-sm text-muted-foreground">
            Administre transiciones de equipos por daños o cambios de personal
          </p>
        </div>
        
        <div className="mt-4 md:mt-0 flex items-center space-x-2 text-sm text-muted-foreground">
          <Icon name="Clock" size={14} />
          <span>Última actualización: {new Date()?.toLocaleString('es-ES')}</span>
        </div>
      </div>
      {/* Tab Navigation */}
      <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
        {tabs?.map((tab) => (
          <Button
            key={tab?.id}
            variant={activeTab === tab?.id ? "default" : "outline"}
            onClick={() => onTabChange(tab?.id)}
            className="flex-1 justify-start p-4 h-auto"
          >
            <div className="flex items-center space-x-3 w-full">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                activeTab === tab?.id 
                  ? 'bg-primary-foreground/20' 
                  : tab?.id === 'damage' ?'bg-error/10' :'bg-warning/10'
              }`}>
                <Icon 
                  name={tab?.icon} 
                  size={20} 
                  className={
                    activeTab === tab?.id 
                      ? 'text-primary-foreground' 
                      : tab?.id === 'damage' ?'text-error' :'text-warning'
                  }
                />
              </div>
              
              <div className="flex-1 text-left">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">{tab?.label}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    activeTab === tab?.id 
                      ? 'bg-primary-foreground/20 text-primary-foreground' 
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {tab?.count}
                  </span>
                </div>
                <p className={`text-sm mt-1 ${
                  activeTab === tab?.id ? 'text-primary-foreground/80' : 'text-muted-foreground'
                }`}>
                  {tab?.description}
                </p>
              </div>
            </div>
          </Button>
        ))}
      </div>
      {/* Active Tab Indicator */}
      <div className="mt-6 p-4 bg-muted/50 rounded-lg">
        <div className="flex items-center space-x-3">
          <Icon 
            name={tabs?.find(tab => tab?.id === activeTab)?.icon || 'AlertTriangle'} 
            size={16} 
            className={activeTab === 'damage' ? 'text-error' : 'text-warning'}
          />
          <div>
            <p className="font-medium text-foreground">
              {activeTab === 'damage' ? 'Modo: Reporte de Daños' : 'Modo: Proceso de Renuncia'}
            </p>
            <p className="text-sm text-muted-foreground">
              {activeTab === 'damage' ?'Seleccione equipos para reportar problemas técnicos o daños físicos' :'Procese la devolución de equipos de empleados que han renunciado'
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangeManagementTabs;