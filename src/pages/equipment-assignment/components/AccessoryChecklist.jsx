import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import { Checkbox } from '../../../components/ui/Checkbox';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

const AccessoryChecklist = ({ selectedAccessories, onAccessoriesChange }) => {
  const [customAccessory, setCustomAccessory] = useState("");

  const defaultAccessories = [
    {
      id: "mouse",
      name: "Mouse",
      description: "Mouse óptico o inalámbrico",
      icon: "Mouse",
      category: "perifericos"
    },
    {
      id: "teclado",
      name: "Teclado",
      description: "Teclado estándar o ergonómico",
      icon: "Keyboard",
      category: "perifericos"
    },
    {
      id: "monitor",
      name: "Monitor",
      description: "Monitor LCD/LED adicional",
      icon: "Monitor",
      category: "pantalla"
    },
    {
      id: "cable_poder",
      name: "Cable de Poder",
      description: "Cable de alimentación eléctrica",
      icon: "Zap",
      category: "cables"
    },
    {
      id: "cable_red",
      name: "Cable de Red",
      description: "Cable Ethernet RJ45",
      icon: "Cable",
      category: "cables"
    },
    {
      id: "cable_hdmi",
      name: "Cable HDMI",
      description: "Cable HDMI para conexión de video",
      icon: "Cable",
      category: "cables"
    },
    {
      id: "cable_usb",
      name: "Cable USB",
      description: "Cable USB tipo A/B/C",
      icon: "Usb",
      category: "cables"
    },
    {
      id: "adaptador",
      name: "Adaptador",
      description: "Adaptador de corriente o convertidor",
      icon: "Plug",
      category: "accesorios"
    },
    {
      id: "base_refrigeracion",
      name: "Base de Refrigeración",
      description: "Base con ventiladores para portátil",
      icon: "Fan",
      category: "accesorios"
    },
    {
      id: "maletin",
      name: "Maletín",
      description: "Maletín o funda protectora",
      icon: "Briefcase",
      category: "accesorios"
    },
    {
      id: "auriculares",
      name: "Auriculares",
      description: "Auriculares con micrófono",
      icon: "Headphones",
      category: "audio"
    },
    {
      id: "webcam",
      name: "Webcam",
      description: "Cámara web para videoconferencias",
      icon: "Camera",
      category: "audio"
    }
  ];

  const categories = [
    { id: "perifericos", name: "Periféricos", icon: "Mouse" },
    { id: "pantalla", name: "Pantalla", icon: "Monitor" },
    { id: "cables", name: "Cables", icon: "Cable" },
    { id: "accesorios", name: "Accesorios", icon: "Package" },
    { id: "audio", name: "Audio/Video", icon: "Headphones" }
  ];

  const handleAccessoryToggle = (accessoryId) => {
    const updatedAccessories = selectedAccessories?.includes(accessoryId)
      ? selectedAccessories?.filter(id => id !== accessoryId)
      : [...selectedAccessories, accessoryId];
    
    onAccessoriesChange(updatedAccessories);
  };

  const handleAddCustomAccessory = () => {
    if (customAccessory?.trim()) {
      const customId = `custom_${Date.now()}`;
      const newAccessory = {
        id: customId,
        name: customAccessory?.trim(),
        description: "Accesorio personalizado",
        icon: "Plus",
        category: "custom",
        isCustom: true
      };
      
      // Add to default accessories for this session
      defaultAccessories?.push(newAccessory);
      
      // Add to selected accessories
      const updatedAccessories = [...selectedAccessories, customId];
      onAccessoriesChange(updatedAccessories);
      
      setCustomAccessory("");
    }
  };

  const getAccessoriesByCategory = (categoryId) => {
    return defaultAccessories?.filter(acc => acc?.category === categoryId);
  };

  const getSelectedCount = () => {
    return selectedAccessories?.length;
  };

  return (
    <div className="bg-card rounded-lg border border-border shadow-card">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
              <Icon name="Package" size={20} className="text-warning" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Lista de Accesorios</h2>
              <p className="text-sm text-muted-foreground">
                Seleccione los accesorios incluidos con el equipo
              </p>
            </div>
          </div>
          
          <div className="text-right">
            <p className="text-2xl font-bold text-foreground">{getSelectedCount()}</p>
            <p className="text-xs text-muted-foreground">seleccionados</p>
          </div>
        </div>

        {/* Add Custom Accessory */}
        <div className="flex space-x-2">
          <Input
            type="text"
            placeholder="Agregar accesorio personalizado..."
            value={customAccessory}
            onChange={(e) => setCustomAccessory(e?.target?.value)}
            className="flex-1"
          />
          <Button
            variant="outline"
            onClick={handleAddCustomAccessory}
            disabled={!customAccessory?.trim()}
            iconName="Plus"
            iconPosition="left"
          >
            Agregar
          </Button>
        </div>
      </div>
      <div className="p-6">
        <div className="space-y-6">
          {categories?.map((category) => {
            const categoryAccessories = getAccessoriesByCategory(category?.id);
            
            if (categoryAccessories?.length === 0) return null;
            
            return (
              <div key={category?.id} className="space-y-3">
                <div className="flex items-center space-x-2 pb-2 border-b border-border">
                  <Icon name={category?.icon} size={16} className="text-primary" />
                  <h3 className="font-medium text-foreground">{category?.name}</h3>
                  <span className="text-xs text-muted-foreground">
                    ({categoryAccessories?.filter(acc => selectedAccessories?.includes(acc?.id))?.length}/{categoryAccessories?.length})
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {categoryAccessories?.map((accessory) => (
                    <div
                      key={accessory?.id}
                      className={`p-3 border rounded-lg transition-smooth ${
                        selectedAccessories?.includes(accessory?.id)
                          ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50'
                      }`}
                    >
                      <Checkbox
                        checked={selectedAccessories?.includes(accessory?.id)}
                        onChange={() => handleAccessoryToggle(accessory?.id)}
                        label={
                          <div className="flex items-start space-x-3 ml-2">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                              selectedAccessories?.includes(accessory?.id)
                                ? 'bg-primary/20' :'bg-muted'
                            }`}>
                              <Icon 
                                name={accessory?.icon} 
                                size={16} 
                                className={selectedAccessories?.includes(accessory?.id) ? 'text-primary' : 'text-muted-foreground'}
                              />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-foreground text-sm">
                                {accessory?.name}
                                {accessory?.isCustom && (
                                  <span className="ml-2 text-xs bg-accent/20 text-accent px-2 py-0.5 rounded">
                                    Personalizado
                                  </span>
                                )}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {accessory?.description}
                              </p>
                            </div>
                          </div>
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Summary */}
        {selectedAccessories?.length > 0 && (
          <div className="mt-6 p-4 bg-success/10 border border-success/20 rounded-lg">
            <div className="flex items-center space-x-2 mb-3">
              <Icon name="CheckCircle" size={16} className="text-success" />
              <span className="text-sm font-medium text-success">
                Accesorios Seleccionados ({selectedAccessories?.length})
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedAccessories?.map((accessoryId) => {
                const accessory = defaultAccessories?.find(acc => acc?.id === accessoryId);
                return accessory ? (
                  <span
                    key={accessoryId}
                    className="inline-flex items-center space-x-1 bg-success/20 text-success px-2 py-1 rounded text-xs"
                  >
                    <Icon name={accessory?.icon} size={12} />
                    <span>{accessory?.name}</span>
                  </span>
                ) : null;
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccessoryChecklist;