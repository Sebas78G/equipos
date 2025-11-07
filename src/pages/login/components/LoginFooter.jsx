import React from 'react';
import Icon from '../../../components/AppIcon';

const LoginFooter = () => {
  const currentYear = new Date()?.getFullYear();

  const supportFeatures = [
    {
      icon: 'Shield',
      title: 'Seguro',
      description: 'Autenticación protegida'
    },
    {
      icon: 'Clock',
      title: '24/7',
      description: 'Disponible siempre'
    },
    {
      icon: 'Users',
      title: 'Soporte',
      description: 'Asistencia técnica'
    }
  ];

  return (
    <div className="mt-12 space-y-8">
      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {supportFeatures?.map((feature, index) => (
          <div key={index} className="text-center p-4 bg-muted/30 rounded-lg">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Icon name={feature?.icon} size={16} className="text-primary" />
            </div>
            <h3 className="text-sm font-medium text-foreground mb-1">
              {feature?.title}
            </h3>
            <p className="text-xs text-muted-foreground">
              {feature?.description}
            </p>
          </div>
        ))}
      </div>
      {/* Help Section */}
      <div className="text-center space-y-4">
        <div className="p-4 bg-card border border-border rounded-lg">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Icon name="HelpCircle" size={16} className="text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">¿Necesitas ayuda?</span>
          </div>
          <p className="text-xs text-muted-foreground mb-3">
            Contacta al departamento de tecnología para asistencia con el acceso
          </p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <Icon name="Mail" size={12} />
              <span>tecnologia@expresoviajes.com</span>
            </div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <Icon name="Phone" size={12} />
              <span>+57 (1) 234-5678</span>
            </div>
          </div>
        </div>
      </div>
      {/* Copyright */}
      <div className="text-center pt-6 border-t border-border">
        <p className="text-xs text-muted-foreground">
          © {currentYear} EXPRESO VIAJES Y TURISMO. Todos los derechos reservados.
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Sistema de Gestión de Equipos - Versión 1.0
        </p>
      </div>
    </div>
  );
};

export default LoginFooter;