import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const EquipmentSelectionPanel = ({ selectedEquipment, onEquipmentSelect }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("todos");

  const equipmentTypes = [
  { value: "todos", label: "Todos los Equipos" },
  { value: "pc", label: "PC Escritorio" },
  { value: "portatil", label: "Portátil" },
  { value: "tablet", label: "Tablet" }];


  const availableEquipment = [
  {
    id: "EQ001",
    serviceTag: "DELL-PC-001",
    type: "pc",
    brand: "Dell",
    model: "OptiPlex 7090",
    processor: "Intel Core i7-11700",
    ram: "16GB DDR4",
    storage: "512GB SSD",
    status: "disponible",
    location: "Almacén TI - Estante A3",
    image: "https://images.unsplash.com/photo-1500559972068-a79b130f4b88",
    imageAlt: "Desktop computer tower with monitor and keyboard on office desk"
  },
  {
    id: "EQ002",
    serviceTag: "HP-LAP-002",
    type: "portatil",
    brand: "HP",
    model: "EliteBook 840 G8",
    processor: "Intel Core i5-1135G7",
    ram: "8GB DDR4",
    storage: "256GB SSD",
    status: "disponible",
    location: "Almacén TI - Estante B1",
    image: "https://images.unsplash.com/photo-1703098215229-bd2addd90b1c",
    imageAlt: "Silver laptop computer open on wooden desk showing desktop screen"
  },
  {
    id: "EQ003",
    serviceTag: "LENOVO-PC-003",
    type: "pc",
    brand: "Lenovo",
    model: "ThinkCentre M720q",
    processor: "Intel Core i5-9400T",
    ram: "8GB DDR4",
    storage: "256GB SSD",
    status: "disponible",
    location: "Almacén TI - Estante A2",
    image: "https://images.unsplash.com/photo-1689236673605-e5d95a9c450c",
    imageAlt: "Compact desktop computer tower in black color on office surface"
  },
  {
    id: "EQ004",
    serviceTag: "SAMSUNG-TAB-004",
    type: "tablet",
    brand: "Samsung",
    model: "Galaxy Tab S7",
    processor: "Snapdragon 865+",
    ram: "6GB",
    storage: "128GB",
    status: "disponible",
    location: "Almacén TI - Estante C1",
    image: "https://images.unsplash.com/photo-1589070265406-1f9e9b5a141f",
    imageAlt: "Black tablet device displaying colorful interface on white background"
  },
  {
    id: "EQ005",
    serviceTag: "ASUS-LAP-005",
    type: "portatil",
    brand: "ASUS",
    model: "VivoBook 15",
    processor: "AMD Ryzen 5 5500U",
    ram: "8GB DDR4",
    storage: "512GB SSD",
    status: "disponible",
    location: "Almacén TI - Estante B2",
    image: "https://images.unsplash.com/photo-1639283758775-e7f0616aa156",
    imageAlt: "Modern laptop computer with silver finish open displaying desktop interface"
  }];


  const filteredEquipment = availableEquipment?.filter((equipment) => {
    const matchesSearch = equipment?.serviceTag?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
    equipment?.model?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
    equipment?.brand?.toLowerCase()?.includes(searchTerm?.toLowerCase());
    const matchesType = selectedType === "todos" || equipment?.type === selectedType;
    return matchesSearch && matchesType;
  });

  const getTypeIcon = (type) => {
    switch (type) {
      case 'pc':return 'Monitor';
      case 'portatil':return 'Laptop';
      case 'tablet':return 'Tablet';
      default:return 'Package';
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case 'pc':return 'PC Escritorio';
      case 'portatil':return 'Portátil';
      case 'tablet':return 'Tablet';
      default:return 'Equipo';
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
            onChange={(e) => setSearchTerm(e?.target?.value)}
            className="w-full" />


          <Select
            label="Filtrar por tipo"
            options={equipmentTypes}
            value={selectedType}
            onChange={setSelectedType} />

        </div>
      </div>
      <div className="p-6">
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {filteredEquipment?.length === 0 ?
          <div className="text-center py-8">
              <Icon name="Search" size={48} className="text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No se encontraron equipos disponibles</p>
            </div> :

          filteredEquipment?.map((equipment) =>
          <div
            key={equipment?.id}
            className={`p-4 border rounded-lg cursor-pointer transition-smooth ${
            selectedEquipment?.id === equipment?.id ?
            'border-primary bg-primary/5' : 'border-border hover:border-primary/50 hover:bg-muted/30'}`
            }
            onClick={() => onEquipmentSelect(equipment)}>

                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                    <img
                  src={equipment?.image}
                  alt={equipment?.imageAlt}
                  className="w-full h-full object-cover" />

                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Icon name={getTypeIcon(equipment?.type)} size={16} className="text-primary" />
                        <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded">
                          {getTypeLabel(equipment?.type)}
                        </span>
                      </div>
                      {selectedEquipment?.id === equipment?.id &&
                  <Icon name="CheckCircle" size={16} className="text-success" />
                  }
                    </div>
                    
                    <h3 className="font-medium text-foreground mb-1">
                      {equipment?.brand} {equipment?.model}
                    </h3>
                    
                    <p className="text-sm text-muted-foreground mb-2">
                      Service Tag: <span className="font-mono font-medium">{equipment?.serviceTag}</span>
                    </p>
                    
                    <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                      <div>
                        <span className="font-medium">Procesador:</span>
                        <br />
                        {equipment?.processor}
                      </div>
                      <div>
                        <span className="font-medium">RAM:</span> {equipment?.ram}
                        <br />
                        <span className="font-medium">Almacenamiento:</span> {equipment?.storage}
                      </div>
                    </div>
                    
                    <div className="mt-2 flex items-center space-x-2">
                      <Icon name="MapPin" size={12} className="text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{equipment?.location}</span>
                    </div>
                  </div>
                </div>
              </div>
          )
          }
        </div>

        {selectedEquipment &&
        <div className="mt-6 p-4 bg-success/10 border border-success/20 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="CheckCircle" size={16} className="text-success" />
              <span className="text-sm font-medium text-success">Equipo Seleccionado</span>
            </div>
            <p className="text-sm text-foreground">
              {selectedEquipment?.brand} {selectedEquipment?.model} - {selectedEquipment?.serviceTag}
            </p>
          </div>
        }
      </div>
    </div>);

};

export default EquipmentSelectionPanel;