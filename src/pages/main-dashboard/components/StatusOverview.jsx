import React from 'react';
import Icon from 'components/AppIcon';

const StatusOverview = ({ statusData }) => {
  const getStatusColor = (type) => {
    switch (type) {
      case 'Disponible':
        return 'text-success bg-success/10 border-success/20';
      default:
        return 'text-muted-foreground bg-muted/10 border-border';
    }
  };

  const totalEquipment = statusData?.reduce((sum, item) => sum + Number(item?.count || 0), 0);

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-card">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground mb-2">Resumen de Estados</h3>
        <p className="text-sm text-muted-foreground">Distribución actual del inventario</p>
      </div>
      <div className="space-y-4">
        {statusData?.map((status, index) => {
          const percentage = totalEquipment > 0 ? (Number(status?.count) / totalEquipment) * 100 : 0;

          return (
            <div key={`${status?.status}-${index}`} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${getStatusColor(status?.type)}`}>
                    <Icon name={status.icon} size={16} />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{status?.status}</p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-lg font-bold text-foreground">{Number(status?.count) || 0}</p>
                  <p className="text-xs text-muted-foreground">
                    {Number.isFinite(percentage) ? percentage.toFixed(1) : 0}%
                  </p>
                </div>
              </div>
              {/* Progress bar */}
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 bg-success`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StatusOverview;
