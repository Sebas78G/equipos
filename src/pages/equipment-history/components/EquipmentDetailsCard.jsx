import React from 'react';
import Icon from '../../../components/AppIcon';

// Helper to format date if it exists
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Fecha inválida';
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch (e) {
    return dateString; // Return original if parsing fails
  }
};

const EquipmentDetailsCard = ({ equipment }) => {
  // equipment can be null or empty, so we need to guard against that
  if (!equipment || Object.keys(equipment).length === 0) {
    // Or render a loading state/placeholder
    return <div className="bg-card border border-border rounded-lg shadow-card p-6 text-center">Cargando detalles del equipo...</div>;
  }
  
  // Deriving status from the source table provided by the backend
  const getStatusInfo = (sourceTable) => {
    switch (sourceTable) {
      case 'asignaciones_pc':
      case 'asignaciones_portatiles':
      case 'asignaciones_tablets':
        return { text: 'Asignado', color: 'bg-primary text-primary-foreground' };
      case 'disponibles':
        return { text: 'Disponible', color: 'bg-success text-success-foreground' };
      case 'danos':
        return { text: 'Dañado', color: 'bg-error text-error-foreground' };
      case 'renuncia':
        return { text: 'En proceso de renuncia', color: 'bg-warning text-warning-foreground' };
      default:
        return { text: 'Desconocido', color: 'bg-muted text-muted-foreground' };
    }
  };

  const statusInfo = getStatusInfo(equipment.source_table);
  const isAssigned = equipment.source_table?.startsWith('asignaciones');
  
  const getTypeIcon = (type) => {
    const lowerType = type?.toLowerCase() || '';
    if (lowerType.includes('pc') || lowerType.includes('escritorio')) return 'Monitor';
    if (lowerType.includes('portatil')) return 'Laptop';
    if (lowerType.includes('tablet')) return 'Tablet';
    return 'Package';
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-card p-6">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Equipment Image - Placeholder */}
        <div className="flex-shrink-0">
          <div className="w-48 h-32 bg-muted rounded-lg flex items-center justify-center">
             <Icon name={getTypeIcon(equipment.tipo)} size={48} className="text-muted-foreground" />
          </div>
        </div>

        {/* Equipment Information */}
        <div className="flex-1 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                 <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                  <Icon name={getTypeIcon(equipment.tipo)} size={20} className="text-accent" />
                </div>
                <div>
                  {/* Using 'marca_cpu' and 'referencia_cpu' */}
                  <h2 className="text-xl font-semibold text-foreground">{equipment.marca_cpu} {equipment.referencia_cpu}</h2>
                  {/* Using 'service_tag_cpu' */}
                  <p className="text-sm text-muted-foreground">Service Tag: {equipment.service_tag_cpu}</p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:items-end space-y-2">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                {statusInfo.text}
              </span>
              {/* Using 'acta' for last updated date */}
              <p className="text-xs text-muted-foreground">Última actualización: {formatDate(equipment.acta)}</p>
            </div>
          </div>

          {/* Specifications Grid - Using fields that exist in the database */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Tipo</p>
              {/* Using 'tipo' */}
              <p className="text-sm font-medium text-foreground">{equipment.tipo || 'N/A'}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Activo CPU</p>
               {/* Using 'activo_cpu' */}
              <p className="text-sm font-medium text-foreground">{equipment.activo_cpu || 'N/A'}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Marca Pantalla</p>
              {/* Using 'marca_pantalla' */}
              <p className="text-sm font-medium text-foreground">{equipment.marca_pantalla || 'N/A'}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Referencia Pantalla</p>
              {/* Using 'referencia_pantalla' */}
              <p className="text-sm font-medium text-foreground">{equipment.referencia_pantalla || 'N/A'}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Service Tag Pantalla</p>
              {/* Using 'service_tag_pantalla' */}
              <p className="text-sm font-medium text-foreground">{equipment.service_tag_pantalla || 'N/A'}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Activo Pantalla</p>
              {/* Using 'activo_pantalla' */}
              <p className="text-sm font-medium text-foreground">{equipment.activo_pantalla || 'N/A'}</p>
            </div>
          </div>

          {/* Current Assignment - Display only if assigned */}
          {isAssigned && (
            <div className="bg-muted/50 rounded-lg p-4 mt-4">
              <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center">
                <Icon name="User" size={16} className="mr-2" />
                Asignación Actual
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">Empleado</p>
                  {/* Using 'nombre_funcionario' */}
                  <p className="text-sm font-medium text-foreground">{equipment.nombre_funcionario || 'N/A'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">Área</p>
                  {/* Using 'area' */}
                  <p className="text-sm font-medium text-foreground">{equipment.area || 'N/A'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">Fecha de Asignación</p>
                   {/* Using 'acta' */}
                  <p className="text-sm font-medium text-foreground">{formatDate(equipment.acta)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">Correo</p>
                  {/* Using 'correo' */}
                  <p className="text-sm font-medium text-foreground">{equipment.correo || 'N/A'}</p>
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