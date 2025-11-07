import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';

const DamageReportModal = ({ equipment, isOpen, onClose, onSubmit }) => {
  const [damageReport, setDamageReport] = useState({
    damageType: '',
    description: '',
    reportedBy: 'Admin',
    reportDate: new Date()?.toISOString()?.split('T')?.[0],
    severity: 'medium',
    requiresReplacement: false,
    estimatedRepairCost: '',
    additionalNotes: ''
  });

  const damageTypes = [
    { value: 'hardware', label: 'Falla de Hardware' },
    { value: 'screen', label: 'Pantalla Dañada' },
    { value: 'keyboard', label: 'Teclado Defectuoso' },
    { value: 'battery', label: 'Batería Agotada' },
    { value: 'software', label: 'Problema de Software' },
    { value: 'physical', label: 'Daño Físico' },
    { value: 'other', label: 'Otro' }
  ];

  const severityLevels = [
    { value: 'low', label: 'Bajo - Funcional con limitaciones' },
    { value: 'medium', label: 'Medio - Requiere reparación pronto' },
    { value: 'high', label: 'Alto - No funcional' }
  ];

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (onSubmit) {
      onSubmit({
        ...damageReport,
        equipmentId: equipment?.id,
        serviceTag: equipment?.serviceTag
      });
    }
    onClose();
  };

  const handleInputChange = (field, value) => {
    setDamageReport(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-popover border border-border rounded-lg shadow-modal w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-error/10 rounded-lg flex items-center justify-center">
              <Icon name="AlertTriangle" size={20} className="text-error" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Reportar Daño de Equipo</h2>
              <p className="text-sm text-muted-foreground">
                {equipment?.brand} {equipment?.model} - {equipment?.serviceTag}
              </p>
            </div>
          </div>
          
          <Button variant="ghost" onClick={onClose} iconName="X" size="sm" />
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Tipo de Daño *
              </label>
              <select
                value={damageReport?.damageType}
                onChange={(e) => handleInputChange('damageType', e?.target?.value)}
                required
                className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground focus:ring-2 focus:ring-ring focus:border-transparent"
              >
                <option value="">Seleccionar tipo de daño</option>
                {damageTypes?.map(type => (
                  <option key={type?.value} value={type?.value}>{type?.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Nivel de Severidad *
              </label>
              <select
                value={damageReport?.severity}
                onChange={(e) => handleInputChange('severity', e?.target?.value)}
                required
                className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground focus:ring-2 focus:ring-ring focus:border-transparent"
              >
                {severityLevels?.map(level => (
                  <option key={level?.value} value={level?.value}>{level?.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <Input
              label="Descripción del Daño *"
              type="text"
              placeholder="Describa detalladamente el problema encontrado..."
              value={damageReport?.description}
              onChange={(e) => handleInputChange('description', e?.target?.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Reportado Por"
              type="text"
              value={damageReport?.reportedBy}
              onChange={(e) => handleInputChange('reportedBy', e?.target?.value)}
              disabled
            />

            <Input
              label="Fecha de Reporte"
              type="date"
              value={damageReport?.reportDate}
              onChange={(e) => handleInputChange('reportDate', e?.target?.value)}
            />
          </div>

          <div>
            <Input
              label="Costo Estimado de Reparación (COP)"
              type="number"
              placeholder="0"
              value={damageReport?.estimatedRepairCost}
              onChange={(e) => handleInputChange('estimatedRepairCost', e?.target?.value)}
            />
          </div>

          <div>
            <Checkbox
              label="¿Requiere reemplazo inmediato?"
              description="Marque si el equipo no puede ser reparado y necesita reemplazo"
              checked={damageReport?.requiresReplacement}
              onChange={(e) => handleInputChange('requiresReplacement', e?.target?.checked)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Notas Adicionales
            </label>
            <textarea
              value={damageReport?.additionalNotes}
              onChange={(e) => handleInputChange('additionalNotes', e?.target?.value)}
              placeholder="Información adicional sobre el daño o recomendaciones..."
              rows={4}
              className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-border">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" variant="destructive" iconName="AlertTriangle" iconPosition="left">
              Reportar Daño
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DamageReportModal;