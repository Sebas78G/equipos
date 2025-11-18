import apiClient from '../api/apiClient';

const API_URL = '/danos';

/**
 * Fetches all damaged equipment.
 * @returns {Promise<Array>} A promise that resolves to an array of damaged equipment.
 */
export const getDanos = async () => {
    try {
        const response = await apiClient.get(API_URL);
        return response.data;
    } catch (error) {
        console.error('Error fetching danos:', error);
        throw error;
    }
};

/**
 * Reports a piece of equipment as damaged by its service tag.
 * @param {string} serviceTag The service tag of the equipment to report as damaged.
 * @returns {Promise<Object>} A promise that resolves to the response from the API.
 */
export const reportDamageByServiceTag = async (serviceTag) => {
    try {
        const response = await apiClient.post(API_URL, { service_tag: serviceTag });
        return response.data;
    } catch (error) {
        console.error('Error reporting damage:', error);
        throw error;
    }
};
