import React from 'react';
import Icon from '../../../components/AppIcon';
import { Checkbox } from '../../../components/ui/Checkbox';

const AccessoryChecklist = ({ selectedAccessories, onAccessoriesChange, allAccessories }) => {

  const handleAccessoryToggle = (accessoryId) => {
    const updatedAccessories = selectedAccessories.includes(accessoryId)
      ? selectedAccessories.filter(id => id !== accessoryId)
      : [...selectedAccessories, accessoryId];
    onAccessoriesChange(updatedAccessories);
  };

  const renderAccessoryGroup = (title, accessories) => (
    <div className="space-y-3">
      <h3 className="font-medium text-foreground text-lg">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {accessories.map((accessory) => (
          <div
            key={accessory.id}
            className={`p-3 border rounded-lg transition-smooth ${
              selectedAccessories.includes(accessory.id)
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary/50'
            }`}
          >
            <Checkbox
              checked={selectedAccessories.includes(accessory.id)}
              onChange={() => handleAccessoryToggle(accessory.id)}
              label={
                <div className="flex items-center space-x-3 ml-2">
                  <Icon name={accessory.icon} size={16} />
                  <span className="font-medium text-foreground text-sm">{accessory.name}</span>
                </div>
              }
            />
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="bg-card rounded-lg border border-border shadow-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">Accesorios y Elementos Adicionales</h2>
      </div>
      <div className="space-y-6">
        {renderAccessoryGroup('Accesorios', allAccessories.filter(a => a.type === 'Accesorio'))}
        {renderAccessoryGroup('Elementos adicionales', allAccessories.filter(a => a.type === 'Elemento adicional'))}
      </div>
    </div>
  );
};

export default AccessoryChecklist;
