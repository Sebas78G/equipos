import apiClient from '../api/apiClient.js';

// This function might be deprecated or unused, but retained for now.
export const getHistory = async () => {
  try {
    const response = await apiClient.get('/history');
    return response.data;
  } catch (error) {
    console.error('Error fetching history', error);
    throw error;
  }
};

/**
 * Fetches the complete event history for a piece of equipment using its unique service tag.
 * @param {string} serviceTag - The service tag of the equipment.
 * @returns {Promise<Object>} A promise that resolves to the history data.
 */
export const getHistoryByServiceTag = async (serviceTag) => {
  try {
    const response = await apiClient.get(`/history/by-tag/${serviceTag}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching history for equipment with service tag ${serviceTag}`, error);
    throw error;
  }
};

// Note: The function 'getHistoryByEquipmentId' has been removed to avoid confusion 
// and align with the new service_tag based architecture.
