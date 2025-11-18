import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainNavigation from 'components/ui/MainNavigation';
import WorkflowBreadcrumbs from 'components/ui/WorkflowBreadcrumbs';
import EquipmentSelectionPanel from './components/EquipmentSelectionPanel';
import EmployeeInformationForm from './components/EmployeeInformationForm';
import AccessoryChecklist from './components/AccessoryChecklist';
import AssignmentPreview from './components/AssignmentPreview';
import Button from 'components/ui/Button';
import { getDisponibles } from 'services/disponiblesService';
import { createAsignacion } from 'services/asignacionesService';

const STEPS = {
  EQUIPMENT: 1,
  EMPLOYEE: 2,
  ACCESSORIES: 3,
  CONFIRM: 4,
};

const ALL_ACCESSORIES = [
    { id: 'base', name: 'Base', type: 'Accesorio', icon: 'Desktop' },
    { id: 'guaya', name: 'Guaya', type: 'Accesorio', icon: 'Lock' },
    { id: 'mouse', name: 'Mouse', type: 'Accesorio', icon: 'Mouse' },
    { id: 'teclado', name: 'Teclado', type: 'Accesorio', icon: 'Keyboard' },
    { id: 'cargador', name: 'Cargador', type: 'Accesorio', icon: 'Plug' },
    { id: 'cable_red', name: 'Cable de red', type: 'Accesorio', icon: 'Cable' },
    { id: 'cable_poder', name: 'Cable de poder', type: 'Accesorio', icon: 'Zap' },
    { id: 'adaptador_pantalla', name: 'Adaptador de pantalla', type: 'Elemento adicional', icon: 'Monitor' },
    { id: 'adaptador_red', name: 'Adaptador de red', type: 'Elemento adicional', icon: 'Router' },
    { id: 'adaptador_multipuertos', name: 'Adaptador Multipuertos', type: 'Elemento adicional', icon: 'Usb' },
    { id: 'antena_wireless', name: 'Antena Wireless', type: 'Elemento adicional', icon: 'Wifi' },
    { id: 'base_adicional', name: 'Base adicional', type: 'Elemento adicional', icon: 'Desktop' },
    { id: 'cable_poder_adicional', name: 'Cable de poder adicional', type: 'Elemento adicional', icon: 'Zap' },
    { id: 'guaya_adicional', name: 'Guaya adicional', type: 'Elemento adicional', icon: 'Lock' },
    { id: 'pantalla_adicional', name: 'Pantalla adicional', type: 'Elemento adicional', icon: 'Monitor' },
];

const EquipmentAssignment = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(STEPS.EQUIPMENT);
  const [disponibles, setDisponibles] = useState([]);
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [employeeData, setEmployeeData] = useState({});
  const [selectedAccessories, setSelectedAccessories] = useState([]);
  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [isNavCollapsed, setIsNavCollapsed] = useState(false);

  useEffect(() => {
    const fetchDisponibles = async () => {
      try {
        const data = await getDisponibles();
        setDisponibles(data);
      } catch (error) {
        setErrors({ general: 'Error al cargar los equipos disponibles.' });
      }
    };
    fetchDisponibles();
  }, []);

  const validateStep = (step) => {
    const newErrors = {};
    switch (step) {
      case STEPS.EQUIPMENT:
        if (!selectedEquipment) newErrors.equipment = "Debe seleccionar un equipo";
        break;
      case STEPS.EMPLOYEE:
        if (!employeeData?.nombre_funcionario?.trim()) newErrors.nombre_funcionario = "El nombre es obligatorio";
        if (!employeeData?.correo?.trim()) newErrors.correo = "El correo es obligatorio";
        if (!employeeData?.area?.trim()) newErrors.area = "El área es obligatoria";
        break;
      default:
        break;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep === STEPS.EMPLOYEE) {
        const initialAccessories = ALL_ACCESSORIES
          .filter(acc => selectedEquipment && selectedEquipment[acc.id])
          .map(acc => acc.id);
        setSelectedAccessories(initialAccessories);
      }
      setCurrentStep(prev => Math.min(prev + 1, STEPS.CONFIRM));
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, STEPS.EQUIPMENT));
  };

  const handleConfirmAssignment = async () => {
    setIsProcessing(true);
    try {
      const assignmentData = {
        disponible_id: selectedEquipment.id,
        ...employeeData,
        acta: 'placeholder_acta' // Placeholder for acta data
      };

      await createAsignacion(assignmentData);

      navigate('/document-generation', {
        state: {
          selectedEquipment,
          employeeData,
          selectedAccessories,
        },
      });

    } catch (error) {
      console.error('Assignment failed:', error);
      setErrors({ general: "Error al procesar la asignación. Intente nuevamente." });
    } finally {
      setIsProcessing(false);
    }
  };
  
  const renderStepContent = () => {
    switch (currentStep) {
      case STEPS.EQUIPMENT:
        return <EquipmentSelectionPanel availableEquipment={disponibles} selectedEquipment={selectedEquipment} onEquipmentSelect={setSelectedEquipment} error={errors.equipment} />;
      case STEPS.EMPLOYEE:
        return <EmployeeInformationForm employeeData={employeeData} onEmployeeDataChange={setEmployeeData} errors={errors} />;
      case STEPS.ACCESSORIES:
        return <AccessoryChecklist selectedAccessories={selectedAccessories} onAccessoriesChange={setSelectedAccessories} allAccessories={ALL_ACCESSORIES} />;
      case STEPS.CONFIRM:
        return <AssignmentPreview selectedEquipment={selectedEquipment} employeeData={employeeData} selectedAccessories={selectedAccessories} allAccessories={ALL_ACCESSORIES}/>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <MainNavigation onToggleCollapse={setIsNavCollapsed} />
      <div className="pt-16">
        <WorkflowBreadcrumbs />
        <div className="container mx-auto px-4 py-6">
          <div className="mb-6 flex items-center justify-between">
            {/* Header */}
          </div>
          
          {errors.general && (
            <div className="mb-6 p-4 bg-error/10 border border-error/20 rounded-lg">
              <p className="text-sm text-error">{errors.general}</p>
            </div>
          )}

          <div className="bg-card p-6 rounded-lg shadow-lg">
            {renderStepContent()}
          </div>

          <div className="mt-6 flex justify-between">
            <Button variant="outline" onClick={handleBack} disabled={currentStep === STEPS.EQUIPMENT}>Atrás</Button>
            {currentStep < STEPS.CONFIRM ? (
              <Button onClick={handleNext}>Siguiente</Button>
            ) : (
              <Button onClick={handleConfirmAssignment} disabled={isProcessing}>
                {isProcessing ? 'Procesando...' : 'Confirmar y Generar Acta'}
              </Button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default EquipmentAssignment;
