import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const DocumentStatusTracker = ({ onClose }) => {
  const [activeDocument, setActiveDocument] = useState(null);

  const documentHistory = [
    {
      id: 'DOC-001234',
      employee: 'María González Rodríguez',
      equipment: 'Portátil Dell Latitude 5520',
      serviceTag: 'DL5520-2023-001',
      generatedDate: '2025-11-05',
      generatedTime: '14:30',
      status: 'delivered',
      emailSent: true,
      emailDelivered: true,
      employeeConfirmed: true,
      downloadCount: 3,
      lastAccessed: '2025-11-05 15:45'
    },
    {
      id: 'DOC-001233',
      employee: 'Carlos Mendoza Silva',
      equipment: 'PC Escritorio HP EliteDesk',
      serviceTag: 'HP-ED-2023-045',
      generatedDate: '2025-11-05',
      generatedTime: '11:15',
      status: 'pending_confirmation',
      emailSent: true,
      emailDelivered: true,
      employeeConfirmed: false,
      downloadCount: 1,
      lastAccessed: '2025-11-05 11:20'
    },
    {
      id: 'DOC-001232',
      employee: 'Ana Patricia Herrera',
      equipment: 'Tablet Samsung Galaxy Tab S8',
      serviceTag: 'SGT-S8-2023-012',
      generatedDate: '2025-11-04',
      generatedTime: '16:45',
      status: 'email_failed',
      emailSent: true,
      emailDelivered: false,
      employeeConfirmed: false,
      downloadCount: 0,
      lastAccessed: null
    },
    {
      id: 'DOC-001231',
      employee: 'Roberto Jiménez Castro',
      equipment: 'Portátil Lenovo ThinkPad X1',
      serviceTag: 'LN-X1-2023-078',
      generatedDate: '2025-11-04',
      generatedTime: '09:30',
      status: 'delivered',
      emailSent: true,
      emailDelivered: true,
      employeeConfirmed: true,
      downloadCount: 2,
      lastAccessed: '2025-11-04 10:15'
    }
  ];

  const getStatusInfo = (status) => {
    const statusMap = {
      delivered: {
        label: 'Entregado',
        color: 'text-success',
        bgColor: 'bg-success/10',
        icon: 'CheckCircle'
      },
      pending_confirmation: {
        label: 'Pendiente Confirmación',
        color: 'text-warning',
        bgColor: 'bg-warning/10',
        icon: 'Clock'
      },
      email_failed: {
        label: 'Error en Envío',
        color: 'text-error',
        bgColor: 'bg-error/10',
        icon: 'AlertCircle'
      },
      generated: {
        label: 'Generado',
        color: 'text-accent',
        bgColor: 'bg-accent/10',
        icon: 'FileText'
      }
    };
    return statusMap?.[status] || statusMap?.generated;
  };

  const handleResendEmail = (docId) => {
    console.log('Reenviar email para documento:', docId);
    // Aquí iría la lógica para reenviar el email
  };

  const handleDownloadDocument = (docId) => {
    console.log('Descargar documento:', docId);
    // Aquí iría la lógica para descargar el documento
  };

  const handleViewDetails = (doc) => {
    setActiveDocument(doc);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-lg shadow-modal w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="Activity" size={20} color="white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">Estado de Documentos</h2>
                <p className="text-sm text-muted-foreground">Seguimiento de entregas y confirmaciones</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
            >
              <Icon name="X" size={20} />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {!activeDocument ? (
            /* Document List */
            (<div className="p-6 overflow-y-auto h-full">
              <div className="space-y-4">
                {documentHistory?.map((doc) => {
                  const statusInfo = getStatusInfo(doc?.status);
                  return (
                    <div key={doc?.id} className="border border-border rounded-lg p-4 hover:bg-muted/30 transition-smooth">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className={`px-3 py-1 rounded-full text-xs font-medium ${statusInfo?.bgColor} ${statusInfo?.color} flex items-center space-x-1`}>
                            <Icon name={statusInfo?.icon} size={12} />
                            <span>{statusInfo?.label}</span>
                          </div>
                          <span className="text-sm font-mono text-muted-foreground">{doc?.id}</span>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-foreground">{doc?.generatedDate}</p>
                          <p className="text-xs text-muted-foreground">{doc?.generatedTime}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm font-medium text-foreground">{doc?.employee}</p>
                          <p className="text-xs text-muted-foreground">{doc?.equipment}</p>
                          <p className="text-xs text-muted-foreground font-mono">{doc?.serviceTag}</p>
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <Icon 
                              name={doc?.emailSent ? "CheckCircle" : "XCircle"} 
                              size={12} 
                              className={doc?.emailSent ? "text-success" : "text-error"} 
                            />
                            <span className="text-xs text-muted-foreground">Email enviado</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Icon 
                              name={doc?.emailDelivered ? "CheckCircle" : "XCircle"} 
                              size={12} 
                              className={doc?.emailDelivered ? "text-success" : "text-error"} 
                            />
                            <span className="text-xs text-muted-foreground">Email entregado</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Icon 
                              name={doc?.employeeConfirmed ? "CheckCircle" : "Clock"} 
                              size={12} 
                              className={doc?.employeeConfirmed ? "text-success" : "text-warning"} 
                            />
                            <span className="text-xs text-muted-foreground">Confirmado por empleado</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                          <span>Descargas: {doc?.downloadCount}</span>
                          {doc?.lastAccessed && (
                            <span>Último acceso: {doc?.lastAccessed}</span>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewDetails(doc)}
                          >
                            <Icon name="Eye" size={14} />
                            Ver Detalles
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDownloadDocument(doc?.id)}
                          >
                            <Icon name="Download" size={14} />
                            Descargar
                          </Button>
                          {!doc?.emailDelivered && (
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() => handleResendEmail(doc?.id)}
                            >
                              <Icon name="Mail" size={14} />
                              Reenviar
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>)
          ) : (
            /* Document Details */
            (<div className="p-6 overflow-y-auto h-full">
              <div className="mb-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setActiveDocument(null)}
                  className="mb-4"
                >
                  <Icon name="ArrowLeft" size={16} />
                  Volver a la Lista
                </Button>
              </div>
              <div className="space-y-6">
                {/* Document Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground">Información del Documento</h3>
                    <div className="space-y-2">
                      <div>
                        <p className="text-sm font-medium text-foreground">ID del Documento:</p>
                        <p className="text-sm text-muted-foreground font-mono">{activeDocument?.id}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">Fecha de Generación:</p>
                        <p className="text-sm text-muted-foreground">{activeDocument?.generatedDate} a las {activeDocument?.generatedTime}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">Estado Actual:</p>
                        <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusInfo(activeDocument?.status)?.bgColor} ${getStatusInfo(activeDocument?.status)?.color}`}>
                          <Icon name={getStatusInfo(activeDocument?.status)?.icon} size={12} />
                          <span>{getStatusInfo(activeDocument?.status)?.label}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground">Información del Empleado</h3>
                    <div className="space-y-2">
                      <div>
                        <p className="text-sm font-medium text-foreground">Nombre:</p>
                        <p className="text-sm text-muted-foreground">{activeDocument?.employee}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">Equipo Asignado:</p>
                        <p className="text-sm text-muted-foreground">{activeDocument?.equipment}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">Service Tag:</p>
                        <p className="text-sm text-muted-foreground font-mono">{activeDocument?.serviceTag}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Delivery Timeline */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground">Cronología de Entrega</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-3 bg-success/10 rounded-lg">
                      <Icon name="FileText" size={16} className="text-success" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">Documento Generado</p>
                        <p className="text-xs text-muted-foreground">{activeDocument?.generatedDate} - {activeDocument?.generatedTime}</p>
                      </div>
                      <Icon name="CheckCircle" size={16} className="text-success" />
                    </div>

                    <div className={`flex items-center space-x-3 p-3 rounded-lg ${activeDocument?.emailSent ? 'bg-success/10' : 'bg-error/10'}`}>
                      <Icon name="Mail" size={16} className={activeDocument?.emailSent ? "text-success" : "text-error"} />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">Email Enviado</p>
                        <p className="text-xs text-muted-foreground">
                          {activeDocument?.emailSent ? 'Enviado correctamente' : 'Error en el envío'}
                        </p>
                      </div>
                      <Icon 
                        name={activeDocument?.emailSent ? "CheckCircle" : "XCircle"} 
                        size={16} 
                        className={activeDocument?.emailSent ? "text-success" : "text-error"} 
                      />
                    </div>

                    <div className={`flex items-center space-x-3 p-3 rounded-lg ${activeDocument?.emailDelivered ? 'bg-success/10' : 'bg-warning/10'}`}>
                      <Icon name="Inbox" size={16} className={activeDocument?.emailDelivered ? "text-success" : "text-warning"} />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">Email Entregado</p>
                        <p className="text-xs text-muted-foreground">
                          {activeDocument?.emailDelivered ? 'Recibido por el empleado' : 'Pendiente de entrega'}
                        </p>
                      </div>
                      <Icon 
                        name={activeDocument?.emailDelivered ? "CheckCircle" : "Clock"} 
                        size={16} 
                        className={activeDocument?.emailDelivered ? "text-success" : "text-warning"} 
                      />
                    </div>

                    <div className={`flex items-center space-x-3 p-3 rounded-lg ${activeDocument?.employeeConfirmed ? 'bg-success/10' : 'bg-muted'}`}>
                      <Icon name="UserCheck" size={16} className={activeDocument?.employeeConfirmed ? "text-success" : "text-muted-foreground"} />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">Confirmación del Empleado</p>
                        <p className="text-xs text-muted-foreground">
                          {activeDocument?.employeeConfirmed ? 'Confirmado por el empleado' : 'Pendiente de confirmación'}
                        </p>
                      </div>
                      <Icon 
                        name={activeDocument?.employeeConfirmed ? "CheckCircle" : "Clock"} 
                        size={16} 
                        className={activeDocument?.employeeConfirmed ? "text-success" : "text-muted-foreground"} 
                      />
                    </div>
                  </div>
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-muted rounded-lg text-center">
                    <p className="text-2xl font-bold text-foreground">{activeDocument?.downloadCount}</p>
                    <p className="text-sm text-muted-foreground">Descargas</p>
                  </div>
                  <div className="p-4 bg-muted rounded-lg text-center">
                    <p className="text-2xl font-bold text-foreground">
                      {activeDocument?.lastAccessed ? '1' : '0'}
                    </p>
                    <p className="text-sm text-muted-foreground">Accesos</p>
                  </div>
                  <div className="p-4 bg-muted rounded-lg text-center">
                    <p className="text-2xl font-bold text-foreground">
                      {activeDocument?.employeeConfirmed ? '100%' : '75%'}
                    </p>
                    <p className="text-sm text-muted-foreground">Completado</p>
                  </div>
                </div>
              </div>
            </div>)
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentStatusTracker;