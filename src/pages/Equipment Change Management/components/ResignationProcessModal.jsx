import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';

const ResignationProcessModal = ({ equipment, isOpen, onClose, onSubmit }) => {
  const [resignationData, setResignationData] = useState({
    employeeName: equipment?.assignedEmployee?.name || '',
    employeeEmail: equipment?.assignedEmployee?.email || '',
    employeeCedula: equipment?.assignedEmployee?.cedula || '',
    employeeArea: equipment?.assignedEmployee?.area || '',
    resignationDate: new Date()?.toISOString()?.split('T')?.[0],
    lastWorkingDay: '',
    handoverNotes: '',
    equipmentCondition: 'good',
    accessoriesReturned: {
      mouse: false,
      keyboard: false,
      charger: false,
      bag: false,
      cables: false
    },
    processedBy: 'Admin',
    hrNotified: false,
    itNotified: false,
    documentationGenerated: false
  });

  const conditionOptions = [
    { value: 'excellent', label: 'Excelente - Como nuevo' },
    { value: 'good', label: 'Bueno - Funcional sin problemas' },
    { value: 'fair', label: 'Regular - Funcional con desgaste' },
    { value: 'poor', label: 'Malo - Requiere reparación' }
  ];

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (onSubmit) {
      onSubmit({
        ...resignationData,
        equipmentId: equipment?.id,
        serviceTag: equipment?.serviceTag
      });
    }
    onClose();
  };

  const handleInputChange = (field, value) => {
    setResignationData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAccessoryChange = (accessory, checked) => {
    setResignationData(prev => ({
      ...prev,
      accessoriesReturned: {
        ...prev?.accessoriesReturned,
        [accessory]: checked
      }
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-popover border border-border rounded-lg shadow-modal w-full max-w-4xl max-h-[90vh] overflow-y-auto m-4">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
              <Icon name="UserMinus" size={20} className="text-warning" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Procesar Renuncia de Empleado</h2>
              <p className="text-sm text-muted-foreground">
                {equipment?.brand} {equipment?.model} - {equipment?.serviceTag}
              </p>
            </div>
          </div>
          
          <Button variant="ghost" onClick={onClose} iconName="X" size="sm" />
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Employee Information */}
          <div className="bg-muted/50 rounded-lg p-4">
            <h3 className="font-medium text-foreground mb-4 flex items-center space-x-2">
              <Icon name="User" size={16} />
              <span>Información del Empleado</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Nombre Completo"
                type="text"
                value={resignationData?.employeeName}
                onChange={(e) => handleInputChange('employeeName', e?.target?.value)}
                disabled
              />

              <Input
                label="Correo Electrónico"
                type="email"
                value={resignationData?.employeeEmail}
                onChange={(e) => handleInputChange('employeeEmail', e?.target?.value)}
                disabled
              />

              <Input
                label="Cédula"
                type="text"
                value={resignationData?.employeeCedula}
                onChange={(e) => handleInputChange('employeeCedula', e?.target?.value)}
                disabled
              />

              <Input
                label="Área"
                type="text"
                value={resignationData?.employeeArea}
                onChange={(e) => handleInputChange('employeeArea', e?.target?.value)}
                disabled
              />
            </div>
          </div>

          {/* Resignation Details */}
          <div>
            <h3 className="font-medium text-foreground mb-4 flex items-center space-x-2">
              <Icon name="Calendar" size={16} />
              <span>Detalles de la Renuncia</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Fecha de Renuncia *"
                type="date"
                value={resignationData?.resignationDate}
                onChange={(e) => handleInputChange('resignationDate', e?.target?.value)}
                required
              />

              <Input
                label="Último Día de Trabajo *"
                type="date"
                value={resignationData?.lastWorkingDay}
                onChange={(e) => handleInputChange('lastWorkingDay', e?.target?.value)}
                required
              />
            </div>
          </div>

          {/* Equipment Condition */}
          <div>
            <h3 className="font-medium text-foreground mb-4 flex items-center space-x-2">
              <Icon name="Package" size={16} />
              <span>Estado del Equipo</span>
            </h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-foreground mb-2">
                Condición del Equipo *
              </label>
              <select
                value={resignationData?.equipmentCondition}
                onChange={(e) => handleInputChange('equipmentCondition', e?.target?.value)}
                required
                className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground focus:ring-2 focus:ring-ring focus:border-transparent"
              >
                {conditionOptions?.map(option => (
                  <option key={option?.value} value={option?.value}>{option?.label}</option>
                ))}
              </select>
            </div>

            <div>
              <p className="text-sm font-medium text-foreground mb-3">Accesorios Devueltos</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {Object.entries(resignationData?.accessoriesReturned)?.map(([accessory, checked]) => (
                  <Checkbox
                    key={accessory}
                    label={accessory?.charAt(0)?.toUpperCase() + accessory?.slice(1)}
                    checked={checked}
                    onChange={(e) => handleAccessoryChange(accessory, e?.target?.checked)}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Handover Notes */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Notas de Entrega
            </label>
            <textarea
              value={resignationData?.handoverNotes}
              onChange={(e) => handleInputChange('handoverNotes', e?.target?.value)}
              placeholder="Observaciones sobre la entrega del equipo, estado general, recomendaciones..."
              rows={4}
              className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
            />
          </div>

          {/* Process Checklist */}
          <div>
            <h3 className="font-medium text-foreground mb-4 flex items-center space-x-2">
              <Icon name="CheckSquare" size={16} />
              <span>Lista de Verificación</span>
            </h3>
            
            <div className="space-y-3">
              <Checkbox
                label="RH ha sido notificado de la renuncia"
                checked={resignationData?.hrNotified}
                onChange={(e) => handleInputChange('hrNotified', e?.target?.checked)}
              />
              
              <Checkbox
                label="IT ha sido notificado para desactivar accesos"
                checked={resignationData?.itNotified}
                onChange={(e) => handleInputChange('itNotified', e?.target?.checked)}
              />
              
              <Checkbox
                label="Documentación de entrega generada"
                checked={resignationData?.documentationGenerated}
                onChange={(e) => handleInputChange('documentationGenerated', e?.target?.checked)}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-border">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" variant="default" iconName="UserMinus" iconPosition="left">
              Procesar Renuncia
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResignationProcessModal;