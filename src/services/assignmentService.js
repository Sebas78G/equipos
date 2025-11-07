import apiClient from './apiClient';

export const getAssignments = async () => {
  try {
    const response = await apiClient.get('/assignments');
    return response.data;
  } catch (error) {
    console.error('Error fetching assignments', error);
    throw error;
  }
};

export const getAssignmentById = async (id) => {
  try {
    const response = await apiClient.get(`/assignments/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching assignment with id ${id}`, error);
    throw error;
  }
};

export const createAssignment = async (assignment) => {
  try {
    const response = await apiClient.post('/assignments', assignment);
    return response.data;
  } catch (error) {
    console.error('Error creating assignment', error);
    throw error;
  }
};

export const updateAssignment = async (id, assignment) => {
  try {
    const response = await apiClient.put(`/assignments/${id}`, assignment);
    return response.data;
  } catch (error) {
    console.error(`Error updating assignment with id ${id}`, error);
    throw error;
  }
};
