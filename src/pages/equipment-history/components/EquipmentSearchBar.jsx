import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const EquipmentSearchBar = ({ onSearch, onEquipmentSelect, recentSearches = [] }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const mockEquipmentSuggestions = [
    { serviceTag: 'ST001234', type: 'PC', brand: 'Dell', model: 'OptiPlex 7090' },
    { serviceTag: 'ST001235', type: 'Portátil', brand: 'HP', model: 'EliteBook 840' },
    { serviceTag: 'ST001236', type: 'Tablet', brand: 'Samsung', model: 'Galaxy Tab S8' },
    { serviceTag: 'ST001237', type: 'PC', brand: 'Lenovo', model: 'ThinkCentre M720' },
    { serviceTag: 'ST001238', type: 'Portátil', brand: 'Dell', model: 'Latitude 5520' }
  ];

  const handleSearch = (query = searchQuery) => {
    if (query?.trim()) {
      if (onSearch) {
        onSearch(query?.trim());
      }
      setShowSuggestions(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e?.target?.value;
    setSearchQuery(value);
    setShowSuggestions(value?.length > 0);
  };

  const handleSuggestionClick = (equipment) => {
    setSearchQuery(equipment?.serviceTag);
    setShowSuggestions(false);
    if (onEquipmentSelect) {
      onEquipmentSelect(equipment);
    }
  };

  const handleKeyPress = (e) => {
    if (e?.key === 'Enter') {
      handleSearch();
    }
    if (e?.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const filteredSuggestions = mockEquipmentSuggestions?.filter(equipment =>
    equipment?.serviceTag?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
    equipment?.brand?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
    equipment?.model?.toLowerCase()?.includes(searchQuery?.toLowerCase())
  );

  return (
    <div className="relative mb-6">
      <div className="bg-card border border-border rounded-lg shadow-card p-4">
        <div className="flex items-center space-x-3 mb-4">
          <Icon name="Search" size={20} className="text-muted-foreground" />
          <h3 className="font-semibold text-foreground">Buscar Equipo</h3>
        </div>

        <div className="relative">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Input
                type="text"
                placeholder="Ingrese service tag, marca o modelo del equipo..."
                value={searchQuery}
                onChange={handleInputChange}
                onKeyDown={handleKeyPress}
                onFocus={() => setShowSuggestions(searchQuery?.length > 0)}
                className="pr-10"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <Icon name="Search" size={16} className="text-muted-foreground" />
              </div>
            </div>
            
            <Button
              variant="default"
              onClick={() => handleSearch()}
              disabled={!searchQuery?.trim()}
            >
              <Icon name="Search" size={16} className="mr-2" />
              Buscar
            </Button>
          </div>

          {/* Search Suggestions Dropdown */}
          {showSuggestions && filteredSuggestions?.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-lg shadow-modal z-50 max-h-64 overflow-y-auto">
              <div className="p-2">
                <p className="text-xs font-medium text-muted-foreground mb-2 px-2">Equipos encontrados</p>
                {filteredSuggestions?.map((equipment, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(equipment)}
                    className="w-full text-left px-3 py-2 hover:bg-muted/50 rounded-md transition-smooth"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-foreground text-sm">{equipment?.serviceTag}</p>
                        <p className="text-xs text-muted-foreground">
                          {equipment?.brand} {equipment?.model} - {equipment?.type}
                        </p>
                      </div>
                      <Icon name="ArrowRight" size={14} className="text-muted-foreground" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Recent Searches */}
        {recentSearches?.length > 0 && !showSuggestions && (
          <div className="mt-4 pt-4 border-t border-border">
            <p className="text-xs font-medium text-muted-foreground mb-2">Búsquedas recientes</p>
            <div className="flex flex-wrap gap-2">
              {recentSearches?.slice(0, 5)?.map((search, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchQuery(search);
                    handleSearch(search);
                  }}
                  className="text-xs"
                >
                  <Icon name="Clock" size={12} className="mr-1" />
                  {search}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-4 pt-4 border-t border-border">
          <p className="text-xs font-medium text-muted-foreground mb-2">Acciones rápidas</p>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSearch('PC')}
              className="text-xs"
            >
              <Icon name="Monitor" size={12} className="mr-1" />
              Ver todas las PC
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSearch('Portátil')}
              className="text-xs"
            >
              <Icon name="Laptop" size={12} className="mr-1" />
              Ver portátiles
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSearch('Tablet')}
              className="text-xs"
            >
              <Icon name="Tablet" size={12} className="mr-1" />
              Ver tablets
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EquipmentSearchBar;