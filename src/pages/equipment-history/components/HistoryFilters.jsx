import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const HistoryFilters = ({ onFiltersChange, onExport }) => {
  const [filters, setFilters] = useState({
    serviceTag: '',
    employeeName: '',
    eventType: '',
    dateFrom: '',
    dateTo: '',
    department: ''
  });

  const [isExpanded, setIsExpanded] = useState(false);

  const eventTypeOptions = [
    { value: '', label: 'Todos los eventos' },
    { value: 'assignment', label: 'Asignaciones' },
    { value: 'unassignment', label: 'Desasignaciones' },
    { value: 'damage', label: 'Daños reportados' },
    { value: 'repair', label: 'Reparaciones' },
    { value: 'available', label: 'Disponibilidad' },
    { value: 'purchase', label: 'Compras' }
  ];

  const departmentOptions = [
    { value: '', label: 'Todas las áreas' },
    { value: 'sistemas', label: 'Sistemas' },
    { value: 'contabilidad', label: 'Contabilidad' },
    { value: 'ventas', label: 'Ventas' },
    { value: 'operaciones', label: 'Operaciones' },
    { value: 'recursos-humanos', label: 'Recursos Humanos' },
    { value: 'gerencia', label: 'Gerencia' }
  ];

  const handleFilterChange = (field, value) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    if (onFiltersChange) {
      onFiltersChange(newFilters);
    }
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      serviceTag: '',
      employeeName: '',
      eventType: '',
      dateFrom: '',
      dateTo: '',
      department: ''
    };
    setFilters(clearedFilters);
    if (onFiltersChange) {
      onFiltersChange(clearedFilters);
    }
  };

  const hasActiveFilters = Object.values(filters)?.some(value => value !== '');

  return (
    <div className="bg-card border border-border rounded-lg shadow-card p-4 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
        <div className="flex items-center space-x-3">
          <Icon name="Filter" size={20} className="text-muted-foreground" />
          <h3 className="font-semibold text-foreground">Filtros de Búsqueda</h3>
          {hasActiveFilters && (
            <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
              Filtros activos
            </span>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="lg:hidden"
          >
            <Icon name={isExpanded ? "ChevronUp" : "ChevronDown"} size={16} className="mr-1" />
            {isExpanded ? 'Ocultar filtros' : 'Mostrar filtros'}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={onExport}
          >
            <Icon name="Download" size={16} className="mr-1" />
            Exportar
          </Button>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearFilters}
            >
              <Icon name="X" size={16} className="mr-1" />
              Limpiar
            </Button>
          )}
        </div>
      </div>
      <div className={`space-y-4 ${isExpanded ? 'block' : 'hidden lg:block'}`}>
        {/* Primary Filters Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Input
            label="Service Tag"
            type="text"
            placeholder="Buscar por service tag..."
            value={filters?.serviceTag}
            onChange={(e) => handleFilterChange('serviceTag', e?.target?.value)}
          />

          <Input
            label="Nombre del Empleado"
            type="text"
            placeholder="Buscar por empleado..."
            value={filters?.employeeName}
            onChange={(e) => handleFilterChange('employeeName', e?.target?.value)}
          />

          <Select
            label="Tipo de Evento"
            options={eventTypeOptions}
            value={filters?.eventType}
            onChange={(value) => handleFilterChange('eventType', value)}
          />

          <Select
            label="Área/Departamento"
            options={departmentOptions}
            value={filters?.department}
            onChange={(value) => handleFilterChange('department', value)}
          />
        </div>

        {/* Date Range Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Fecha Desde"
            type="date"
            value={filters?.dateFrom}
            onChange={(e) => handleFilterChange('dateFrom', e?.target?.value)}
          />

          <Input
            label="Fecha Hasta"
            type="date"
            value={filters?.dateTo}
            onChange={(e) => handleFilterChange('dateTo', e?.target?.value)}
          />
        </div>

        {/* Quick Filter Buttons */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
          <span className="text-sm font-medium text-muted-foreground mr-2">Filtros rápidos:</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleFilterChange('eventType', 'assignment')}
            className="text-xs"
          >
            Solo Asignaciones
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleFilterChange('eventType', 'damage')}
            className="text-xs"
          >
            Solo Daños
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              const today = new Date();
              const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
              handleFilterChange('dateFrom', lastMonth?.toISOString()?.split('T')?.[0]);
              handleFilterChange('dateTo', today?.toISOString()?.split('T')?.[0]);
            }}
            className="text-xs"
          >
            Último Mes
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              const today = new Date();
              const lastYear = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
              handleFilterChange('dateFrom', lastYear?.toISOString()?.split('T')?.[0]);
              handleFilterChange('dateTo', today?.toISOString()?.split('T')?.[0]);
            }}
            className="text-xs"
          >
            Último Año
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HistoryFilters;