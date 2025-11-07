import React from 'react';
import Icon from 'components/AppIcon';
import Button from 'components/ui/Button';

const MetricsCard = ({ 
  title, 
  count, 
  icon, 
  color = 'primary', 
  trend = null, 
  onClick,
  description 
}) => {
  const getColorClasses = () => {
    switch (color) {
      case 'success':
        return 'bg-success/10 text-success border-success/20';
      case 'warning':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'error':
        return 'bg-error/10 text-error border-error/20';
      case 'accent':
        return 'bg-accent/10 text-accent border-accent/20';
      default:
        return 'bg-primary/10 text-primary border-primary/20';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-card hover:shadow-modal transition-smooth">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getColorClasses()}`}>
          <Icon name={icon} size={24} />
        </div>
        {onClick && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClick}
            className="opacity-60 hover:opacity-100"
          >
            <Icon name="ArrowRight" size={16} />
          </Button>
        )}
      </div>
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <div className="flex items-baseline space-x-2">
          <p className="text-3xl font-bold text-foreground">{count}</p>
          {trend && (
            <div className={`flex items-center space-x-1 text-xs ${
              trend?.type === 'up' ? 'text-success' : 
              trend?.type === 'down'? 'text-error' : 'text-muted-foreground'
            }`}>
              <Icon 
                name={trend?.type === 'up' ? 'TrendingUp' : trend?.type === 'down' ? 'TrendingDown' : 'Minus'} 
                size={12} 
              />
              <span>{trend?.value}</span>
            </div>
          )}
        </div>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </div>
    </div>
  );
};

export default MetricsCard;