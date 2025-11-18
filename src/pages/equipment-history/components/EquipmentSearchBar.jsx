import React, { useState, useRef, useEffect } from 'react';
import Icon from 'components/AppIcon';
import Button from 'components/ui/Button';
import Input from 'components/ui/Input';

const EquipmentSearchBar = ({ onSearch, onEquipmentSelect, recentSearches }) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);

  // Mock suggestions based on query
  const getAutocompleteSuggestions = (q) => {
    if (!q) return [];
    const suggestions = [
      { id: 'ST001234', type: 'PC', serviceTag: 'ST001234' },
      { id: 'ST005678', type: 'Portátil', serviceTag: 'ST005678' },
      { id: 'ST009012', type: 'Tablet', serviceTag: 'ST009012' },
    ];
    return suggestions.filter(s => s.serviceTag.toLowerCase().includes(q.toLowerCase()));
  };

  const autocompleteSuggestions = getAutocompleteSuggestions(query);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      setShowSuggestions(false);
      searchRef.current.blur();
    }
  };

  const handleSelectSuggestion = (equipment) => {
    setQuery(equipment.serviceTag);
    onEquipmentSelect(equipment);
    setShowSuggestions(false);
  };

  const handleFocus = () => {
    setIsFocused(true);
    setShowSuggestions(true);
  };

  const handleBlur = () => {
    // Delay hiding suggestions to allow click events to register
    setTimeout(() => {
      if (searchRef.current && !searchRef.current.contains(document.activeElement)) {
        setIsFocused(false);
        setShowSuggestions(false);
      }
    }, 200);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="bg-card border border-border rounded-lg shadow-card p-4 mb-6" ref={searchRef}>
      <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Icon name="Search" size={16} className="text-muted-foreground" />
          </div>
          <Input
            type="search"
            placeholder="Ingrese service tag, marca o modelo del equipo..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className="pl-10 w-full"
          />
          {isFocused && query && (
            <div className="absolute z-10 w-full mt-1 bg-card border border-border rounded-lg shadow-lg">
              <div className="p-2">
                <p className="text-xs font-semibold text-muted-foreground px-2 py-1">Sugerencias</p>
                {autocompleteSuggestions.length > 0 ? (
                  <ul>
                    {autocompleteSuggestions.map(item => (
                      <li key={item.id}>
                        <button
                          type="button"
                          onClick={() => handleSelectSuggestion(item)}
                          className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-muted"
                        >
                          {item.serviceTag} <span className="text-muted-foreground">({item.type})</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground px-3 py-2">No se encontraron sugerencias.</p>
                )}
              </div>
            </div>
          )}
        </div>
        <Button type="submit" className="w-full sm:w-auto">
          <Icon name="Search" size={16} className="mr-2 sm:hidden" />
          Buscar
        </Button>
      </form>
    </div>
  );
};

export default EquipmentSearchBar;