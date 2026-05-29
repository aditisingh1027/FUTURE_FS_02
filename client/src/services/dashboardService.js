import api from './api';

const dashboardService = {
  getStats: () => api.get('/dashboard/stats'),
  getCharts: () => api.get('/dashboard/charts'),
  getFollowUps: () => api.get('/dashboard/followups'),
};

export default dashboardService;
