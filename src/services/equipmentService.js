import apiClient from '../api/apiClient.js';

export const getEquipment = async () => {
  try {
    const response = await apiClient.get('/equipment');
    return response.data;
  } catch (error) {
    console.error('Error fetching equipment', error);
    throw error;
  }
};

export const getEquipmentById = async (id) => {
  try {
    const response = await apiClient.get(`/equipment/${id}`);
    // The API returns data in a mix of a top-level object and a nested 'equipment' object.
    // We merge them to create a single, flat object for the form.
    const mergedData = { ...response.data, ...response.data.equipment };
    return mergedData;
  } catch (error) {
    console.error(`Error fetching equipment with id ${id}`, error);
    throw error;
  }
};

export const updateEquipment = async (id, equipmentData) => {
  try {
    const response = await apiClient.put(`/equipment/${id}`, equipmentData);
    return response.data;
  } catch (error) {
    console.error(`Error updating equipment with id ${id}`, error);
    throw error;
  }
};
