import apiClient from '../api/apiClient';

/**
 * Fetches a single piece of equipment by its service tag from any table.
 * @param {string} serviceTag The service tag of the equipment.
 * @returns {Promise<Object>} A promise that resolves to the equipment data.
 */
export const getEquipmentByServiceTag = async (serviceTag) => {
  try {
    const response = await apiClient.get(`/equipment/by-tag/${serviceTag}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching equipment by service tag:', error);
    throw error;
  }
};

/**
 * Repairs a piece of equipment and moves it to the 'disponibles' table.
 * @param {string} serviceTag The service tag of the equipment to repair.
 * @param {string} repair_notes Mandatory notes about the repair.
 * @returns {Promise<Object>} A promise that resolves to the response from the API.
 */
export const repairEquipment = async (serviceTag, repair_notes) => {
    try {
        if (!repair_notes) {
            throw new Error('Repair notes are mandatory.');
        }
        const response = await apiClient.post(`/equipment/repair/${serviceTag}`, { repair_notes });
        return response.data;
    } catch (error) {
        console.error('Error repairing equipment:', error);
        throw error;
    }
};
