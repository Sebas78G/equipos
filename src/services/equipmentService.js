import apiClient from './apiClient';

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
    return response.data;
  } catch (error) {
    console.error(`Error fetching equipment with id ${id}`, error);
    throw error;
  }
};

export const createEquipment = async (equipment) => {
  try {
    const response = await apiClient.post('/equipment', equipment);
    return response.data;
  } catch (error) {
    console.error('Error creating equipment', error);
    throw error;
  }
};

export const updateEquipment = async (id, equipment) => {
  try {
    const response = await apiClient.put(`/equipment/${id}`, equipment);
    return response.data;
  } catch (error) {
    console.error(`Error updating equipment with id ${id}`, error);
    throw error;
  }
};

export const deleteEquipment = async (id) => {
  try {
    const response = await apiClient.delete(`/equipment/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting equipment with id ${id}`, error);
    throw error;
  }
};
