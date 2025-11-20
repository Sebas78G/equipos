import React from 'react';

const DeliveryNote = React.forwardRef(({ equipment, employee, accessories, allAccessories }, ref) => {
  const today = new Date();
  const formattedDate = today.toLocaleDateString('es-CO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  const accesoriosList = allAccessories.filter(a => a.type === 'Accesorio');
  const adicionalesList = allAccessories.filter(a => a.type === 'Elemento adicional');

  const renderAccessoryRow = (acc) => {
    const isSelected = accessories.includes(acc.id);
    return (
        <tr key={acc.id}>
            <td className="border border-black text-center">{isSelected ? 'X' : ''}</td>
            <td className="border border-black px-1">{acc.name}</td>
            <td className="border border-black px-1">{isSelected ? 'N/A' : ''}</td>
            <td className="border border-black px-1">{isSelected ? 'N/A' : ''}</td>
            <td className="border border-black px-1">{isSelected ? 'BUEN ESTADO' : ''}</td>
        </tr>
    );
  };

  const computerType = equipment.tipo?.toLowerCase() || '';

  return (
    <div ref={ref} className="p-6 bg-white text-black" style={{ width: '21cm', height: '29.7cm' }}>
      <div className="text-xs" style={{ fontFamily: 'Arial, sans-serif' }}>
        {/* Header */}
        <table className="w-full border-collapse border border-black mb-4">
            <tbody>
                <tr>
                    <td className="border-r border-black w-1/4 p-0 align-middle text-center" rowSpan="4">
                        <img src="/expreso.png" alt="Logo" className="h-16 inline-block" />
                    </td>
                    <td className="border-r border-black font-bold text-center align-middle" rowSpan="4" style={{fontSize: '16px'}}>
                       FOR ACTA DE ENTREGA DE EQUIPO
                    </td>
                    <td className="border-b border-black px-2">Código</td>
                    <td className="border-b border-black px-2 font-bold">FOR-PRY-TEC-014</td>
                </tr>
                <tr>
                    <td className="border-b border-black px-2">Versión</td>
                    <td className="border-b border-black px-2 font-bold">02</td>
                </tr>
                <tr>
                    <td className="border-b border-black px-2">Fecha</td>
                    <td className="border-b border-black px-2 font-bold">{formattedDate}</td>
                </tr>
                <tr>
                    <td className="px-2">Fecha de revisión</td>
                    <td className="px-2 font-bold">10/09/2025</td>
                </tr>
            </tbody>
        </table>

        {/* Intro */}
        <p className="mb-2 text-justify">
        Entre las partes que conforman el contrato de trabajo, de un lado la empresa EXPRESO VIAJES Y TURISMO EXPRESO SAS, representada por DIANA PAOLA CASTELLANOS PEÑA, en su condición de Gerente de Gestión Humana y del otro lado el/la Trabajador(a), <span className="font-bold">{employee.nombre_funcionario}</span> se suscribe ACTA DE ENTREGA DE EQUIPO DE COMPUTO Y COMPROMISO DE RESPONSABILIDAD
        </p>
        <p className="mb-2 text-justify">
        PRIMERO. EXPRESO VIAJES Y TURISMO y el TRABAJADOR ratifican que el TRABAJADOR le fue asignado el siguiente equipo de cómputo con sus respectivos accesorios, que se encuentran operando correctamente para el desarrollo de las actividades propias del cargo del trabajador.
        </p>

        {/* Equipment Details */}
        <div className="border-2 border-black">
            <div className="bg-blue-300 text-center font-bold"><p>Equipo Computador</p></div>
            <div className="flex justify-around">
                <span>Escritorio <span className="border-2 inline-block w-4 h-4">{computerType.includes('escritorio') ? 'X':''}</span></span>
                <span>Portátil <span className="border-2 inline-block w-4 h-4">{computerType.includes('portatil') ? 'X':''}</span></span>
                <span>Tablet <span className="border-2 inline-block w-4 h-4">{computerType.includes('tablet') ? 'X':''}</span></span>
            </div>
            <table className="w-full border-collapse border-t-2 border-black">
                <thead><tr className="bg-blue-300"><th>Marca</th><th>Referencia</th><th>Service Tag</th><th>Activo</th></tr></thead>
                <tbody><tr>
                    <td className="text-center">{equipment.marca_cpu}</td>
                    <td className="text-center">{equipment.referencia_cpu}</td>
                    <td className="text-center">{equipment.service_tag_cpu}</td>
                    <td className="text-center">{equipment.activo_cpu}</td>
                </tr></tbody>
            </table>
        </div>

        <div className="border-2 border-black mt-1">
            <div className="bg-blue-300 text-center font-bold"><p>Monitor</p></div>
            <table className="w-full border-collapse">
                <thead><tr className="bg-blue-300"><th>Marca</th><th>Referencia</th><th>Service Tag</th><th>Activo</th></tr></thead>
                <tbody><tr>
                    <td className="text-center">{equipment.marca_pantalla || 'N/A'}</td>
                    <td className="text-center">{equipment.referencia_pantalla || 'N/A'}</td>
                    <td className="text-center">{equipment.service_tag_pantalla || 'N/A'}</td>
                    <td className="text-center">{equipment.activo_pantalla || 'N/A'}</td>
                </tr></tbody>
            </table>
        </div>

        {/* Accessories */}
        <div className="border-2 border-black mt-1">
            <div className="bg-blue-300 text-center font-bold"><p>Accesorios</p></div>
            <table className="w-full border-collapse text-xs">
                <thead><tr className="bg-blue-300"><th>Check</th><th>Elemento</th><th>Marca</th><th>Referencia</th><th>Observaciones</th></tr></thead>
                <tbody>{accesoriosList.map(renderAccessoryRow)}</tbody>
            </table>
        </div>

        <div className="border-2 border-black mt-1">
            <div className="bg-blue-300 text-center font-bold"><p>Elementos adicionales</p></div>
            <table className="w-full border-collapse text-xs">
                <thead><tr className="bg-blue-300"><th>Check</th><th>Elemento</th><th>Marca</th><th>Referencia</th><th>Observaciones</th></tr></thead>
                <tbody>{adicionalesList.map(renderAccessoryRow)}</tbody>
            </table>
        </div>

        {/* Legal Text */}
        <div className="text-justify space-y-1 mt-2" style={{ fontSize: '9px' }}>
           <p>SEGUNDO. En cumplimiento a la obligación legal prevista en el Art. 58 numeral 3 del código sustantivo del trabajo y a las normativas establecida en el reglamento interno de trabajo (Art. 43 numeral 3); son deberes del TRABAJADOR conservar, cuidar y restituir en buen estado, salvo deterioro natural, los instrumentos y útiles que le hayan sido facilitados.</p>
           <p>En cumplimiento de esta obligación legar el TRABAJADOR se compromete a:</p>
           <ol className="list-decimal list-inside space-y-1 pl-4">
                <li>Velar por la conservación y aseo de su equipo y evitar riesgos físicos o de seguridad.</li>
                <li>Cuidar el equipo, asegurarlo y establecer todos los controles y acciones necesarias que garanticen su seguridad y máxima protección.</li>
                <li>Conocer el funcionamiento básico del equipo para darle un uso apropiado.</li>
                <li>Suministrar el equipo al técnico de soporte de EXPRESO VIAJES Y TURISMO mínimo una vez al año para realizarle mantenimiento preventivo.</li>
                <li>Colocar el denuncio e informar inmediatamente al área de tecnología y a su jefe inmediato en caso de que sea víctima de hurto o perdida del equipo.</li>
                <li>Informar inmediatamente a la mesa de servicio en caso de fallas en el funcionamiento del equipo o de su software (programas).</li>
                <li>Cuidar, custodiar y utilizar estos bienes en forma exclusiva para el cumplimiento de sus labores.</li>
                <li>Usar Correctamente los equipos y solo para los fines establecidos.</li>
                <li>Ano instalar ni permitir la instalación de software por personal ajeno al departamento de tecnologías de información, declaro además conocer y cumplir las normas internas actualizadas de seguridad, publicas y de gestión en todo momento.</li>
                <li>Utilizar estos bienes únicamente dentro de las instalaciones de la compañía, quedando prohibido retirarlo de la sede donde labora, salvo previa autorización.</li>
                <li>A responder económicamente por el equipo de cómputo, lo cual incluye su pérdida o daño causado por el descuido del trabajador.</li>
                <li>Reportar de forma inmediata a su jefe inmediato y a tecnología cualquier novedad que se presente con el equipo asignado.</li>
                <li>Cumplir con las políticas y lineamientos de buen uso de recursos informáticos.</li>
            </ol>
            <p>TERCERO. En cumplimiento a la obligación legal prevista en el Art. 58 numeral 3 del código sustantivo del trabajo, respecto del uso del equipo de cómputo, se prohíben las siguientes conductas:</p>
            <ol className="list-decimal list-inside space-y-1 pl-4">
                <li>Utilizar el equipo para fines diferentes a los estrictamente laborales.</li>
                <li>Instalar hardware y software no autorizado por el área de tecnología según políticas de la empresa.</li>
                <li>Realizar servicio técnico o desarmar el equipo por su cuenta o con la ayuda de terceros.</li>
                <li>Compartir las contraseñas de su equipo con terceros.</li>
                <li>Modificar las claves de administración o disco duro del equipo.</li>
            </ol>
            <p>CUARTO. INSPECCIONES PERIODICAS. EXPRESO VIAJES Y TURISMO SAS, podrá en cualquier momento efectuar una revisión o inventario respecto del equipo de cómputo asignado y sus accesorios y solicitar explicaciones sobre any novedad relacionada con los mismos. La pérdida o daño de los bienes a cargo de trabajador sin justificación razonable a juicio del empleador u cualquier incumplimiento a las obligaciones y prohibiciones aquí contempladas, será considerado falta grave.</p>
            <p>QUINTO. DEVOLUCION DEL EQUIPO DE COMPUTO. EXPRESO VIAJES Y TURISMO SAS podrá en cualquier momento solicitarle la devolución del equipo, estando el TRABAJADOR obligado a devolver el equipo a su jefe inmediato, en cualquier momento en que le sea solicitado, cuando sea trasladado de dependencia, cuando cambie de CECo y en todo caso el día de la terminación del contrato de trabajo por cualquier causa.</p>
            <p>SEXTO. COMPROMISO DE RESPONSABILIDAD. Todo daño causado al equipo por maltrato o por uso inapropiado, así como su pérdida orobo por descuido, es responsabilidad del TRABAJADOR por lo cual autoriza a EXPRESO VIAJES Y TURISMO SAS a descontar del salario la suma producto de la reparación o reposición en caso de daño, perdida o robo del equipo bajo su cargo. Igualmente, AUTORIZO a que dicho descuento se lleve a cabo de mis Cesantías, Intereses de Cesantías, Prima de Servicio, Vacaciones, Bonificaciones, Auxilio de Transporte, indemnización por despido, suma conciliatoria y/o transaccional, Comisiones, Auxilios o Beneficios Extralegales, horas extras, recargos nocturnos, dominicales o festivos, y en general cualquier concepto que deba cancelarme la Empresa al momento de mi desvinculación laboral.</p>
        </div>

        {/* Signatures */}
        <p className="mt-4 text-justify">Para Constancia se firma en Bogotá a los ___ días del mes de _________ del 2025</p>
        <table className="w-full mt-16 text-center">
            <tbody>
                <tr>
                    <td className="w-1/2">
                        <p className="font-bold">EMPLEADOR</p>
                        <div className="h-12"></div> {/* Placeholder for signature */}
                        <p className="border-t border-black mx-8 mt-2">Nombre: Diana Paola Castellanos Peña</p>
                        <p>CC. 1.015.048.354</p>
                    </td>
                    <td className="w-1/2">
                        <p className="font-bold">TRABAJADOR</p>
                        <div className="h-12"></div> {/* Placeholder for signature */}
                        <p className="border-t border-black mx-8 mt-2">Nombre: {employee.nombre_funcionario}</p>
                        <p>CC:_________________________</p>
                    </td>
                </tr>
            </tbody>
        </table>

      </div>
    </div>
  );
});

export default DeliveryNote;
