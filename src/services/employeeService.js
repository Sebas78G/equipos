import apiClient from './apiClient';

export const getEmployees = async () => {
  try {
    const response = await apiClient.get('/employees');
    return response.data;
  } catch (error) {
    console.error('Error fetching employees', error);
    throw error;
  }
};

export const getEmployeeById = async (id) => {
  try {
    const response = await apiClient.get(`/employees/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching employee with id ${id}`, error);
    throw error;
  }
};

export const createEmployee = async (employee) => {
  try {
    const response = await apiClient.post('/employees', employee);
    return response.data;
  } catch (error) {
    console.error('Error creating employee', error);
    throw error;
  }
};

export const updateEmployee = async (id, employee) => {
  try {
    const response = await apiClient.put(`/employees/${id}`, employee);
    return response.data;
  } catch (error) {
    console.error(`Error updating employee with id ${id}`, error);
    throw error;
  }
};

export const deleteEmployee = async (id) => {
  try {
    const response = await apiClient.delete(`/employees/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting employee with id ${id}`, error);
    throw error;
  }
};
