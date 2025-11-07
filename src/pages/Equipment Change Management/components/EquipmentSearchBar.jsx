import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

const EquipmentSearchBar = ({ onSearch, placeholder = "Buscar por service tag o nombre del empleado..." }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = () => {
    if (onSearch) {
      onSearch(searchTerm);
    }
  };

  const handleClear = () => {
    setSearchTerm('');
    if (onSearch) {
      onSearch('');
    }
  };

  const handleKeyPress = (e) => {
    if (e?.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 shadow-card">
      <div className="flex items-center space-x-3">
        <div className="flex-1">
          <Input
            type="text"
            placeholder={placeholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e?.target?.value)}
            onKeyPress={handleKeyPress}
            className="w-full"
          />
        </div>
        
        <Button
          variant="default"
          onClick={handleSearch}
          iconName="Search"
          iconPosition="left"
          className="px-6"
        >
          Buscar
        </Button>
        
        {searchTerm && (
          <Button
            variant="outline"
            onClick={handleClear}
            iconName="X"
            size="default"
          >
            Limpiar
          </Button>
        )}
      </div>
      <div className="mt-3 flex items-center space-x-4 text-sm text-muted-foreground">
        <div className="flex items-center space-x-2">
          <Icon name="Info" size={14} />
          <span>Busque por service tag (ej: ST001234) o nombre del empleado</span>
        </div>
      </div>
    </div>
  );
};

export default EquipmentSearchBar;