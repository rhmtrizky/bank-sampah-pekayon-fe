import api from '../../axios';

export const kelurahanReportsApi = {
  getReport: async () => {
    const response = await api.get('/reports/kelurahan');
    return response.data;
  },
};
