import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import resolveEquipmentImage from '../../../utils/imageResolver';
import Button from '../../../components/ui/Button';
import { reportDamageByServiceTag } from '../../../services/damageService';
import { updateEquipment } from '../../../services/equipmentService';

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

const EquipmentDetailsCard = ({ equipment, onDamageReported, onStatusChange }) => {
  const navigate = useNavigate();
  
  if (!equipment || Object.keys(equipment).length === 0) {
    return <div className="bg-card border border-border rounded-lg shadow-card p-6 text-center">Cargando detalles del equipo...</div>;
  }
  
  const imagePath = resolveEquipmentImage(equipment.referencia_cpu);

  const getStatusInfo = (status) => {
    const statusConfig = {
      'Asignado': { text: 'Asignado', color: 'bg-primary text-primary-foreground' },
      'Disponible': { text: 'Disponible', color: 'bg-success text-success-foreground' },
      'Dañado': { text: 'Dañado', color: 'bg-error text-error-foreground' },
      'En proceso de renuncia': { text: 'En proceso de renuncia', color: 'bg-warning text-warning-foreground' },
      default: { text: 'Desconocido', color: 'bg-muted text-muted-foreground' }
    };
    return statusConfig[status] || statusConfig.default;
  };

  const statusInfo = getStatusInfo(equipment.status);
  const isAssigned = equipment.status === 'Asignado';
  
  const getTypeIcon = (type) => {
    const lowerType = type?.toLowerCase() || '';
    if (lowerType.includes('pc') || lowerType.includes('escritorio')) return 'Monitor';
    if (lowerType.includes('portatil')) return 'Laptop';
    if (lowerType.includes('tablet')) return 'Tablet';
    return 'Package';
  };

  const handleReportDamage = async () => {
    try {
      await reportDamageByServiceTag(equipment.serviceTag);
      if(onDamageReported) onDamageReported();
    } catch (error) {
      console.error('Failed to report damage', error);
    }
  };

  const handleAssignAction = () => {
    if (isAssigned) {
      const confirmation = window.confirm("¿Estás seguro de que quieres marcar este equipo como disponible?");
      if (confirmation) {
        updateEquipment(equipment.serviceTag, { status: 'disponible' })
          .then(() => {
            if (onStatusChange) onStatusChange();
          })
          .catch(error => console.error('Failed to update status', error));
      }
    } else {
      navigate(`/equipment-assignment?service_tag=${equipment.serviceTag}`);
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-card p-6">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-shrink-0">
        {imagePath ? (
            <img src={imagePath} alt={`Imagen de ${equipment.referencia_cpu}`} className="w-48 h-32 object-contain rounded-lg" />
          ) : (
            <div className="w-48 h-32 bg-muted rounded-lg flex items-center justify-center">
              <Icon name={getTypeIcon(equipment.tipo)} size={48} className="text-muted-foreground" />
            </div>
          )}
        </div>

        <div className="flex-1 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                 <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                  <Icon name={getTypeIcon(equipment.tipo)} size={20} className="text-accent" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-foreground">{equipment.marca_cpu} {equipment.referencia_cpu}</h2>
                  <p className="text-sm text-muted-foreground">Service Tag: {equipment.serviceTag}</p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:items-end space-y-2">
              <div className='flex items-center space-x-2'>
                <Button variant="outline" size="sm" onClick={handleReportDamage}><Icon name="ShieldAlert" className="mr-2 h-4 w-4" />Reportar Daño</Button>
                <Button size="sm" onClick={handleAssignAction}>
                  {isAssigned ? <Icon name="CheckCircle" className="mr-2 h-4 w-4" /> : <Icon name="UserPlus" className="mr-2 h-4 w-4" />}
                  {isAssigned ? 'Pasar a Disponible' : 'Asignar'}
                </Button>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                {statusInfo.text}
              </span>
              <p className="text-xs text-muted-foreground">Última actualización: {formatDate(equipment.lastUpdated)}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 border-t border-border pt-4">
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Tipo</p>
              <p className="text-sm font-medium text-foreground">{equipment.tipo || 'N/A'}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Activo CPU</p>
              <p className="text-sm font-medium text-foreground">{equipment.activo_cpu || 'N/A'}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Marca Pantalla</p>
              <p className="text-sm font-medium text-foreground">{equipment.marca_pantalla || 'N/A'}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Referencia Pantalla</p>
              <p className="text-sm font-medium text-foreground">{equipment.referencia_pantalla || 'N/A'}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Service Tag Pantalla</p>
              <p className="text-sm font-medium text-foreground">{equipment.service_tag_pantalla || 'N/A'}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Activo Pantalla</p>
              <p className="text-sm font-medium text-foreground">{equipment.activo_pantalla || 'N/A'}</p>
            </div>

            {isAssigned && (
              <>
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Nombre del Empleado</p>
                  <p className="text-sm font-medium text-foreground">{equipment.employeeName || 'N/A'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Fecha de Asignación</p>
                  <p className="text-sm font-medium text-foreground">{formatDate(equipment.acta)}</p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EquipmentDetailsCard;
