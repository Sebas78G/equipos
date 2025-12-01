import React from 'react';
import EquipmentCard from './EquipmentCard';
import Icon from '../../../components/AppIcon';


const EquipmentList = ({ 
  equipments, 
  activeTab, 
  onReportDamage, 
  onProcessResignation,
  searchTerm = '' 
}) => {
  const filteredEquipments = equipments?.filter(equipment => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm?.toLowerCase();
    return (
      equipment?.serviceTag?.toLowerCase()?.includes(searchLower) ||
      equipment?.assignedEmployee?.name?.toLowerCase()?.includes(searchLower) ||
      equipment?.brand?.toLowerCase()?.includes(searchLower) ||
      equipment?.model?.toLowerCase()?.includes(searchLower) ||
      equipment?.sucursal?.toLowerCase()?.includes(searchLower) ||
      equipment?.implant?.toLowerCase()?.includes(searchLower)
    );
  });

  if (filteredEquipments?.length === 0) {
    return (
      <div className="bg-card border border-border rounded-lg p-8 text-center shadow-card">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon name="Search" size={24} className="text-muted-foreground" />
        </div>
        <h3 className="font-medium text-foreground mb-2">No se encontraron equipos</h3>
        <p className="text-sm text-muted-foreground">
          {searchTerm 
            ? `No hay equipos que coincidan con "${searchTerm}"`
            : 'No hay equipos asignados disponibles para gestionar cambios'
          }
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Mostrando {filteredEquipments?.length} de {equipments?.length} equipos
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredEquipments?.map((equipment) => (
          <EquipmentCard
            key={equipment?.id}
            equipment={equipment}
            activeTab={activeTab}
            onReportDamage={onReportDamage}
            onProcessResignation={onProcessResignation}
          />
        ))}
      </div>
    </div>
  );
};

export default EquipmentList;