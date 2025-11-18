import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';
import Button from './Button';

const DashboardTabs = ({ activeTab = 'todos', onTabChange, counts }) => {
  const [currentTab, setCurrentTab] = useState(activeTab);
  const [tabItems, setTabItems] = useState([]);

  useEffect(() => {
    if (counts) {
      setTabItems([
        {
          id: 'todos',
          label: 'Todos',
          icon: 'Grid3X3',
          count: counts.total || 0,
          description: 'Ver todos los equipos'
        },
        {
          id: 'pc',
          label: 'PC',
          icon: 'Monitor',
          count: counts.pc || 0,
          description: 'Computadoras de escritorio'
        },
        {
          id: 'portatil',
          label: 'Portátil',
          icon: 'Laptop',
          count: counts.portatil || 0,
          description: 'Computadoras portátiles'
        },
        {
          id: 'tablet',
          label: 'Tablet',
          icon: 'Tablet',
          count: counts.tablet || 0,
          description: 'Dispositivos tablet'
        },
        {
          id: 'asignados',
          label: 'Asignados',
          icon: 'UserCheck',
          count: counts.asignados || 0,
          description: 'Equipos asignados a empleados'
        },
        {
          id: 'disponible',
          label: 'Disponible',
          icon: 'CheckCircle',
          count: counts.disponible || 0,
          description: 'Equipos disponibles para asignación'
        },
        {
          id: 'danados',
          label: 'Dañados',
          icon: 'AlertTriangle',
          count: counts.danados || 0,
          description: 'Equipos que requieren reparación'
        }
      ]);
    }
  }, [counts]);

  const handleTabClick = (tabId) => {
    setCurrentTab(tabId);
    if (onTabChange) {
      onTabChange(tabId);
    }
  };

  const isActive = (tabId) => currentTab === tabId;

  return (
    <div className="w-full">
      {/* Desktop Tabs */}
      <div className="hidden md:flex items-center space-x-2 bg-muted p-1 rounded-lg">
        {tabItems?.map((tab) => (
          <Button
            key={tab?.id}
            variant={isActive(tab?.id) ? "default" : "ghost"}
            size="sm"
            onClick={() => handleTabClick(tab?.id)}
            className="flex items-center space-x-2 px-4 py-2 min-w-0 flex-1 justify-center transition-smooth"
            title={tab?.description}
          >
            <Icon 
              name={tab?.icon} 
              size={16} 
              className={isActive(tab?.id) ? "text-primary-foreground" : "text-muted-foreground"}
            />
            <span className="font-medium text-sm truncate">{tab?.label}</span>
            <span className={`text-xs px-2 py-0.5 rounded-full ${
              isActive(tab?.id) 
                ? "bg-primary-foreground/20 text-primary-foreground" 
                : "bg-muted-foreground/20 text-muted-foreground"
            }`}>
              {tab?.count}
            </span>
          </Button>
        ))}
      </div>
      {/* Mobile Tabs - Scrollable */}
      <div className="md:hidden">
        <div className="flex overflow-x-auto scrollbar-hide space-x-2 pb-2">
          {tabItems?.map((tab) => (
            <Button
              key={tab?.id}
              variant={isActive(tab?.id) ? "default" : "ghost"}
              size="sm"
              onClick={() => handleTabClick(tab?.id)}
              className="flex flex-col items-center space-y-1 px-4 py-3 min-w-[80px] flex-shrink-0 transition-smooth"
            >
              <Icon 
                name={tab?.icon} 
                size={18} 
                className={isActive(tab?.id) ? "text-primary-foreground" : "text-muted-foreground"}
              />
              <span className="font-medium text-xs text-center">{tab?.label}</span>
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                isActive(tab?.id) 
                  ? "bg-primary-foreground/20 text-primary-foreground" 
                  : "bg-muted-foreground/20 text-muted-foreground"
              }`}>
                {tab?.count}
              </span>
            </Button>
          ))}
        </div>
      </div>
      {/* Tab Content Indicator */}
      <div className="mt-4 p-4 bg-card rounded-lg border border-border shadow-card">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              isActive('todos') ? 'bg-muted' : 
              isActive('danados') ? 'bg-error/10' :
              isActive('disponible') ? 'bg-success/10' :
              isActive('asignados') ? 'bg-primary/10' :
              'bg-accent/10'
            }`}>
              <Icon 
                name={tabItems?.find(tab => tab?.id === currentTab)?.icon || 'Grid3X3'} 
                size={20}
                className={
                  isActive('danados') ? 'text-error' :
                  isActive('disponible') ? 'text-success' :
                  isActive('asignados') ? 'text-primary' :
                  'text-accent'
                }
              />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">
                {tabItems?.find(tab => tab?.id === currentTab)?.label || 'Todos los Equipos'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {tabItems?.find(tab => tab?.id === currentTab)?.description || 'Vista general del inventario'}
              </p>
            </div>
          </div>
          
          <div className="text-right">
            <p className="text-2xl font-bold text-foreground">
              {tabItems?.find(tab => tab?.id === currentTab)?.count || 0}
            </p>
            <p className="text-xs text-muted-foreground">equipos</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardTabs;
