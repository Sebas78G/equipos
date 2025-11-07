import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const EmployeeInformationForm = ({ employeeData, onEmployeeDataChange, errors }) => {
  const [formData, setFormData] = useState({
    nombre: employeeData?.nombre || "",
    area: employeeData?.area || "",
    cedula: employeeData?.cedula || "",
    correo: employeeData?.correo || "",
    telefono: employeeData?.telefono || "",
    cargo: employeeData?.cargo || "",
    fechaIngreso: employeeData?.fechaIngreso || ""
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

  const cargoOptions = [
    { value: "", label: "Seleccionar cargo" },
    { value: "gerente", label: "Gerente" },
    { value: "coordinador", label: "Coordinador" },
    { value: "analista", label: "Analista" },
    { value: "asistente", label: "Asistente" },
    { value: "especialista", label: "Especialista" },
    { value: "supervisor", label: "Supervisor" },
    { value: "ejecutivo", label: "Ejecutivo" },
    { value: "tecnico", label: "Técnico" },
    { value: "consultor", label: "Consultor" },
    { value: "director", label: "Director" }
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

  const validateCedula = (cedula) => {
    const cedulaRegex = /^\d{8,10}$/;
    return cedulaRegex?.test(cedula);
  };

  return (
    <div className="bg-card rounded-lg border border-border shadow-card h-full">
      <div className="p-6 border-b border-border">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
            <Icon name="User" size={20} className="text-accent" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Información del Empleado</h2>
            <p className="text-sm text-muted-foreground">Datos del empleado para la asignación</p>
          </div>
        </div>
      </div>
      <div className="p-6">
        <form className="space-y-6">
          {/* Información Personal */}
          <div className="space-y-4">
            <h3 className="text-md font-medium text-foreground flex items-center space-x-2">
              <Icon name="UserCircle" size={16} />
              <span>Información Personal</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Nombre Completo"
                type="text"
                placeholder="Ingrese el nombre completo"
                value={formData?.nombre}
                onChange={(e) => handleInputChange('nombre', e?.target?.value)}
                error={errors?.nombre}
                required
              />

              <Input
                label="Número de Cédula"
                type="text"
                placeholder="Ej: 12345678"
                value={formData?.cedula}
                onChange={(e) => handleInputChange('cedula', e?.target?.value)}
                error={errors?.cedula}
                required
                description="Solo números, entre 8 y 10 dígitos"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Correo Electrónico"
                type="email"
                placeholder="empleado@expresoviajes.com"
                value={formData?.correo}
                onChange={(e) => handleInputChange('correo', e?.target?.value)}
                error={errors?.correo}
                required
                description="Se enviará el documento de entrega a este correo"
              />

              <Input
                label="Teléfono"
                type="tel"
                placeholder="Ej: 3001234567"
                value={formData?.telefono}
                onChange={(e) => handleInputChange('telefono', e?.target?.value)}
                error={errors?.telefono}
              />
            </div>
          </div>

          {/* Información Laboral */}
          <div className="space-y-4">
            <h3 className="text-md font-medium text-foreground flex items-center space-x-2">
              <Icon name="Building" size={16} />
              <span>Información Laboral</span>
            </h3>
            
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

              <Select
                label="Cargo"
                options={cargoOptions}
                value={formData?.cargo}
                onChange={(value) => handleInputChange('cargo', value)}
                error={errors?.cargo}
                required
                searchable
              />
            </div>

            <Input
              label="Fecha de Ingreso"
              type="date"
              value={formData?.fechaIngreso}
              onChange={(e) => handleInputChange('fechaIngreso', e?.target?.value)}
              error={errors?.fechaIngreso}
              description="Fecha de ingreso a la empresa"
            />
          </div>

          {/* Validación en Tiempo Real */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-foreground">Estado de Validación</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Icon 
                  name={formData?.nombre ? "CheckCircle" : "Circle"} 
                  size={16} 
                  className={formData?.nombre ? "text-success" : "text-muted-foreground"}
                />
                <span className={`text-sm ${formData?.nombre ? "text-success" : "text-muted-foreground"}`}>
                  Nombre completo
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Icon 
                  name={validateCedula(formData?.cedula) ? "CheckCircle" : "Circle"} 
                  size={16} 
                  className={validateCedula(formData?.cedula) ? "text-success" : "text-muted-foreground"}
                />
                <span className={`text-sm ${validateCedula(formData?.cedula) ? "text-success" : "text-muted-foreground"}`}>
                  Cédula válida
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

          {/* Resumen de Datos */}
          {formData?.nombre && formData?.correo && formData?.area && (
            <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
              <div className="flex items-center space-x-2 mb-3">
                <Icon name="Info" size={16} className="text-primary" />
                <span className="text-sm font-medium text-primary">Resumen del Empleado</span>
              </div>
              <div className="text-sm text-foreground space-y-1">
                <p><span className="font-medium">Nombre:</span> {formData?.nombre}</p>
                <p><span className="font-medium">Área:</span> {areaOptions?.find(opt => opt?.value === formData?.area)?.label}</p>
                <p><span className="font-medium">Correo:</span> {formData?.correo}</p>
                {formData?.cargo && (
                  <p><span className="font-medium">Cargo:</span> {cargoOptions?.find(opt => opt?.value === formData?.cargo)?.label}</p>
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