import React, { useState } from 'react';
import Icon from 'components/AppIcon';
import Button from 'components/ui/Button';
import Input from 'components/ui/Input';
import { useNavigate } from 'react-router-dom';

const EquipmentTable = ({ equipmentData, onEquipmentAction }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: 'lastUpdated', direction: 'desc' });
  const navigate = useNavigate();

  const handleViewDetails = (item) => {
    navigate(`/equipment-history?id=${item.id}`);
  };

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

  const filteredData = equipmentData
    ? equipmentData.filter(item => {
        if (!searchTerm) {
          return true; // Show all items if search term is empty
        }
        const term = searchTerm.toLowerCase();
        const serviceTag = item.serviceTag?.toLowerCase() || '';
        const employeeName = item.employeeName?.toLowerCase() || '';
        const type = item.type?.toLowerCase() || '';

        return serviceTag.includes(term) || employeeName.includes(term) || type.includes(term);
      })
    : [];

  const sortedData = [...(filteredData || [])].sort((a, b) => {
    if (sortConfig?.key) {
        const aValue = a?.[sortConfig.key] ?? '';
        const bValue = b?.[sortConfig.key] ?? '';
        
        if (sortConfig.key === 'lastUpdated') {
            const dateA = aValue ? new Date(aValue).getTime() : 0;
            const dateB = bValue ? new Date(bValue).getTime() : 0;
            return sortConfig.direction === 'asc' ? dateA - dateB : dateB - dateA;
        }

        if (sortConfig.direction === 'asc') {
            return aValue.localeCompare(bValue);
        } else {
            return bValue.localeCompare(aValue);
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

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (isNaN(date)) return 'Fecha inválida';

    return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-card">
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
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-6 py-3 text-left w-2/12">
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
              <th className="px-6 py-3 text-center w-2/12">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort('serviceTag')}
                  className="flex items-center space-x-1 font-medium text-muted-foreground hover:text-foreground w-full justify-center"
                >
                  <span>Service Tag</span>
                  <Icon name="ArrowUpDown" size={12} />
                </Button>
              </th>
              <th className="px-6 py-3 text-center w-2/12">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort('employeeName')}
                  className="flex items-center space-x-1 font-medium text-muted-foreground hover:text-foreground w-full justify-center"
                >
                  <span>Empleado</span>
                  <Icon name="ArrowUpDown" size={12} />
                </Button>
              </th>
              <th className="px-6 py-3 text-center w-2/12">
                <span className="font-medium text-muted-foreground">Estado</span>
              </th>
              <th className="px-6 py-3 text-center w-4/12">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort('lastUpdated')}
                  className="flex items-center space-x-1 font-medium text-muted-foreground hover:text-foreground w-full justify-center"
                >
                  <span>Última Actualización</span>
                  <Icon name="ArrowUpDown" size={12} />
                </Button>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {sortedData?.map((item) => (
              <tr key={`${item.id}-${item.serviceTag}`} className="hover:bg-muted transition-colors cursor-pointer" onClick={() => handleViewDetails(item)}>
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
                <td className="px-6 py-4 text-center">
                  <code className="px-2 py-1 bg-muted rounded text-sm font-mono">{item?.serviceTag}</code>
                </td>
                <td className="px-6 py-4 text-center">
                  <div>
                    <p className="font-medium text-foreground">{item?.employeeName || 'N/A'}</p>
                    <p className="text-xs text-muted-foreground">{item?.area}</p>
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  {getStatusBadge(item?.status)}
                </td>
                <td className="px-6 py-4 text-center">
                  <p className="text-sm text-foreground whitespace-nowrap">{formatDate(item?.lastUpdated)}</p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {sortedData?.length === 0 && (
        <div className="p-12 text-center">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="Search" size={24} className="text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">No se encontraron equipos</h3>
          <p className="text-muted-foreground">
            {searchTerm ? 'Intenta con otros términos de búsqueda' : 'No hay equipos registrados actualmente.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default EquipmentTable;
