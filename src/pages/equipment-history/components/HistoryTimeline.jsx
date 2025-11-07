import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const HistoryTimeline = ({ historyEntries }) => {
  const [expandedEntries, setExpandedEntries] = useState(new Set());

  const toggleExpanded = (entryId) => {
    const newExpanded = new Set(expandedEntries);
    if (newExpanded?.has(entryId)) {
      newExpanded?.delete(entryId);
    } else {
      newExpanded?.add(entryId);
    }
    setExpandedEntries(newExpanded);
  };

  const getEventIcon = (eventType) => {
    switch (eventType) {
      case 'assignment':
        return { icon: 'UserPlus', color: 'text-primary' };
      case 'unassignment':
        return { icon: 'UserMinus', color: 'text-warning' };
      case 'damage':
        return { icon: 'AlertTriangle', color: 'text-error' };
      case 'repair':
        return { icon: 'Wrench', color: 'text-success' };
      case 'available':
        return { icon: 'CheckCircle', color: 'text-success' };
      case 'purchase':
        return { icon: 'ShoppingCart', color: 'text-accent' };
      default:
        return { icon: 'Clock', color: 'text-muted-foreground' };
    }
  };

  const getEventBgColor = (eventType) => {
    switch (eventType) {
      case 'assignment':
        return 'bg-primary/10';
      case 'unassignment':
        return 'bg-warning/10';
      case 'damage':
        return 'bg-error/10';
      case 'repair':
        return 'bg-success/10';
      case 'available':
        return 'bg-success/10';
      case 'purchase':
        return 'bg-accent/10';
      default:
        return 'bg-muted/50';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground flex items-center">
          <Icon name="History" size={20} className="mr-2" />
          Historial de Eventos
        </h3>
        <div className="text-sm text-muted-foreground">
          {historyEntries?.length} eventos registrados
        </div>
      </div>
      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border"></div>

        <div className="space-y-6">
          {historyEntries?.map((entry, index) => {
            const eventStyle = getEventIcon(entry?.eventType);
            const isExpanded = expandedEntries?.has(entry?.id);
            const isLast = index === historyEntries?.length - 1;

            return (
              <div key={entry?.id} className="relative flex items-start space-x-4">
                {/* Timeline Dot */}
                <div className={`relative z-10 w-12 h-12 rounded-full ${getEventBgColor(entry?.eventType)} flex items-center justify-center border-2 border-card shadow-sm`}>
                  <Icon name={eventStyle?.icon} size={16} className={eventStyle?.color} />
                </div>
                {/* Event Content */}
                <div className="flex-1 min-w-0">
                  <div className={`${getEventBgColor(entry?.eventType)} rounded-lg p-4 border border-border/50`}>
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                      <div>
                        <h4 className="font-semibold text-foreground">{entry?.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{entry?.description}</p>
                      </div>
                      <div className="flex flex-col sm:items-end space-y-1">
                        <span className="text-xs font-medium text-muted-foreground">
                          {entry?.date} - {entry?.time}
                        </span>
                        {entry?.administrator && (
                          <span className="text-xs text-muted-foreground">
                            Por: {entry?.administrator}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Employee Information */}
                    {entry?.employee && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-3 p-3 bg-card/50 rounded-md">
                        <div>
                          <p className="text-xs font-medium text-muted-foreground">Empleado</p>
                          <p className="text-sm font-medium text-foreground">{entry?.employee?.name}</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-muted-foreground">Área</p>
                          <p className="text-sm font-medium text-foreground">{entry?.employee?.department}</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-muted-foreground">Cédula</p>
                          <p className="text-sm font-medium text-foreground">{entry?.employee?.cedula}</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-muted-foreground">Correo</p>
                          <p className="text-sm font-medium text-foreground">{entry?.employee?.email}</p>
                        </div>
                      </div>
                    )}

                    {/* Additional Details */}
                    {entry?.details && (
                      <div className="mb-3">
                        <p className="text-sm text-foreground">{entry?.details}</p>
                      </div>
                    )}

                    {/* Documents and Actions */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div className="flex flex-wrap gap-2">
                        {entry?.documents && entry?.documents?.map((doc, docIndex) => (
                          <Button
                            key={docIndex}
                            variant="outline"
                            size="sm"
                            className="text-xs"
                          >
                            <Icon name="FileText" size={14} className="mr-1" />
                            {doc?.name}
                          </Button>
                        ))}
                      </div>

                      {entry?.hasAdditionalInfo && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleExpanded(entry?.id)}
                          className="text-xs"
                        >
                          {isExpanded ? 'Ocultar detalles' : 'Ver más detalles'}
                          <Icon 
                            name={isExpanded ? "ChevronUp" : "ChevronDown"} 
                            size={14} 
                            className="ml-1" 
                          />
                        </Button>
                      )}
                    </div>

                    {/* Expanded Details */}
                    {isExpanded && entry?.additionalInfo && (
                      <div className="mt-4 pt-4 border-t border-border/50">
                        <div className="space-y-3">
                          {entry?.additionalInfo?.accessories && (
                            <div>
                              <p className="text-xs font-medium text-muted-foreground mb-2">Accesorios Entregados</p>
                              <div className="flex flex-wrap gap-2">
                                {entry?.additionalInfo?.accessories?.map((accessory, accIndex) => (
                                  <span 
                                    key={accIndex}
                                    className="px-2 py-1 bg-muted rounded text-xs text-foreground"
                                  >
                                    {accessory}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {entry?.additionalInfo?.notes && (
                            <div>
                              <p className="text-xs font-medium text-muted-foreground mb-1">Notas Adicionales</p>
                              <p className="text-sm text-foreground bg-card/50 p-2 rounded">
                                {entry?.additionalInfo?.notes}
                              </p>
                            </div>
                          )}

                          {entry?.additionalInfo?.reason && (
                            <div>
                              <p className="text-xs font-medium text-muted-foreground mb-1">Motivo</p>
                              <p className="text-sm text-foreground bg-card/50 p-2 rounded">
                                {entry?.additionalInfo?.reason}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default HistoryTimeline;