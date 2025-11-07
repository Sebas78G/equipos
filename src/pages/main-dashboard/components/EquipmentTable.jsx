import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const EquipmentTable = ({ equipmentData, onEquipmentAction }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: 'lastUpdated', direction: 'desc' });

  const getStatusBadge = (status) => {
    const statusConfig = {
      'Asignado': { color: 'bg-primary text-primary-foreground', icon: 'UserCheck' },
      'Disponible': { color: 'bg-success text-success-foreground', icon: 'CheckCircle' },
      'Dañado': { color: 'bg-error text-error-foreground', icon: 'AlertTriangle' }
    };
    
    const config = statusConfig?.[status] || statusConfig?.['Disponible'];
    
    return (
      <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${config?.color}`}>
        <Icon name={config?.icon} size={12} />
        <span>{status}</span>
      </span>
    );
  };

  const getEquipmentIcon = (type) => {
    const icons = {
      'PC': 'Monitor',
      'Portátil': 'Laptop',
      'Tablet': 'Tablet'
    };
    return icons?.[type] || 'Monitor';
  };

  const filteredData = equipmentData?.filter(item =>
    item?.serviceTag?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
    item?.employeeName?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
    item?.type?.toLowerCase()?.includes(searchTerm?.toLowerCase())
  );

  const sortedData = [...filteredData]?.sort((a, b) => {
    if (sortConfig?.key) {
      const aValue = a?.[sortConfig?.key];
      const bValue = b?.[sortConfig?.key];
      
      if (sortConfig?.direction === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    }
    return 0;
  });

  const handleSort = (key) => {
    setSortConfig({
      key,
      direction: sortConfig?.key === key && sortConfig?.direction === 'asc' ? 'desc' : 'asc'
    });
  };

  const formatDate = (date) => {
    return new Date(date)?.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-card">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Actividad Reciente de Equipos</h3>
            <p className="text-sm text-muted-foreground">Últimas asignaciones y cambios de estado</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Input
                type="search"
                placeholder="Buscar por service tag, empleado..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e?.target?.value)}
                className="pl-10 w-64"
              />
              <Icon 
                name="Search" 
                size={16} 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
              />
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEquipmentAction && onEquipmentAction('refresh')}
            >
              <Icon name="RefreshCw" size={16} />
            </Button>
          </div>
        </div>
      </div>
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-6 py-3 text-left">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort('type')}
                  className="flex items-center space-x-1 font-medium text-muted-foreground hover:text-foreground"
                >
                  <span>Equipo</span>
                  <Icon name="ArrowUpDown" size={12} />
                </Button>
              </th>
              <th className="px-6 py-3 text-left">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort('serviceTag')}
                  className="flex items-center space-x-1 font-medium text-muted-foreground hover:text-foreground"
                >
                  <span>Service Tag</span>
                  <Icon name="ArrowUpDown" size={12} />
                </Button>
              </th>
              <th className="px-6 py-3 text-left">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort('employeeName')}
                  className="flex items-center space-x-1 font-medium text-muted-foreground hover:text-foreground"
                >
                  <span>Empleado</span>
                  <Icon name="ArrowUpDown" size={12} />
                </Button>
              </th>
              <th className="px-6 py-3 text-left">
                <span className="font-medium text-muted-foreground">Estado</span>
              </th>
              <th className="px-6 py-3 text-left">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort('lastUpdated')}
                  className="flex items-center space-x-1 font-medium text-muted-foreground hover:text-foreground"
                >
                  <span>Última Actualización</span>
                  <Icon name="ArrowUpDown" size={12} />
                </Button>
              </th>
              <th className="px-6 py-3 text-right">
                <span className="font-medium text-muted-foreground">Acciones</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {sortedData?.map((item) => (
              <tr key={item?.id} className="hover:bg-muted/30 transition-smooth">
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center">
                      <Icon name={getEquipmentIcon(item?.type)} size={16} className="text-accent" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{item?.type}</p>
                      <p className="text-xs text-muted-foreground">{item?.brand} {item?.model}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <code className="px-2 py-1 bg-muted rounded text-sm font-mono">{item?.serviceTag}</code>
                </td>
                <td className="px-6 py-4">
                  <div>
                    <p className="font-medium text-foreground">{item?.employeeName}</p>
                    <p className="text-xs text-muted-foreground">{item?.area}</p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  {getStatusBadge(item?.status)}
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm text-foreground">{formatDate(item?.lastUpdated)}</p>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEquipmentAction && onEquipmentAction('view', item)}
                      title="Ver detalles"
                    >
                      <Icon name="Eye" size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEquipmentAction && onEquipmentAction('edit', item)}
                      title="Editar"
                    >
                      <Icon name="Edit" size={16} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Empty State */}
      {sortedData?.length === 0 && (
        <div className="p-12 text-center">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="Search" size={24} className="text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">No se encontraron equipos</h3>
          <p className="text-muted-foreground">
            {searchTerm ? 'Intenta con otros términos de búsqueda' : 'No hay equipos registrados'}
          </p>
        </div>
      )}
    </div>
  );
};

export default EquipmentTable;