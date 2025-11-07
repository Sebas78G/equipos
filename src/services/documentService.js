import apiClient from './apiClient';

export const getDocuments = async () => {
  try {
    const response = await apiClient.get('/documents');
    return response.data;
  } catch (error) {
    console.error('Error fetching documents', error);
    throw error;
  }
};

export const getDocumentById = async (id) => {
  try {
    const response = await apiClient.get(`/documents/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching document with id ${id}`, error);
    throw error;
  }
};

export const createDocument = async (document) => {
  try {
    const response = await apiClient.post('/documents', document);
    return response.data;
  } catch (error) {
    console.error('Error creating document', error);
    throw error;
  }
};
