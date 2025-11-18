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
