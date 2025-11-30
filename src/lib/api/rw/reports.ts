import api from '../../axios';

export const rwReportsApi = {
  getReport: async () => {
    const response = await api.get('/reports/rw');
    return response.data;
  },
};
