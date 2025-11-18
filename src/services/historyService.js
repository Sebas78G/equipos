import apiClient from '../api/apiClient.js';

export const getHistory = async () => {
  try {
    const response = await apiClient.get('/history');
    return response.data;
  } catch (error) {
    console.error('Error fetching history', error);
    throw error;
  }
};

export const getHistoryByEquipmentId = async (equipmentId) => {
  try {
    const response = await apiClient.get(`/history/${equipmentId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching history for equipment with id ${equipmentId}`, error);
    throw error;
  }
};
