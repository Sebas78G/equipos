import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const MainNavigation = ({ isCollapsed = false, onToggleCollapse }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navigationItems = [
    {
      label: 'Panel Principal',
      path: '/main-dashboard',
      icon: 'LayoutDashboard',
      tooltip: 'Vista general del inventario de equipos'
    },
    {
      label: 'Asignar Equipo',
      path: '/equipment-assignment',
      icon: 'UserPlus',
      tooltip: 'Asignar equipos a empleados'
    },
    {
      label: 'Gestión de Cambios',
      path: '/equipment-change-management',
      icon: 'RefreshCw',
      tooltip: 'Gestionar cambios y transiciones de equipos'
    },
    {
      label: 'Generar Documentos',
      path: '/document-generation',
      icon: 'FileText',
      tooltip: 'Crear y gestionar documentos de entrega'
    }
  ];

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const isActivePath = (path) => {
    return location?.pathname === path;
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-muted border-b border-border">
      <div className="flex items-center justify-between h-16 px-4">
        {/* Logo Section */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <img src="/expreso.png" alt="Equipos EVT" className="w-8 h-8" />
            <div className="hidden sm:block">
              <h1 className="text-lg font-semibold text-foreground">Equipos EVT</h1>
              <p className="text-xs text-muted-foreground">EXPRESO VIAJES Y TURISMO</p>
            </div>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-1">
          {navigationItems?.map((item) => (
            <Button
              key={item?.path}
              variant={isActivePath(item?.path) ? "default" : "ghost"}
              size="sm"
              onClick={() => handleNavigation(item?.path)}
              className="flex items-center space-x-2 px-3 py-2"
              title={item?.tooltip}
            >
              <Icon name={item?.icon} size={16} />
              <span className="text-sm font-medium">{item?.label}</span>
            </Button>
          ))}
        </nav>

        {/* User Section */}
        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center space-x-2">
            <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
              <Icon name="User" size={16} color="white" />
            </div>
            <div className="text-sm">
              <p className="font-medium text-foreground">Admin</p>
              <p className="text-xs text-muted-foreground">admin@expresoviajes.com</p>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/login')}
            className="hidden md:flex items-center space-x-1"
          >
            <Icon name="LogOut" size={16} />
            <span className="text-sm">Salir</span>
          </Button>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleMobileMenu}
            className="lg:hidden"
          >
            <Icon name={isMobileMenuOpen ? "X" : "Menu"} size={20} />
          </Button>
        </div>
      </div>
      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-card border-t border-border shadow-modal">
          <nav className="px-4 py-2 space-y-1">
            {navigationItems?.map((item) => (
              <Button
                key={item?.path}
                variant={isActivePath(item?.path) ? "default" : "ghost"}
                size="sm"
                onClick={() => handleNavigation(item?.path)}
                className="w-full justify-start flex items-center space-x-3 px-3 py-3"
              >
                <Icon name={item?.icon} size={18} />
                <span className="font-medium">{item?.label}</span>
              </Button>
            ))}
            
            {/* Mobile User Actions */}
            <div className="pt-4 mt-4 border-t border-border">
              <div className="flex items-center space-x-3 px-3 py-2 mb-2">
                <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                  <Icon name="User" size={16} color="white" />
                </div>
                <div className="text-sm">
                  <p className="font-medium text-foreground">Admin</p>
                  <p className="text-xs text-muted-foreground">admin@expresoviajes.com</p>
                </div>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  navigate('/login');
                  setIsMobileMenuOpen(false);
                }}
                className="w-full justify-start flex items-center space-x-3 px-3 py-3"
              >
                <Icon name="LogOut" size={18} />
                <span className="font-medium">Cerrar Sesión</span>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default MainNavigation;