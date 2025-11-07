import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const UserAuthHeader = ({ 
  user = { 
    name: 'Admin', 
    email: 'admin@expresoviajes.com',
    avatar: null,
    role: 'Administrador'
  },
  onLogout 
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      navigate('/login');
    }
    setIsDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const menuItems = [
    {
      label: 'Mi Perfil',
      icon: 'User',
      action: () => {
        console.log('Navigate to profile');
        setIsDropdownOpen(false);
      }
    },
    {
      label: 'Configuración',
      icon: 'Settings',
      action: () => {
        console.log('Navigate to settings');
        setIsDropdownOpen(false);
      }
    },
    {
      label: 'Ayuda',
      icon: 'HelpCircle',
      action: () => {
        console.log('Navigate to help');
        setIsDropdownOpen(false);
      }
    }
  ];

  return (
    <div className="relative">
      {/* Desktop User Info */}
      <div className="hidden md:flex items-center space-x-3">
        <div className="text-right">
          <p className="text-sm font-medium text-foreground">{user?.name}</p>
          <p className="text-xs text-muted-foreground">{user?.role}</p>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleDropdown}
          className="flex items-center space-x-2 p-2 hover:bg-muted/50"
        >
          <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
            {user?.avatar ? (
              <img 
                src={user?.avatar} 
                alt={user?.name}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <Icon name="User" size={16} color="white" />
            )}
          </div>
          <Icon 
            name="ChevronDown" 
            size={14} 
            className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
          />
        </Button>
      </div>
      {/* Mobile User Button */}
      <div className="md:hidden">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleDropdown}
          className="p-2"
        >
          <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
            {user?.avatar ? (
              <img 
                src={user?.avatar} 
                alt={user?.name}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <Icon name="User" size={16} color="white" />
            )}
          </div>
        </Button>
      </div>
      {/* Dropdown Menu */}
      {isDropdownOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setIsDropdownOpen(false)}
          />
          
          {/* Menu */}
          <div className="absolute right-0 top-full mt-2 w-64 bg-popover border border-border rounded-lg shadow-modal z-50 transition-modal">
            {/* User Info in Mobile */}
            <div className="md:hidden px-4 py-3 border-b border-border">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
                  {user?.avatar ? (
                    <img 
                      src={user?.avatar} 
                      alt={user?.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <Icon name="User" size={20} color="white" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-foreground">{user?.name}</p>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                  <p className="text-xs text-muted-foreground">{user?.role}</p>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-2">
              {menuItems?.map((item, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="sm"
                  onClick={item?.action}
                  className="w-full justify-start px-4 py-2 h-auto hover:bg-muted/50"
                >
                  <Icon name={item?.icon} size={16} className="mr-3" />
                  <span className="text-sm">{item?.label}</span>
                </Button>
              ))}
              
              <div className="border-t border-border mt-2 pt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="w-full justify-start px-4 py-2 h-auto hover:bg-error/10 text-error hover:text-error"
                >
                  <Icon name="LogOut" size={16} className="mr-3" />
                  <span className="text-sm">Cerrar Sesión</span>
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UserAuthHeader;