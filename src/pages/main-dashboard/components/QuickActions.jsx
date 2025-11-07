import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from 'components/AppIcon';
import Button from 'components/ui/Button';

const QuickActions = () => {
  const navigate = useNavigate();

  const quickActions = [
    {
      id: 'assign-equipment',
      title: 'Asignar Equipo',
      description: 'Asignar equipo disponible a empleado',
      icon: 'UserPlus',
      color: 'primary',
      path: '/equipment-assignment'
    },
    {
      id: 'change-management',
      title: 'Gestión de Cambios',
      description: 'Procesar cambios y transiciones',
      icon: 'RefreshCw',
      color: 'accent',
      path: '/equipment-change-management'
    },
    {
      id: 'generate-documents',
      title: 'Generar Documentos',
      description: 'Crear actas de entrega',
      icon: 'FileText',
      color: 'success',
      path: '/document-generation'
    },
    {
      id: 'view-history',
      title: 'Ver Historial',
      description: 'Consultar historial completo',
      icon: 'History',
      color: 'secondary',
      path: '/equipment-history'
    }
  ];

  const handleActionClick = (path) => {
    navigate(path);
  };

  const getColorClasses = (color) => {
    switch (color) {
      case 'primary':
        return 'bg-primary text-primary-foreground hover:bg-primary/90';
      case 'accent':
        return 'bg-accent text-accent-foreground hover:bg-accent/90';
      case 'success':
        return 'bg-success text-success-foreground hover:bg-success/90';
      case 'secondary':
        return 'bg-secondary text-secondary-foreground hover:bg-secondary/90';
      default:
        return 'bg-primary text-primary-foreground hover:bg-primary/90';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-card">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground mb-2">Acciones Rápidas</h3>
        <p className="text-sm text-muted-foreground">Accede rápidamente a las funciones principales</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickActions?.map((action) => (
          <Button
            key={action?.id}
            variant="ghost"
            onClick={() => handleActionClick(action?.path)}
            className="h-auto p-4 flex flex-col items-center space-y-3 hover:bg-muted/50 border border-border hover:border-primary/20 transition-smooth"
          >
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getColorClasses(action?.color)}`}>
              <Icon name={action?.icon} size={24} />
            </div>
            
            <div className="text-center space-y-1">
              <h4 className="font-medium text-foreground text-sm">{action?.title}</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">{action?.description}</p>
            </div>
          </Button>
        ))}
      </div>
      {/* Additional Quick Stats */}
      <div className="mt-6 pt-6 border-t border-border">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">0</p>
            <p className="text-xs text-muted-foreground">Asignaciones Hoy</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-success">0</p>
            <p className="text-xs text-muted-foreground">Documentos Generados</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-warning">0</p>
            <p className="text-xs text-muted-foreground">Cambios Pendientes</p>
          </div>
          <div className-="text-center">
            <p className="text-2xl font-bold text-accent">0</p>
            <p className="text-xs text-muted-foreground">Equipos Disponibles</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickActions;