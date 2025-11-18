import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const EquipmentDetailsCard = ({ equipment }) => {

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'asignado':
        return 'bg-primary text-primary-foreground';
      case 'disponible':
        return 'bg-success text-success-foreground';
      case 'dañado':
        return 'bg-error text-error-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getTypeIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'pc':
        return 'Monitor';
      case 'portátil':
        return 'Laptop';
      case 'tablet':
        return 'Tablet';
      default:
        return 'Package';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-card p-6">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Equipment Image */}
        <div className="flex-shrink-0">
          <div className="w-48 h-32 bg-muted rounded-lg overflow-hidden">
            <Image
              src={equipment?.image}
              alt={equipment?.imageAlt}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Equipment Information */}
        <div className="flex-1 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                  <Icon name={getTypeIcon(equipment?.type)} size={20} className="text-accent" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-foreground">{equipment?.brand} {equipment?.model}</h2>
                  <p className="text-sm text-muted-foreground">Service Tag: {equipment?.serviceTag}</p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:items-end space-y-2">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(equipment?.status)}`}>
                {equipment?.status}
              </span>
              <p className="text-xs text-muted-foreground">Última actualización: {equipment?.lastUpdated}</p>
            </div>
          </div>

          {/* Specifications Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Tipo</p>
              <p className="text-sm font-medium text-foreground">{equipment?.type}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Procesador</p>
              <p className="text-sm font-medium text-foreground">{equipment?.processor}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Memoria RAM</p>
              <p className="text-sm font-medium text-foreground">{equipment?.ram}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Almacenamiento</p>
              <p className="text-sm font-medium text-foreground">{equipment?.storage}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Sistema Operativo</p>
              <p className="text-sm font-medium text-foreground">{equipment?.os}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Fecha de Compra</p>
              <p className="text-sm font-medium text-foreground">{equipment?.purchaseDate}</p>
            </div>
          </div>

          {/* Current Assignment */}
          {equipment?.currentAssignment && (
            <div className="bg-muted/50 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center">
                <Icon name="User" size={16} className="mr-2" />
                Asignación Actual
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">Empleado</p>
                  <p className="text-sm font-medium text-foreground">{equipment?.currentAssignment?.employeeName}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">Área</p>
                  <p className="text-sm font-medium text-foreground">{equipment?.currentAssignment?.department}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">Fecha de Asignación</p>
                  <p className="text-sm font-medium text-foreground">{equipment?.currentAssignment?.assignedDate}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">Correo</p>
                  <p className="text-sm font-medium text-foreground">{equipment?.currentAssignment?.email}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EquipmentDetailsCard;