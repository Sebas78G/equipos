import apiClient from '../api/apiClient';

const API_URL = '/disponibles'; // Corrected API endpoint

/**
 * Fetches all available equipment.
 * @returns {Promise<Array>} A promise that resolves to an array of available equipment.
 */
export const getDisponibles = async () => {
    try {
        // The endpoint for all equipment is the base one
        const response = await apiClient.get(API_URL);
        return response.data;
    } catch (error) {
        console.error('Error fetching disponibles:', error);
        throw error;
    }
};

/**
 * Fetches a single available equipment by its ID.
 * @param {string} id - The ID of the equipment to fetch.
 * @returns {Promise<Object>} A promise that resolves to the equipment object.
 */
export const getDisponibleById = async (id) => {
    try {
        // The endpoint for a single equipment is /{id}
        const response = await apiClient.get(`/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching disponible with id ${id}:`, error);
        throw error;
    }
};
