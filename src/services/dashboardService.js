import { getDisponibles } from './disponiblesService';
import { getAsignaciones } from './asignacionesService';
import { getDanos } from './damageService';

const safeToISOString = (dateString) => {
  if (!dateString) return new Date().toISOString();
  const date = new Date(dateString);
  return isNaN(date) ? new Date().toISOString() : date.toISOString();
};

// Transforms the raw data from services into a structured format for the dashboard.
const transformDataForDashboard = (disponibles, asignaciones, danos) => {
  const allEquipment = [
    ...disponibles.map(equipo => ({
      ...equipo,
      id: `disponible-${equipo.id}`,
      type: equipo.tipo,
      brand: equipo.marca,
      model: equipo.modelo,
      serviceTag: equipo.service_tag_cpu,
      employeeName: 'N/A',
      area: 'N/A',
      status: 'Disponible',
      lastUpdated: safeToISOString(equipo.last_update),
    })),
    ...asignaciones.map(asig => ({
      ...asig,
      id: `asignacion-${asig.id}`,
      type: asig.tipo,
      brand: asig.marca,
      model: asig.modelo,
      serviceTag: asig.service_tag_cpu,
      employeeName: asig.nombre_funcionario,
      area: asig.area,
      status: 'Asignado',
      lastUpdated: safeToISOString(asig.fecha_asignacion),
    })),
    ...danos.map(dano => ({
      ...dano,
      id: `dano-${dano.id}`,
      type: dano.tipo,
      brand: dano.marca,
      model: dano.modelo,
      serviceTag: dano.service_tag_cpu,
      employeeName: 'N/A',
      area: 'N/A',
      status: 'Dañado',
      lastUpdated: safeToISOString(dano.fecha_reporte),
    })),
  ];

  const counts = {
    total: allEquipment.length,
    pc: allEquipment.filter(e => e.type.toLowerCase() === 'pc' || e.type.toLowerCase() === 'escritorio').length,
    portatil: allEquipment.filter(e => e.type.toLowerCase() === 'portatil').length,
    tablet: allEquipment.filter(e => e.type.toLowerCase() === 'tablet').length,
    asignados: allEquipment.filter(e => e.status === 'Asignado').length,
    disponible: allEquipment.filter(e => e.status === 'Disponible').length,
    danados: allEquipment.filter(e => e.status === 'Dañado').length,
  };

  return { allEquipment, counts };
};

/**
 * Fetches all necessary data for the main dashboard, processes it, and returns it.
 * @returns {Promise<Object>} A promise that resolves to an object containing recent activity and dashboard counts.
 */
export const getDashboardData = async () => {
  try {
    const [disponibles, asignaciones, danos] = await Promise.all([
      getDisponibles(),
      getAsignaciones(),
      getDanos(), // Fetch a list of damaged equipment
    ]);

    const { allEquipment, counts } = transformDataForDashboard(disponibles, asignaciones, danos);

    return {
      recentActivity: allEquipment,
      dashboardCounts: counts,
    };
  } catch (error) {
    console.error('Error fetching or processing dashboard data:', error);
    throw error;
  }
};
