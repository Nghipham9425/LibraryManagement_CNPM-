import api from './index';

const settingsAPI = {
  // Get all settings
  getAll: async () => {
    const response = await api.get('/settings');
    return response.data;
  },

  // Get setting by key
  getByKey: async (key) => {
    const response = await api.get(`/settings/${key}`);
    return response.data;
  },

  // Update setting value
  update: async (key, value) => {
    const response = await api.put(`/settings/${key}`, { value });
    return response.data;
  },
};

export default settingsAPI;
