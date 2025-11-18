import React from 'react';

const DeliveryNote = ({ equipment, employee, accessories }) => {
  const mainAccessoriesList = [
    { id: 'base', name: 'Base' },
    { id: 'guaya', name: 'Guaya' },
    { id: 'mouse', name: 'Mouse' },
    { id: 'teclado', name: 'Teclado' },
    { id: 'cargador', name: 'Cargador' },
    { id: 'cable_red', name: 'Cable de red' },
    { id: 'cable_poder', name: 'Cable de poder' },
  ];

  const additionalAccessoriesList = [
    { id: 'adaptador_pantalla', name: 'Adaptador de pantalla' },
    { id: 'adaptador_red', name: 'Adaptador de red' },
    { id: 'adaptador_multipuertos', name: 'Adaptador Multipuertos' },
    { id: 'antena_wireless', name: 'Antena Wireless' },
    { id: 'base_adicional', name: 'Base adicional' },
    { id: 'cable_poder_adicional', name: 'Cable de poder adicional' },
    { id: 'guaya_adicional', name: 'Guaya adicional' },
    { id: 'pantalla_adicional', name: 'Pantalla adicional' },
  ];

  const today = new Date();
  const formattedDate = today.toLocaleDateString('es-CO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  const renderAccessoryRow = (acc, isSelected) => (
    <tr key={acc.id}>
      <td className="border px-2 py-1 text-center font-semibold">{isSelected ? 'X' : ''}</td>
      <td className="border px-2 py-1">{acc.name}</td>
      <td className="border px-2 py-1">N/A</td>
      <td className="border px-2 py-1">N/A</td>
      <td className="border px-2 py-1">{isSelected ? 'BUEN ESTADO' : ''}</td>
    </tr>
  );

  return (
    <div className="p-8 bg-white text-sm" style={{ fontFamily: 'sans-serif' }}>
      <h2 className="text-center font-bold text-lg mb-6">ACTA DE ENTREGA DE EQUIPO</h2>
      
      <div className="grid grid-cols-2 gap-x-8 mb-4">
        <div>
          <p><strong>Fecha:</strong> {formattedDate}</p>
          <p><strong>Nombre del Funcionario:</strong> {employee.nombre_funcionario}</p>
          <p><strong>Área:</strong> {employee.area}</p>
        </div>
        <div>
          <p><strong>Jefe Inmediato:</strong> {employee.jefe_inmediato || 'No especificado'}</p>
          <p><strong>Correo:</strong> {employee.correo}</p>
        </div>
      </div>
      
      <h3 className="font-bold bg-gray-200 p-1 my-2">Información del Equipo Principal ({equipment.tipo})</h3>
      <table className="w-full border-collapse border border-gray-400">
        <tbody>
          <tr>
            <td className="border p-1 font-semibold">Marca</td>
            <td className="border p-1">{equipment.marca_cpu}</td>
            <td className="border p-1 font-semibold">Referencia</td>
            <td className="border p-1">{equipment.referencia_cpu}</td>
            <td className="border p-1 font-semibold">Service Tag</td>
            <td className="border p-1">{equipment.service_tag_cpu}</td>
          </tr>
        </tbody>
      </table>

      {equipment.marca_pantalla && (
        <>
            <h3 className="font-bold bg-gray-200 p-1 my-2">Información de la Pantalla</h3>
            <table className="w-full border-collapse border border-gray-400">
                <tbody>
                <tr>
                    <td className="border p-1 font-semibold">Marca</td>
                    <td className="border p-1">{equipment.marca_pantalla}</td>
                    <td className="border p-1 font-semibold">Referencia</td>
                    <td className="border p-1">{equipment.referencia_pantalla}</td>
                    <td className="border p-1 font-semibold">Service Tag</td>
                    <td className="border p-1">{equipment.service_tag_pantalla}</td>
                </tr>
                </tbody>
            </table>
        </>
      )}

      <h3 className="font-bold bg-gray-200 p-1 my-2">Accesorios</h3>
      <table className="w-full border-collapse border border-gray-400 text-xs">
        <thead>
          <tr>
            <th className="border p-1 w-1/12">Check</th>
            <th className="border p-1 w-4/12">Elemento</th>
            <th className="border p-1 w-2/12">Marca</th>
            <th className="border p-1 w-2/12">Referencia</th>
            <th className="border p-1 w-3/12">Observaciones</th>
          </tr>
        </thead>
        <tbody>
          {mainAccessoriesList.map(acc => renderAccessoryRow(acc, accessories.includes(acc.id)))}
        </tbody>
      </table>
      
      <h3 className="font-bold bg-gray-200 p-1 my-2">Elementos adicionales</h3>
      <table className="w-full border-collapse border border-gray-400 text-xs">
        <thead>
          <tr>
            <th className="border p-1 w-1/12">Check</th>
            <th className="border p-1 w-4/12">Elemento</th>
            <th className="border p-1 w-2/12">Marca</th>
            <th className="border p-1 w-2/12">Referencia</th>
            <th className="border p-1 w-3/12">Observaciones</th>
          </tr>
        </thead>
        <tbody>
          {additionalAccessoriesList.map(acc => renderAccessoryRow(acc, accessories.includes(acc.id)))}
        </tbody>
      </table>

      <div className="mt-12">
        <p className="mb-2 text-xs">SEGUNDO. En cumplimiento a la obligación legal prevista en el Art. 58 numeral 3 del código sustantivo del trabajo, el trabajador se obliga a conservar y restituir en buen estado, salvo el deterioro natural, los equipos y herramientas que le sean facilitados para el desarrollo de sus funciones. La pérdida o daño de los mismos por dolo o culpa del trabajador dará lugar al pago del valor del elemento, previa autorización de descuento por parte del trabajador.</p>
        
        <div className="grid grid-cols-2 gap-x-16 mt-24">
            <div className="text-center">
                <div className="border-t border-black w-3/4 mx-auto"></div>
                <p className="mt-1">Firma del Funcionario</p>
                <p>C.C.</p>
            </div>
            <div className="text-center">
                <div className="border-t border-black w-3/4 mx-auto"></div>
                <p className="mt-1">Entrega</p>
                <p>IT</p>
            </div>
        </div>
      </div>

    </div>
  );
};

export default DeliveryNote;
