import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';

const EquipmentCard = ({ equipment, onReportDamage, onProcessResignation, activeTab }) => {
  const getEquipmentIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'pc':
        return 'Monitor';
      case 'portátil':
        return 'Laptop';
      case 'tablet':
        return 'Tablet';
      default:
        return 'Monitor';
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'asignado':
        return 'text-primary bg-primary/10';
      case 'disponible':
        return 'text-success bg-success/10';
      case 'dañado':
        return 'text-error bg-error/10';
      default:
        return 'text-muted-foreground bg-muted';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-card hover:shadow-modal transition-smooth">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
            <Icon name={getEquipmentIcon(equipment?.type)} size={24} className="text-accent" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{equipment?.brand} {equipment?.model}</h3>
            <p className="text-sm text-muted-foreground">Service Tag: {equipment?.serviceTag}</p>
          </div>
        </div>
        
        <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(equipment?.status)}`}>
          {equipment?.status}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm font-medium text-foreground mb-1">Empleado Asignado</p>
          <p className="text-sm text-muted-foreground">{equipment?.assignedEmployee?.name}</p>
          <p className="text-xs text-muted-foreground">{equipment?.assignedEmployee?.email}</p>
        </div>
        
        <div>
          <p className="text-sm font-medium text-foreground mb-1">Área</p>
          <p className="text-sm text-muted-foreground">{equipment?.assignedEmployee?.area}</p>
        </div>
        
        <div>
          <p className="text-sm font-medium text-foreground mb-1">Fecha de Asignación</p>
          <p className="text-sm text-muted-foreground">{equipment?.assignmentDate}</p>
        </div>
        
        <div>
          <p className="text-sm font-medium text-foreground mb-1">Cédula</p>
          <p className="text-sm text-muted-foreground">{equipment?.assignedEmployee?.cedula}</p>
        </div>
      </div>
      {equipment?.image && (
        <div className="mb-4">
          <div className="w-full h-32 overflow-hidden rounded-lg bg-muted">
            <Image
              src={equipment?.image}
              alt={equipment?.imageAlt}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}
      <div className="flex space-x-3">
        {activeTab === 'damage' && (
          <Button
            variant="destructive"
            onClick={() => onReportDamage(equipment)}
            iconName="AlertTriangle"
            iconPosition="left"
            className="flex-1"
          >
            Reportar Daño
          </Button>
        )}
        
        {activeTab === 'resignation' && (
          <Button
            variant="default"
            onClick={() => onProcessResignation(equipment)}
            iconName="UserMinus"
            iconPosition="left"
            className="flex-1"
          >
            Procesar Renuncia
          </Button>
        )}
        
        <Button
          variant="outline"
          iconName="Eye"
          size="default"
        >
          Ver Detalles
        </Button>
      </div>
    </div>
  );
};

export default EquipmentCard;