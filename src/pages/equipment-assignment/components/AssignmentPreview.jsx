import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AssignmentPreview = ({ 
  selectedEquipment, 
  employeeData, 
  selectedAccessories, 
  onConfirmAssignment,
  isProcessing = false 
}) => {
  const defaultAccessories = [
    { id: "mouse", name: "Mouse", icon: "Mouse" },
    { id: "teclado", name: "Teclado", icon: "Keyboard" },
    { id: "monitor", name: "Monitor", icon: "Monitor" },
    { id: "cable_poder", name: "Cable de Poder", icon: "Zap" },
    { id: "cable_red", name: "Cable de Red", icon: "Cable" },
    { id: "cable_hdmi", name: "Cable HDMI", icon: "Cable" },
    { id: "cable_usb", name: "Cable USB", icon: "Usb" },
    { id: "adaptador", name: "Adaptador", icon: "Plug" },
    { id: "base_refrigeracion", name: "Base de Refrigeración", icon: "Fan" },
    { id: "maletin", name: "Maletín", icon: "Briefcase" },
    { id: "auriculares", name: "Auriculares", icon: "Headphones" },
    { id: "webcam", name: "Webcam", icon: "Camera" }
  ];

  const getAccessoryName = (accessoryId) => {
    const accessory = defaultAccessories?.find(acc => acc?.id === accessoryId);
    return accessory ? accessory?.name : accessoryId?.replace('custom_', '')?.replace(/_/g, ' ');
  };

  const getAccessoryIcon = (accessoryId) => {
    const accessory = defaultAccessories?.find(acc => acc?.id === accessoryId);
    return accessory ? accessory?.icon : 'Plus';
  };

  const getCurrentDate = () => {
    return new Date()?.toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const isFormComplete = () => {
    return selectedEquipment && 
           employeeData?.nombre && 
           employeeData?.correo && 
           employeeData?.cedula && 
           employeeData?.area;
  };

  if (!selectedEquipment || !employeeData?.nombre) {
    return (
      <div className="bg-card rounded-lg border border-border shadow-card h-full">
        <div className="p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
              <Icon name="FileText" size={20} className="text-muted-foreground" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Vista Previa</h2>
              <p className="text-sm text-muted-foreground">Documento de entrega</p>
            </div>
          </div>
        </div>
        
        <div className="p-6 flex items-center justify-center h-64">
          <div className="text-center">
            <Icon name="FileX" size={48} className="text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              Complete la información del equipo y empleado para ver la vista previa
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg border border-border shadow-card h-full">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="FileText" size={20} className="text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Vista Previa del Documento</h2>
              <p className="text-sm text-muted-foreground">Acta de entrega de equipo</p>
            </div>
          </div>
          
          <Button
            variant="default"
            onClick={onConfirmAssignment}
            disabled={!isFormComplete() || isProcessing}
            loading={isProcessing}
            iconName="Send"
            iconPosition="left"
          >
            {isProcessing ? 'Procesando...' : 'Confirmar Asignación'}
          </Button>
        </div>
      </div>
      <div className="p-6 max-h-96 overflow-y-auto">
        {/* Document Preview */}
        <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-sm">
          {/* Header */}
          <div className="text-center mb-6 pb-4 border-b border-gray-200">
            <div className="flex items-center justify-center space-x-3 mb-2">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="Package" size={24} color="white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">EXPRESO VIAJES Y TURISMO</h1>
                <p className="text-sm text-gray-600">Departamento de Tecnología</p>
              </div>
            </div>
            <h2 className="text-lg font-semibold text-gray-800 mt-4">
              ACTA DE ENTREGA DE EQUIPO TECNOLÓGICO
            </h2>
            <p className="text-sm text-gray-600">Fecha: {getCurrentDate()}</p>
          </div>

          {/* Employee Information */}
          <div className="mb-6">
            <h3 className="text-md font-semibold text-gray-800 mb-3 flex items-center space-x-2">
              <Icon name="User" size={16} />
              <span>INFORMACIÓN DEL EMPLEADO</span>
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">Nombre:</span>
                <p className="text-gray-900">{employeeData?.nombre}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Cédula:</span>
                <p className="text-gray-900">{employeeData?.cedula}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Área:</span>
                <p className="text-gray-900">{employeeData?.area}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Correo:</span>
                <p className="text-gray-900">{employeeData?.correo}</p>
              </div>
              {employeeData?.cargo && (
                <div>
                  <span className="font-medium text-gray-700">Cargo:</span>
                  <p className="text-gray-900">{employeeData?.cargo}</p>
                </div>
              )}
              {employeeData?.telefono && (
                <div>
                  <span className="font-medium text-gray-700">Teléfono:</span>
                  <p className="text-gray-900">{employeeData?.telefono}</p>
                </div>
              )}
            </div>
          </div>

          {/* Equipment Information */}
          <div className="mb-6">
            <h3 className="text-md font-semibold text-gray-800 mb-3 flex items-center space-x-2">
              <Icon name="Monitor" size={16} />
              <span>INFORMACIÓN DEL EQUIPO</span>
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">Tipo:</span>
                <p className="text-gray-900">{selectedEquipment?.type?.toUpperCase()}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Service Tag:</span>
                <p className="text-gray-900 font-mono">{selectedEquipment?.serviceTag}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Marca:</span>
                <p className="text-gray-900">{selectedEquipment?.brand}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Modelo:</span>
                <p className="text-gray-900">{selectedEquipment?.model}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Procesador:</span>
                <p className="text-gray-900">{selectedEquipment?.processor}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">RAM:</span>
                <p className="text-gray-900">{selectedEquipment?.ram}</p>
              </div>
              <div className="col-span-2">
                <span className="font-medium text-gray-700">Almacenamiento:</span>
                <p className="text-gray-900">{selectedEquipment?.storage}</p>
              </div>
            </div>
          </div>

          {/* Accessories */}
          {selectedAccessories?.length > 0 && (
            <div className="mb-6">
              <h3 className="text-md font-semibold text-gray-800 mb-3 flex items-center space-x-2">
                <Icon name="Package" size={16} />
                <span>ACCESORIOS INCLUIDOS</span>
              </h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {selectedAccessories?.map((accessoryId, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Icon name={getAccessoryIcon(accessoryId)} size={14} className="text-gray-600" />
                    <span className="text-gray-900">{getAccessoryName(accessoryId)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Signatures */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-2 gap-8">
              <div className="text-center">
                <div className="border-t border-gray-400 pt-2 mt-16">
                  <p className="text-sm font-medium text-gray-800">ENTREGA</p>
                  <p className="text-xs text-gray-600">Departamento de Tecnología</p>
                </div>
              </div>
              <div className="text-center">
                <div className="border-t border-gray-400 pt-2 mt-16">
                  <p className="text-sm font-medium text-gray-800">RECIBE</p>
                  <p className="text-xs text-gray-600">{employeeData?.nombre}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Assignment Summary */}
        <div className="mt-6 p-4 bg-primary/10 border border-primary/20 rounded-lg">
          <div className="flex items-center space-x-2 mb-3">
            <Icon name="Info" size={16} className="text-primary" />
            <span className="text-sm font-medium text-primary">Resumen de la Asignación</span>
          </div>
          <div className="text-sm text-foreground space-y-1">
            <p>• El equipo será marcado como "Asignado" en el sistema</p>
            <p>• Se generará el documento PDF automáticamente</p>
            <p>• Se enviará por correo a: {employeeData?.correo}</p>
            <p>• Se notificará al departamento de tecnología</p>
            <p>• Se registrará en el historial del equipo</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignmentPreview;