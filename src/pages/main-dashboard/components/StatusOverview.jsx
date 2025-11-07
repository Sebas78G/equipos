import React from 'react';
import Icon from '../../../components/AppIcon';

const StatusOverview = ({ statusData }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Asignados':
        return 'text-primary bg-primary/10 border-primary/20';
      case 'Disponible':
        return 'text-success bg-success/10 border-success/20';
      case 'Dañados':
        return 'text-error bg-error/10 border-error/20';
      default:
        return 'text-muted-foreground bg-muted/10 border-border';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Asignados':
        return 'UserCheck';
      case 'Disponible':
        return 'CheckCircle';
      case 'Dañados':
        return 'AlertTriangle';
      default:
        return 'Package';
    }
  };

  const totalEquipment = statusData?.reduce((sum, item) => sum + item?.count, 0);

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-card">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground mb-2">Resumen de Estados</h3>
        <p className="text-sm text-muted-foreground">Distribución actual del inventario</p>
      </div>
      <div className="space-y-4">
        {statusData?.map((status) => {
          const percentage = totalEquipment > 0 ? (status?.count / totalEquipment) * 100 : 0;
          
          return (
            <div key={status?.status} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${getStatusColor(status?.status)}`}>
                    <Icon name={getStatusIcon(status?.status)} size={16} />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{status?.status}</p>
                    <p className="text-xs text-muted-foreground">{status?.description}</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="text-lg font-bold text-foreground">{status?.count}</p>
                  <p className="text-xs text-muted-foreground">{percentage?.toFixed(1)}%</p>
                </div>
              </div>
              {/* Progress Bar */}
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    status?.status === 'Asignados' ? 'bg-primary' :
                    status?.status === 'Disponible' ? 'bg-success' :
                    status?.status === 'Dañados'? 'bg-error' : 'bg-muted-foreground'
                  }`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
      {/* Total Summary */}
      <div className="mt-6 pt-6 border-t border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center border border-accent/20">
              <Icon name="Package" size={20} className="text-accent" />
            </div>
            <div>
              <p className="font-semibold text-foreground">Total de Equipos</p>
              <p className="text-sm text-muted-foreground">Inventario completo</p>
            </div>
          </div>
          
          <div className="text-right">
            <p className="text-3xl font-bold text-foreground">{totalEquipment}</p>
            <p className="text-sm text-muted-foreground">equipos</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusOverview;