import React from 'react';
import Icon from '../../../components/AppIcon';

const AssignmentPreview = ({ 
  selectedEquipment, 
  employeeData, 
  selectedAccessories, 
  allAccessories,
}) => {

  const getAccessoryDetails = (accessoryId) => {
    return allAccessories.find(acc => acc.id === accessoryId);
  };

  const mainAccessories = selectedAccessories
    .map(getAccessoryDetails)
    .filter(acc => acc && acc.type === 'Accesorio');

  const additionalAccessories = selectedAccessories
    .map(getAccessoryDetails)
    .filter(acc => acc && acc.type === 'Elemento adicional');

  if (!selectedEquipment || !employeeData?.nombre_funcionario) {
    return (
      <div className="bg-card rounded-lg border border-border shadow-card h-full">
        <div className="p-6 border-b border-border">
            <h2 className="text-lg font-semibold text-foreground">Confirmar y Finalizar</h2>
            <p className="text-sm text-muted-foreground">Revise los detalles antes de confirmar la asignación</p>
        </div>
        <div className="p-6 flex items-center justify-center h-64">
          <div className="text-center">
            <Icon name="FileX" size={48} className="text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              Complete los pasos anteriores para ver el resumen de la asignación.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg border border-border shadow-card h-full">
      <div className="p-6 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground">Confirmar y Finalizar</h2>
        <p className="text-sm text-muted-foreground">Revise los detalles antes de confirmar la asignación y generar el acta.</p>
      </div>
      <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
        {/* Employee Information */}
        <div>
          <h3 className="font-semibold text-foreground mb-3">Funcionario</h3>
          <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm p-4 border rounded-lg">
            <p><strong className='text-muted-foreground'>Nombre:</strong> {employeeData.nombre_funcionario}</p>
            <p><strong className='text-muted-foreground'>Correo:</strong> {employeeData.correo}</p>
            <p><strong className='text-muted-foreground'>Área:</strong> {employeeData.area}</p>
            {employeeData.jefe_inmediato && <p><strong className='text-muted-foreground'>Jefe Inmediato:</strong> {employeeData.jefe_inmediato}</p>}
          </div>
        </div>

        {/* Equipment Information */}
        <div>
          <h3 className="font-semibold text-foreground mb-3">Equipo</h3>
          <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm p-4 border rounded-lg">
              <p><strong className='text-muted-foreground'>Tipo:</strong> {selectedEquipment.tipo}</p>
              <p><strong className='text-muted-foreground'>Marca CPU:</strong> {selectedEquipment.marca_cpu}</p>
              <p><strong className='text-muted-foreground'>Referencia CPU:</strong> {selectedEquipment.referencia_cpu}</p>
              <p><strong className='text-muted-foreground'>Service Tag CPU:</strong> {selectedEquipment.service_tag_cpu}</p>
              {selectedEquipment.marca_pantalla && <p><strong className='text-muted-foreground'>Marca Pantalla:</strong> {selectedEquipment.marca_pantalla}</p>}
              {selectedEquipment.referencia_pantalla && <p><strong className='text-muted-foreground'>Referencia Pantalla:</strong> {selectedEquipment.referencia_pantalla}</p>}
              {selectedEquipment.service_tag_pantalla && <p><strong className='text-muted-foreground'>Service Tag Pantalla:</strong> {selectedEquipment.service_tag_pantalla}</p>}
          </div>
        </div>

        {/* Accessories */}
        <div>
          <h3 className="font-semibold text-foreground mb-3">Accesorios y Elementos Adicionales ({selectedAccessories.length})</h3>
          <div className="grid grid-cols-2 gap-x-6 text-sm p-4 border rounded-lg">
            <div>
              <h4 className="font-medium mb-2">Accesorios</h4>
              {mainAccessories.length > 0 ? (
                <ul className='space-y-1'>
                  {mainAccessories.map(acc => <li key={acc.id} className='flex items-center'><Icon name="Check" className="w-4 h-4 text-success mr-2"/>{acc.name}</li>)}
                </ul>
              ) : <p className='text-muted-foreground italic text-xs'>No se seleccionaron accesorios.</p>}
            </div>
            <div>
              <h4 className="font-medium mb-2">Elementos Adicionales</h4>
              {additionalAccessories.length > 0 ? (
                <ul className='space-y-1'>
                  {additionalAccessories.map(acc => <li key={acc.id} className='flex items-center'><Icon name="Check" className="w-4 h-4 text-success mr-2"/>{acc.name}</li>)}
                </ul>
              ) : <p className='text-muted-foreground italic text-xs'>No se seleccionaron elementos adicionales.</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignmentPreview;
