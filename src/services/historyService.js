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

export const getHojaDeVidaByServiceTag = async (serviceTag) => {
    try {
      const response = await apiClient.get(`/equipment/hoja-de-vida/${serviceTag}`,
      {
        responseType: 'arraybuffer',
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching hoja de vida for equipment with service tag ${serviceTag}`, error);
      throw error;
    }
  };

  

export const getActaByServiceTag = async (serviceTag) => {
    try {
        const response = await apiClient.get(`/equipment/Acta/${serviceTag}`,
        {
            responseType: 'arraybuffer',
        });
        return response.data;
    } catch (error) {
        console.error(`Error fetching acta for equipment with service tag ${serviceTag}`, error);
        throw error;
    }
};

/**
 * Fetches all actas for a piece of equipment using its unique service tag.
 * @param {string} serviceTag - The service tag of the equipment.
 * @returns {Promise<Array<Object>>} A promise that resolves to a list of actas.
 */
export const getActasByServiceTag = async (serviceTag) => {
    try {
        const response = await apiClient.get(`/equipment/actas/${serviceTag}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching actas for equipment with service tag ${serviceTag}`, error);
        throw error;
    }
};

/**
 * Fetches a specific acta by its ID.
 * @param {string} actaId - The ID of the acta.
 * @returns {Promise<Blob>} A promise that resolves to the acta file.
 */
export const getActaById = async (actaId) => {
    try {
        const response = await apiClient.get(`/equipment/acta/${actaId}`, {
            responseType: 'arraybuffer',
        });
        return response.data;
    } catch (error) {
        console.error(`Error fetching acta with ID ${actaId}`, error);
        throw error;
    }
};


