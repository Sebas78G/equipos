import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const WorkflowBreadcrumbs = ({ 
  customBreadcrumbs = null,
  showHome = true,
  showBack = false,
  separator = 'ChevronRight'
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  const routeMapping = {
    '/main-dashboard': {
      label: 'Panel Principal',
      icon: 'LayoutDashboard'
    },
    '/equipment-assignment': {
      label: 'Asignar Equipo',
      icon: 'UserPlus',
      parent: '/main-dashboard'
    },
    '/equipment-change-management': {
      label: 'Gestión de Cambios',
      icon: 'RefreshCw',
      parent: '/main-dashboard'
    },
    '/equipment-history': {
      label: 'Historial de Equipos',
      icon: 'History',
      parent: '/main-dashboard'
    },
    '/document-generation': {
      label: 'Generar Documentos',
      icon: 'FileText',
      parent: '/main-dashboard'
    }
  };

  const generateBreadcrumbs = () => {
    if (customBreadcrumbs) {
      return customBreadcrumbs;
    }

    const currentPath = location?.pathname;
    const currentRoute = routeMapping?.[currentPath];
    
    if (!currentRoute) {
      return [];
    }

    const breadcrumbs = [];
    
    // Add home if requested and not already on dashboard
    if (showHome && currentPath !== '/main-dashboard') {
      breadcrumbs?.push({
        label: 'Panel Principal',
        path: '/main-dashboard',
        icon: 'LayoutDashboard',
        isClickable: true
      });
    }

    // Add current page
    if (currentRoute) {
      breadcrumbs?.push({
        label: currentRoute.label,
        path: currentPath,
        icon: currentRoute.icon,
        isClickable: false,
        isCurrent: true
      });
    }

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  if (breadcrumbs?.length === 0 && !showBack) {
    return null;
  }

  const handleBreadcrumbClick = (path) => {
    navigate(path);
  };
  
  const handleBackClick = () => {
    navigate(-1);
  };

  return (
    <nav className="flex items-center space-x-2 py-3 px-4 bg-background border-b border-border" aria-label="Breadcrumb">
      <div className="flex items-center space-x-2 text-sm">
        {showBack && (
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBackClick}
              className="flex items-center space-x-2 px-2 py-1 h-auto hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-smooth"
            >
              <Icon name="ArrowLeft" size={14} />
            </Button>
            {breadcrumbs?.length > 0 && <Icon 
              name={separator} 
              size={14} 
              className="text-muted-foreground" 
            />}
          </div>
        )}
        {breadcrumbs?.map((crumb, index) => (
          <div key={index} className="flex items-center space-x-2">
            {(index > 0 || showBack) && (
              <Icon 
                name={separator} 
                size={14} 
                className="text-muted-foreground" 
              />
            )}
            
            <div className="flex items-center space-x-2">
              {crumb?.isClickable ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleBreadcrumbClick(crumb?.path)}
                  className="flex items-center space-x-2 px-2 py-1 h-auto hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-smooth"
                >
                  <Icon name={crumb?.icon} size={14} />
                  <span>{crumb?.label}</span>
                </Button>
              ) : (
                <div className={`flex items-center space-x-2 px-2 py-1 ${
                  crumb?.isCurrent 
                    ? 'text-foreground font-medium' 
                    : 'text-muted-foreground'
                }`}>
                  <Icon name={crumb?.icon} size={14} />
                  <span>{crumb?.label}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </nav>
  );
};

export default WorkflowBreadcrumbs;