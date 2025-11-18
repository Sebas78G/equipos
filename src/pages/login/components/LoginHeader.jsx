import React from 'react';

const LoginHeader = () => {
  return (
    <div className="text-center mb-8">
      {/* Company Logo */}
      <div className="flex justify-center mb-6">
        <img src="/expreso.png" alt="Equipos EVT" className="w-16 h-16" />
      </div>

      {/* Company Name */}
      <h1 className="text-2xl font-bold text-foreground mb-2">
      Equipos EVT
      </h1>
      
      {/* Company Subtitle */}
      <p className="text-sm text-muted-foreground mb-4">
        EXPRESO VIAJES Y TURISMO
      </p>

      {/* Welcome Message */}
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-foreground">
          Bienvenido de vuelta
        </h2>
        <p className="text-sm text-muted-foreground max-w-sm mx-auto">
          Accede al sistema de gestión de equipos para administrar el inventario tecnológico de la empresa
        </p>
      </div>
    </div>
  );
};

export default LoginHeader;