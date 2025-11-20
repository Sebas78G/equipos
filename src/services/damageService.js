import apiClient from '../api/apiClient';

/**
 * Fetches all damaged equipment.
 * @returns {Promise<Array>} A promise that resolves to an array of damaged equipment.
 */
export const getDanos = async () => {
    try {
        const response = await apiClient.get('/danos');
        return response.data;
    } catch (error) {
        console.error('Error fetching danos:', error);
        throw error;
    }
};

/**
 * Reports a piece of equipment as damaged by its service tag.
 * @param {string} serviceTag The service tag of the equipment to report as damaged.
 * @param {string} observaciones A description of the damage.
 * @returns {Promise<Object>} A promise that resolves to the response from the API.
 */
export const reportDamageByServiceTag = async (serviceTag, observaciones) => {
    try {
        const response = await apiClient.post(`/damage/by-tag/${serviceTag}`, { observaciones });
        return response.data;
    } catch (error) {
        console.error('Error reporting damage:', error);
        throw error;
    }
};
