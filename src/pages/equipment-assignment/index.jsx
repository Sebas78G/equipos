import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainNavigation from '../../components/iu/MainNavigation';
import WorkflowBreadcrumbs from '../../components/iu/WorkflowBreadcrumbs';
import EquipmentSelectionPanel from './components/EquipmentSelectionPanel';
import EmployeeInformationForm from './components/EmployeeInformationForm';
import AccessoryChecklist from './components/AccessoryChecklist';
import AssignmentPreview from './components/AssignmentPreview';
import Icon from '../../components/Applcon';
import Button from '../../components/iu/Button';

const EquipmentAssignment = () => {
  const navigate = useNavigate();
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [employeeData, setEmployeeData] = useState({});
  const [selectedAccessories, setSelectedAccessories] = useState([]);
  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isNavCollapsed, setIsNavCollapsed] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!selectedEquipment) {
      newErrors.equipment = "Debe seleccionar un equipo";
    }

    if (!employeeData?.nombre?.trim()) {
      newErrors.nombre = "El nombre es obligatorio";
    }

    if (!employeeData?.cedula?.trim()) {
      newErrors.cedula = "La cédula es obligatoria";
    } else if (!/^\d{8,10}$/?.test(employeeData?.cedula)) {
      newErrors.cedula = "La cédula debe tener entre 8 y 10 dígitos";
    }

    if (!employeeData?.correo?.trim()) {
      newErrors.correo = "El correo es obligatorio";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/?.test(employeeData?.correo)) {
      newErrors.correo = "El formato del correo no es válido";
    }

    if (!employeeData?.area?.trim()) {
      newErrors.area = "El área es obligatoria";
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleConfirmAssignment = async () => {
    if (!validateForm()) {
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate API call for assignment
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Simulate successful assignment
      console.log('Assignment completed:', {
        equipment: selectedEquipment,
        employee: employeeData,
        accessories: selectedAccessories,
        timestamp: new Date()?.toISOString()
      });

      setShowSuccessModal(true);
    } catch (error) {
      console.error('Assignment failed:', error);
      setErrors({ general: "Error al procesar la asignación. Intente nuevamente." });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    // Reset form
    setSelectedEquipment(null);
    setEmployeeData({});
    setSelectedAccessories([]);
    setErrors({});
    // Navigate to dashboard
    navigate('/main-dashboard');
  };

  const isFormValid = () => {
    return selectedEquipment && 
           employeeData?.nombre && 
           employeeData?.correo && 
           employeeData?.cedula && 
           employeeData?.area;
  };

  return (
    <div className="min-h-screen bg-background">
      <MainNavigation onToggleCollapse={setIsNavCollapsed} />
      <div className="pt-16">
        <WorkflowBreadcrumbs />
        
        <div className="container mx-auto px-4 py-6">
          {/* Page Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon name="UserPlus" size={24} className="text-primary" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">Asignación de Equipos</h1>
                  <p className="text-muted-foreground">
                    Asigne equipos disponibles a empleados con documentación completa
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  onClick={() => navigate('/main-dashboard')}
                  iconName="ArrowLeft"
                  iconPosition="left"
                >
                  Volver al Dashboard
                </Button>
                
                <Button
                  variant="default"
                  onClick={() => navigate('/equipment-history')}
                  iconName="History"
                  iconPosition="left"
                >
                  Ver Historial
                </Button>
              </div>
            </div>
          </div>

          {/* Error Display */}
          {errors?.general && (
            <div className="mb-6 p-4 bg-error/10 border border-error/20 rounded-lg">
              <div className="flex items-center space-x-2">
                <Icon name="AlertCircle" size={16} className="text-error" />
                <span className="text-sm font-medium text-error">{errors?.general}</span>
              </div>
            </div>
          )}

          {/* Progress Indicator */}
          <div className="mb-6 p-4 bg-card rounded-lg border border-border shadow-card">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`flex items-center space-x-2 ${selectedEquipment ? 'text-success' : 'text-muted-foreground'}`}>
                  <Icon name={selectedEquipment ? "CheckCircle" : "Circle"} size={16} />
                  <span className="text-sm font-medium">1. Seleccionar Equipo</span>
                </div>
                
                <Icon name="ChevronRight" size={14} className="text-muted-foreground" />
                
                <div className={`flex items-center space-x-2 ${isFormValid() ? 'text-success' : 'text-muted-foreground'}`}>
                  <Icon name={isFormValid() ? "CheckCircle" : "Circle"} size={16} />
                  <span className="text-sm font-medium">2. Información Empleado</span>
                </div>
                
                <Icon name="ChevronRight" size={14} className="text-muted-foreground" />
                
                <div className={`flex items-center space-x-2 ${selectedAccessories?.length > 0 ? 'text-success' : 'text-muted-foreground'}`}>
                  <Icon name={selectedAccessories?.length > 0 ? "CheckCircle" : "Circle"} size={16} />
                  <span className="text-sm font-medium">3. Accesorios</span>
                </div>
                
                <Icon name="ChevronRight" size={14} className="text-muted-foreground" />
                
                <div className={`flex items-center space-x-2 ${isFormValid() ? 'text-primary' : 'text-muted-foreground'}`}>
                  <Icon name="FileText" size={16} />
                  <span className="text-sm font-medium">4. Confirmar</span>
                </div>
              </div>
              
              <div className="text-sm text-muted-foreground">
                {isFormValid() ? 'Listo para asignar' : 'Complete la información requerida'}
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Equipment Selection */}
              <EquipmentSelectionPanel
                selectedEquipment={selectedEquipment}
                onEquipmentSelect={setSelectedEquipment}
              />
              
              {/* Accessory Checklist */}
              <AccessoryChecklist
                selectedAccessories={selectedAccessories}
                onAccessoriesChange={setSelectedAccessories}
              />
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Employee Information */}
              <EmployeeInformationForm
                employeeData={employeeData}
                onEmployeeDataChange={setEmployeeData}
                errors={errors}
              />
              
              {/* Assignment Preview */}
              <AssignmentPreview
                selectedEquipment={selectedEquipment}
                employeeData={employeeData}
                selectedAccessories={selectedAccessories}
                onConfirmAssignment={handleConfirmAssignment}
                isProcessing={isProcessing}
              />
            </div>
          </div>
        </div>
      </div>
      {/* Success Modal */}
      {showSuccessModal && (
        <>
          <div className="fixed inset-0 bg-black/50 z-50" onClick={handleSuccessModalClose} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-card rounded-lg border border-border shadow-modal max-w-md w-full p-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name="CheckCircle" size={32} className="text-success" />
                </div>
                
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  ¡Asignación Completada!
                </h3>
                
                <p className="text-muted-foreground mb-6">
                  El equipo ha sido asignado exitosamente a {employeeData?.nombre}. 
                  Se ha enviado el documento de entrega por correo electrónico.
                </p>
                
                <div className="space-y-3">
                  <Button
                    variant="default"
                    onClick={handleSuccessModalClose}
                    fullWidth
                    iconName="Home"
                    iconPosition="left"
                  >
                    Volver al Dashboard
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowSuccessModal(false);
                      navigate('/document-generation');
                    }}
                    fullWidth
                    iconName="FileText"
                    iconPosition="left"
                  >
                    Ver Documentos
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default EquipmentAssignment;