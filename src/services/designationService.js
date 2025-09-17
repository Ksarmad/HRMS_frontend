import { api } from './api';

export const designationService = {
  // Get all designations
  getDesignations: async () => {
    const response = await api.get('/designations');
    return response.data;
  },

  // Get designation by ID
  getDesignation: async (id) => {
    const response = await api.get(`/designations/${id}`);
    return response.data;
  },

  // Create designation
  createDesignation: async (designationData) => {
    const response = await api.post('/designations', designationData);
    return response.data;
  },

  // Update designation
  updateDesignation: async (id, designationData) => {
    const response = await api.put(`/designations/${id}`, designationData);
    return response.data;
  },

  // Delete designation
  deleteDesignation: async (id) => {
    const response = await api.delete(`/designations/${id}`);
    return response.data;
  }
};