import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import resolveEquipmentImage from '../../../utils/imageResolver';
import Button from '../../../components/ui/Button';
import { reportDamageByServiceTag } from '../../../services/damageService';
import { repairEquipment } from '../../../services/equipmentService';
import RepairModal from './RepairModal';

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
    return dateString;
  }
};

const EquipmentDetailsCard = ({ equipment, onDamageReported }) => {
  const navigate = useNavigate();
  const [isRepairModalOpen, setRepairModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!equipment || Object.keys(equipment).length === 0) {
    return <div className="bg-card border border-border rounded-lg shadow-card p-6 text-center">Cargando detalles del equipo...</div>;
  }

  const imagePath = resolveEquipmentImage(equipment.referencia_cpu);
  
  let displayStatus;
  if (equipment.source_table === 'danos') {
    displayStatus = 'Dañado';
  } else if (equipment.source_table === 'disponibles') {
    displayStatus = 'Disponible';
  } else if (equipment.source_table && equipment.source_table.includes('asignaciones')) {
    displayStatus = 'Asignado';
  } else {
    displayStatus = 'Desconocido';
  }

  const getStatusInfo = (status) => {
    const statusConfig = {
      'Asignado': { text: 'Asignado', color: 'bg-primary text-primary-foreground' },
      'Disponible': { text: 'Disponible', color: 'bg-success text-success-foreground' },
      'Dañado': { text: 'Dañado', color: 'bg-error text-error-foreground' },
      'Desconocido': { text: 'Disponible', color: 'bg-success text-success-foreground' }, // Treat unknown as available
      default: { text: status, color: 'bg-muted text-muted-foreground' }
    };
    return statusConfig[status] || statusConfig.default;
  };

  const statusInfo = getStatusInfo(displayStatus);

  const getTypeIcon = (type) => {
    const lowerType = type?.toLowerCase() || '';
    if (lowerType.includes('pc') || lowerType.includes('escritorio')) return 'Monitor';
    if (lowerType.includes('portatil')) return 'Laptop';
    if (lowerType.includes('tablet')) return 'Tablet';
    return 'Package';
  };

  const handleReportDamage = async () => {
    const observaciones = window.prompt("Por favor, describe el daño del equipo:");
    if (observaciones) {
        try {
            await reportDamageByServiceTag(equipment.service_tag_cpu, observaciones);
            alert('Daño reportado con éxito. El equipo se ha movido a la sección de dañados.');
            if (onDamageReported) onDamageReported();
        } catch (error) {
            console.error('Failed to report damage', error);
            alert('No se pudo reportar el daño. Por favor, inténtalo de nuevo.');
        }
    }
  };

  const handleRepairSubmit = async (repairNotes) => {
    setIsSubmitting(true);
    try {
      await repairEquipment(equipment.service_tag_cpu, repairNotes);
      alert('Equipo reparado y movido a disponibles con éxito.');
      setRepairModalOpen(false);
      if (onDamageReported) onDamageReported();
    } catch (error) {
      console.error('Failed to repair equipment', error);
      alert(`No se pudo reparar el equipo: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleAssignAction = () => {
    navigate(`/equipment-assignment?service_tag=${equipment.service_tag_cpu}`);
  };

  const handleManageChange = () => {
    navigate(`/equipment-change-management`, { state: { serviceTag: equipment.service_tag_cpu } });
  };

  const isDamaged = displayStatus === 'Dañado';
  const isAvailable = displayStatus === 'Disponible';
  const isAssigned = displayStatus === 'Asignado';
  const isUnknown = displayStatus === 'Desconocido';
  
  return (
    <>
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
                    <p className="text-sm text-muted-foreground">Service Tag: {equipment.service_tag_cpu}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:items-end space-y-2">
                <div className='flex items-center space-x-2'>
                  {isDamaged && (
                    <Button variant="success" size="sm" onClick={() => setRepairModalOpen(true)}>
                      <Icon name="Wrench" className="mr-2 h-4 w-4" />
                      Reparar
                    </Button>
                  )}

                  {(isAvailable || isUnknown) && (
                    <>
                      <Button variant="outline" size="sm" onClick={handleReportDamage}>
                        <Icon name="ShieldAlert" className="mr-2 h-4 w-4" />
                        Reportar Daño
                      </Button>
                      <Button size="sm" onClick={handleAssignAction}>
                        <Icon name="UserPlus" className="mr-2 h-4 w-4" />
                        Asignar
                      </Button>
                    </>
                  )}

                  {isAssigned && (
                     <>
                        <Button variant="outline" size="sm" onClick={handleReportDamage}>
                            <Icon name="ShieldAlert" className="mr-2 h-4 w-4" />
                            Reportar Daño
                        </Button>
                        <Button size="sm" onClick={handleManageChange}>
                            <Icon name="ArrowRightLeft" className="mr-2 h-4 w-4" />
                            Gestionar Cambio
                        </Button>
                    </>
                  )}
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                  {statusInfo.text}
                </span>
                <p className="text-xs text-muted-foreground">Última actualización: {formatDate(equipment.acta)}</p>
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
  </div>
</div>

          {/* Current Assignment Details */}
          {isAssigned && (
            <div className="border-t border-border pt-4">
              <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center">
                  <Icon name="User" size={16} className="mr-2 text-primary" />
                  Asignación Actual
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-1">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Nombre del Empleado</p>
                      <p className="text-sm font-medium text-foreground">{equipment.employeeName || 'N/A'}</p>
                  </div>
                  <div className="space-y-1">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Fecha de Asignación</p>
                      <p className="text-sm font-medium text-foreground">{formatDate(equipment.assignmentDate)}</p>
                  </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <RepairModal 
        isOpen={isRepairModalOpen} 
        onClose={() => setRepairModalOpen(false)} 
        onSubmit={handleRepairSubmit} 
        isSubmitting={isSubmitting} 
      />
    </>
  );
};

export default EquipmentDetailsCard;
