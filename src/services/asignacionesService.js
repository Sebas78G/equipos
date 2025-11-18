import apiClient from '../api/apiClient';

const API_URL = '/asignaciones'; // Changed from /asignaciones to /assignments

/**
 * Creates a new assignment.
 * @param {object} assignmentData The data for the new assignment.
 * @returns {Promise<object>} A promise that resolves to the newly created assignment.
 */
export const createAsignacion = async (assignmentData) => {
    try {
        const response = await apiClient.post(API_URL, assignmentData);
        return response.data;
    } catch (error) {
        console.error('Error creating asignacion:', error);
        throw error;
    }
};

/**
 * Fetches an assignment by the equipment ID.
 * @param {string} equipoId The ID of the equipment.
 * @returns {Promise<object>} A promise that resolves to the assignment object, or null if not found.
 */
export const getAsignacionByEquipoId = async (equipoId) => {
    try {
        const response = await apiClient.get(`${API_URL}/equipo/${equipoId}`);
        return response.data;
    } catch (error) {
        if (error.response && error.response.status === 404) {
            return null; // Return null if no assignment is found for the equipment
        }
        console.error(`Error fetching asignacion for equipo ${equipoId}:`, error);
        throw error;
    }
};

/**
 * Fetches all assignments.
 * @returns {Promise<Array>} A promise that resolves to an array of all assignments.
 */
export const getAsignaciones = async () => {
    try {
        const response = await apiClient.get(API_URL);
        return response.data;
    } catch (error) {
        console.error('Error fetching asignaciones:', error);
        throw error;
    }
};
