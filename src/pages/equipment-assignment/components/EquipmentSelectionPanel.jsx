import React, { useState } from 'react';
import Icon from 'components/AppIcon';
import Input from 'components/ui/Input';
import Select from 'components/ui/Select';
import Spinner from 'components/ui/Spinner';

const EquipmentSelectionPanel = ({ availableEquipment, selectedEquipment, onEquipmentSelect, error }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("todos");

  const handleEquipmentSelect = (equipment) => {
    onEquipmentSelect(equipment);
  };

  const equipmentTypes = [
    { value: 'todos', label: 'Todos los tipos' },
    ...Array.from(new Set(availableEquipment.map(eq => eq.tipo)))
          .map(type => ({ value: type, label: type }))
  ];

  const filteredEquipment = availableEquipment.filter((equipment) => {
    const searchTermLower = searchTerm.toLowerCase();
    const matchesSearch = 
      equipment.service_tag_cpu?.toLowerCase().includes(searchTermLower) ||
      equipment.referencia_cpu?.toLowerCase().includes(searchTermLower) ||
      equipment.marca_cpu?.toLowerCase().includes(searchTermLower);
    
    const matchesType = selectedType === "todos" || equipment.tipo === selectedType;
    
    return matchesSearch && matchesType;
  });

  const getTypeIcon = (type) => {
    switch (type) {
      case 'PC': return 'Monitor';
      case 'Portatil': return 'Laptop';
      case 'Tablet': return 'Tablet';
      default: return 'Package';
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case 'PC': return 'PC Escritorio';
      case 'Portatil': return 'Portátil';
      case 'Tablet': return 'Tablet';
      default: return 'Equipo';
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border shadow-card h-full">
      <div className="p-6 border-b border-border">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <Icon name="Package" size={20} className="text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Seleccionar Equipo</h2>
            <p className="text-sm text-muted-foreground">Equipos disponibles para asignación</p>
          </div>
        </div>
        <div className="space-y-4">
          <Input
            type="search"
            placeholder="Buscar por service tag, modelo o marca..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
          <Select
            label="Filtrar por tipo"
            options={equipmentTypes}
            value={selectedType}
            onChange={(value) => setSelectedType(value)}
          />
        </div>
      </div>
      <div className="p-6">
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {error ? (
            <div className="text-center py-8 text-error">
              <Icon name="AlertCircle" size={48} className="mx-auto mb-4" />
              <p>{error}</p>
            </div>
          ) : filteredEquipment.length === 0 ? (
            <div className="text-center py-8">
              <Icon name="Search" size={48} className="text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No se encontraron equipos disponibles</p>
            </div>
          ) : (
            filteredEquipment.map((equipment) => (
              <div
                key={equipment.id}
                className={`p-4 border rounded-lg cursor-pointer transition-smooth ${
                  selectedEquipment?.id === equipment.id
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50 hover:bg-muted/30'
                }`}
                onClick={() => handleEquipmentSelect(equipment)}
              >
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-muted rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center">
                    <Icon name={getTypeIcon(equipment.tipo)} size={32} className="text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Icon name={getTypeIcon(equipment.tipo)} size={16} className="text-primary" />
                        <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded">
                          {getTypeLabel(equipment.tipo)}
                        </span>
                      </div>
                      {selectedEquipment?.id === equipment.id && (
                        <Icon name="CheckCircle" size={16} className="text-success" />
                      )}
                    </div>
                    <h3 className="font-medium text-foreground mb-1 truncate">
                      {equipment.marca_cpu} {equipment.referencia_cpu}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      Service Tag: <span className="font-mono font-medium">{equipment.service_tag_cpu}</span>
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        {selectedEquipment && (
          <div className="mt-6 p-4 bg-success/10 border border-success/20 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="CheckCircle" size={16} className="text-success" />
              <span className="text-sm font-medium text-success">Equipo Seleccionado</span>
            </div>
            <p className="text-sm text-foreground">
              {selectedEquipment.marca_cpu} {selectedEquipment.referencia_cpu} - {selectedEquipment.service_tag_cpu}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EquipmentSelectionPanel;
