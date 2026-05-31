import api from './api';

const leadService = {
  getLeads: (params) => api.get('/leads', { params }),
  getLeadById: (id) => api.get(`/leads/${id}`),
  createLead: (data) => api.post('/leads', data),
  updateLead: (id, data) => api.put(`/leads/${id}`, data),
  deleteLead: (id) => api.delete(`/leads/${id}`),
  addNote: (id, content) => api.post(`/leads/${id}/notes`, { content }),
  getActivities: (id) => api.get(`/leads/${id}/activities`),
};

export default leadService;
