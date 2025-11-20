import { getDisponibles } from './disponiblesService';
import { getAsignaciones } from './asignacionesService';
import { getDanos } from './damageService';
import apiClient from '../api/apiClient';

const safeToISOString = (dateString) => {
  if (!dateString) return new Date().toISOString();
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return new Date().toISOString();
  }
  return date.toISOString();
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
    ...asignaciones.map(asig => {
      const assignmentDate = asig.fecha_asignacion ? new Date(asig.fecha_asignacion) : null;
      
      let preventiveMaintenanceISO = null;
      let physicalMaintenanceISO = null;

      if (assignmentDate && !isNaN(assignmentDate.getTime())) {
        const preventive = new Date(assignmentDate);
        preventive.setMonth(preventive.getMonth() + 3);
        preventiveMaintenanceISO = preventive.toISOString();

        const physical = new Date(assignmentDate);
        physical.setFullYear(physical.getFullYear() + 1);
        physicalMaintenanceISO = physical.toISOString();
      }

      return {
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
        preventiveMaintenanceDate: asig.preventive_maintenance_date || preventiveMaintenanceISO,
        physicalMaintenanceDate: asig.physical_maintenance_date || physicalMaintenanceISO,
      };
    }),
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
    pc: allEquipment.filter(e => e.type && (e.type.toLowerCase() === 'pc' || e.type.toLowerCase() === 'escritorio')).length,
    portatil: allEquipment.filter(e => e.type && e.type.toLowerCase() === 'portatil').length,
    tablet: allEquipment.filter(e => e.type && e.type.toLowerCase() === 'tablet').length,
    asignados: allEquipment.filter(e => e.status === 'Asignado').length,
    disponible: allEquipment.filter(e => e.status === 'Disponible').length,
    danados: allEquipment.filter(e => e.status === 'Dañado').length,
    disponiblePc: allEquipment.filter(e => e.type && (e.type.toLowerCase() === 'pc' || e.type.toLowerCase() === 'escritorio') && e.status === 'Disponible').length,
    disponiblePortatil: allEquipment.filter(e => e.type && e.type.toLowerCase() === 'portatil' && e.status === 'Disponible').length,
    disponibleTablet: allEquipment.filter(e => e.type && e.type.toLowerCase() === 'tablet' && e.status === 'Disponible').length,
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

export const updateMaintenanceDate = async (id, maintenanceType) => {
  try {
    const response = await apiClient.put(`/equipment/${id}/maintenance`, { maintenanceType });
    return response.data;
  } catch (error) {
    console.error(`Error updating ${maintenanceType} maintenance date:`, error);
    throw error;
  }
};
