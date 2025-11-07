import React from 'react';
import Icon from '../../../components/AppIcon';

const DocumentPreview = ({ 
  documentData, 
  checklistItems, 
  specialInstructions,
  onGenerateDocument 
}) => {
  const currentDate = new Date()?.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  const currentTime = new Date()?.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="bg-white border border-border rounded-lg shadow-card h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="FileText" size={20} color="white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Vista Previa del Documento</h2>
              <p className="text-sm text-muted-foreground">Acta de Entrega de Equipos</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-foreground">ID: DOC-{Date.now()?.toString()?.slice(-6)}</p>
            <p className="text-xs text-muted-foreground">{currentDate} - {currentTime}</p>
          </div>
        </div>
      </div>
      {/* Document Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Company Header */}
          <div className="text-center border-b border-border pb-6">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="Package" size={24} color="white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">EXPRESO VIAJES Y TURISMO</h1>
                <p className="text-sm text-muted-foreground">Sistema de Gestión de Equipos</p>
              </div>
            </div>
            <h2 className="text-xl font-semibold text-foreground">ACTA DE ENTREGA DE EQUIPOS</h2>
          </div>

          {/* Document Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
            <div>
              <p className="text-sm font-medium text-foreground">Fecha de Entrega:</p>
              <p className="text-sm text-muted-foreground">{currentDate}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Hora:</p>
              <p className="text-sm text-muted-foreground">{currentTime}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Documento No:</p>
              <p className="text-sm text-muted-foreground">DOC-{Date.now()?.toString()?.slice(-6)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Responsable:</p>
              <p className="text-sm text-muted-foreground">Departamento de Tecnología</p>
            </div>
          </div>

          {/* Employee Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">
              Información del Empleado
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-foreground">Nombre Completo:</p>
                <p className="text-sm text-muted-foreground">{documentData?.employee?.name || 'No especificado'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Cédula:</p>
                <p className="text-sm text-muted-foreground">{documentData?.employee?.cedula || 'No especificado'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Área/Departamento:</p>
                <p className="text-sm text-muted-foreground">{documentData?.employee?.area || 'No especificado'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Correo Electrónico:</p>
                <p className="text-sm text-muted-foreground">{documentData?.employee?.email || 'No especificado'}</p>
              </div>
            </div>
          </div>

          {/* Equipment Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">
              Información del Equipo
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-foreground">Tipo de Equipo:</p>
                <p className="text-sm text-muted-foreground">{documentData?.equipment?.type || 'No especificado'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Service Tag:</p>
                <p className="text-sm text-muted-foreground font-mono">{documentData?.equipment?.serviceTag || 'No especificado'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Marca/Modelo:</p>
                <p className="text-sm text-muted-foreground">{documentData?.equipment?.brand || 'No especificado'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Estado:</p>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-success/10 text-success">
                  <Icon name="CheckCircle" size={12} className="mr-1" />
                  {documentData?.equipment?.status || 'Funcional'}
                </span>
              </div>
            </div>
          </div>

          {/* Checklist Items */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">
              Lista de Verificación
            </h3>
            <div className="space-y-2">
              {checklistItems?.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 border-2 border-primary rounded flex items-center justify-center">
                      <Icon name="Check" size={12} className="text-primary" />
                    </div>
                    <span className="text-sm font-medium text-foreground">{item?.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-muted-foreground">
                      {item?.quantity > 1 ? `Cantidad: ${item?.quantity}` : 'Incluido'}
                    </span>
                    <Icon name="CheckCircle" size={16} className="text-success" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Special Instructions */}
          {specialInstructions && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">
                Instrucciones Especiales
              </h3>
              <div className="p-4 bg-warning/10 border border-warning/20 rounded-lg">
                <div className="flex items-start space-x-3">
                  <Icon name="AlertTriangle" size={20} className="text-warning mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-foreground mb-2">Notas Importantes:</p>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{specialInstructions}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Signatures Section */}
          <div className="space-y-4 pt-6 border-t border-border">
            <h3 className="text-lg font-semibold text-foreground">Firmas y Confirmación</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="text-center">
                <div className="h-20 border-b-2 border-border mb-2"></div>
                <p className="text-sm font-medium text-foreground">Entregado por:</p>
                <p className="text-xs text-muted-foreground">Departamento de Tecnología</p>
                <p className="text-xs text-muted-foreground">Fecha: {currentDate}</p>
              </div>
              <div className="text-center">
                <div className="h-20 border-b-2 border-border mb-2"></div>
                <p className="text-sm font-medium text-foreground">Recibido por:</p>
                <p className="text-xs text-muted-foreground">{documentData?.employee?.name || 'Empleado'}</p>
                <p className="text-xs text-muted-foreground">Fecha: {currentDate}</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center pt-6 border-t border-border">
            <p className="text-xs text-muted-foreground">
              Este documento certifica la entrega de los equipos mencionados en perfecto estado de funcionamiento.
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              EXPRESO VIAJES Y TURISMO - Sistema Equipos EVT - Generado el {currentDate}
            </p>
          </div>
        </div>
      </div>
      {/* Action Buttons */}
      <div className="p-6 border-t border-border bg-muted/30">
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onGenerateDocument}
            className="flex-1 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-smooth flex items-center justify-center space-x-2"
          >
            <Icon name="Download" size={16} />
            <span>Generar PDF</span>
          </button>
          <button className="flex-1 bg-accent text-accent-foreground px-4 py-2 rounded-lg font-medium hover:bg-accent/90 transition-smooth flex items-center justify-center space-x-2">
            <Icon name="Mail" size={16} />
            <span>Enviar por Email</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DocumentPreview;