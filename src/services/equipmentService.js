import apiClient from '../api/apiClient';

// Fetches all equipment from the backend
export const getEquipment = async () => {
  try {
    const response = await apiClient.get('/equipment');
    return response.data;
  } catch (error) {
    console.error('Error fetching all equipment', error);
    throw error;
  }
};

// Fetches a single piece of equipment by its prefixed ID (e.g., "pc-123", "disponible-45"). DEPRECATED.
export const getEquipmentById = async (id) => {
  try {
    const [type, numericId] = id.split('-');
    const response = await apiClient.get(`/equipment/${type}/${numericId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching equipment with id ${id}` , error);
    throw error;
  }
};

// Fetches equipment by its unique service tag.
export const getEquipmentByServiceTag = async (serviceTag) => {
  try {
    const response = await apiClient.get(`/equipment/by-tag/${serviceTag}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching equipment with service tag ${serviceTag}`, error);
    throw error;
  }
};

// Updates equipment data.
export const updateEquipment = async (serviceTag, data) => {
  try {
    const response = await apiClient.put(`/equipment/by-tag/${serviceTag}`, data);
    return response.data;
  } catch (error) {
    console.error(`Error updating equipment with service tag ${serviceTag}`, error);
    throw error;
  }
};

// This function is new and specifically handles marking equipment as damaged.
export const markAsDamaged = async (serviceTag, observaciones) => {
  try {
    const response = await apiClient.post('/danos', { serviceTag, observaciones });
    return response.data;
  } catch (error) {
    console.error(`Error marking equipment ${serviceTag} as damaged`, error);
    throw error;
  }
};
