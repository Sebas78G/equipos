import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const EmployeeInformationForm = ({ employeeData, onEmployeeDataChange, errors }) => {
  const [formData, setFormData] = useState({
    nombre_funcionario: employeeData?.nombre_funcionario || "",
    area: employeeData?.area || "",
    correo: employeeData?.correo || "",
    jefe_inmediato: employeeData?.jefe_inmediato || "",
  });

  const areaOptions = [
    { value: "", label: "Seleccionar área" },
    { value: "administracion", label: "Administración" },
    { value: "contabilidad", label: "Contabilidad" },
    { value: "recursos_humanos", label: "Recursos Humanos" },
    { value: "tecnologia", label: "Tecnología" },
    { value: "ventas", label: "Ventas" },
    { value: "marketing", label: "Marketing" },
    { value: "operaciones", label: "Operaciones" },
    { value: "atencion_cliente", label: "Atención al Cliente" },
    { value: "logistica", label: "Logística" },
    { value: "turismo", label: "Turismo" }
  ];

  const handleInputChange = (field, value) => {
    const updatedData = { ...formData, [field]: value };
    setFormData(updatedData);
    onEmployeeDataChange(updatedData);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex?.test(email);
  };

  return (
    <div className="bg-card rounded-lg border border-border shadow-card h-full">
      <div className="p-6 border-b border-border">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
            <Icon name="User" size={20} className="text-accent" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Información del Funcionario</h2>
            <p className="text-sm text-muted-foreground">Datos del funcionario para la asignación</p>
          </div>
        </div>
      </div>
      <div className="p-6">
        <form className="space-y-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Nombre Completo"
                type="text"
                placeholder="Ingrese el nombre completo"
                value={formData?.nombre_funcionario}
                onChange={(e) => handleInputChange('nombre_funcionario', e?.target?.value)}
                error={errors?.nombre_funcionario}
                required
              />
              <Input
                label="Correo Electrónico"
                type="email"
                placeholder="funcionario@expresoviajes.com"
                value={formData?.correo}
                onChange={(e) => handleInputChange('correo', e?.target?.value)}
                error={errors?.correo}
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                    label="Área de Trabajo"
                    options={areaOptions}
                    value={formData?.area}
                    onChange={(value) => handleInputChange('area', value)}
                    error={errors?.area}
                    required
                    searchable
                />
                <Input
                    label="Jefe Inmediato"
                    type="text"
                    placeholder="Ingrese el nombre del jefe inmediato"
                    value={formData?.jefe_inmediato}
                    onChange={(e) => handleInputChange('jefe_inmediato', e?.target?.value)}
                    error={errors?.jefe_inmediato}
                />
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-medium text-foreground">Estado de Validación</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Icon 
                  name={formData?.nombre_funcionario ? "CheckCircle" : "Circle"} 
                  size={16} 
                  className={formData?.nombre_funcionario ? "text-success" : "text-muted-foreground"}
                />
                <span className={`text-sm ${formData?.nombre_funcionario ? "text-success" : "text-muted-foreground"}`}>
                  Nombre completo
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon 
                  name={validateEmail(formData?.correo) ? "CheckCircle" : "Circle"} 
                  size={16} 
                  className={validateEmail(formData?.correo) ? "text-success" : "text-muted-foreground"}
                />
                <span className={`text-sm ${validateEmail(formData?.correo) ? "text-success" : "text-muted-foreground"}`}>
                  Correo electrónico válido
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon 
                  name={formData?.area ? "CheckCircle" : "Circle"} 
                  size={16} 
                  className={formData?.area ? "text-success" : "text-muted-foreground"}
                />
                <span className={`text-sm ${formData?.area ? "text-success" : "text-muted-foreground"}`}>
                  Área de trabajo seleccionada
                </span>
              </div>
            </div>
          </div>

          {formData?.nombre_funcionario && formData?.correo && formData?.area && (
            <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
              <div className="flex items-center space-x-2 mb-3">
                <Icon name="Info" size={16} className="text-primary" />
                <span className="text-sm font-medium text-primary">Resumen del Funcionario</span>
              </div>
              <div className="text-sm text-foreground space-y-1">
                <p><span className="font-medium">Nombre:</span> {formData?.nombre_funcionario}</p>
                <p><span className="font-medium">Área:</span> {areaOptions?.find(opt => opt?.value === formData?.area)?.label}</p>
                <p><span className="font-medium">Correo:</span> {formData?.correo}</p>
                {formData?.jefe_inmediato && (
                  <p><span className="font-medium">Jefe Inmediato:</span> {formData.jefe_inmediato}</p>
                )}
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default EmployeeInformationForm;
