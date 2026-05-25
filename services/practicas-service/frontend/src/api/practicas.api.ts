import { api } from './client';

/**
 * Endpoints del módulo de prácticas
 */
export const practicasAPI = {
  // Dashboard
  getDashboardSummary: () => api.get('/dashboard/super-admin/summary'),

  // Agreements
  getAgreements: () => api.get('/agreements'),
  getMyAgreements: () => api.get('/agreements/me'),
  getAgreement: (id: string | number) => api.get(`/agreements/${id}`),
  createAgreement: (data: any) => api.post('/agreements', data),
  updateAgreement: (id: string | number, data: any) => api.patch(`/agreements/${id}`, data),
  approveAgreement: (id: string | number) => api.patch(`/agreements/${id}/approve-practices`),
  approvePrelocationAgreement: (id: string | number) => api.patch(`/agreements/${id}/approve-prelocalization`),
  rejectAgreement: (id: string | number) => api.patch(`/agreements/${id}/reject`),

  // Students
  getStudents: () => api.get('/students'),
  getMyStudent: () => api.get('/students/me'),
  createStudentProfile: (data: any) => api.post('/students/profile', data),
  updateStudentProfile: (data: any) => api.patch('/students/me', data),

  // Companies
  getCompanies: () => api.get('/companies'),
  getMyCompany: () => api.get('/companies/me'),
  createCompanyProfile: (data: any) => api.post('/companies/profile', data),
  updateCompanyProfile: (data: any) => api.patch('/companies/me', data),

  // Vacancies
  getVacancies: () => api.get('/vacancies'),
  getVacancy: (id: string | number) => api.get(`/vacancies/${id}`),
  getVacanciesByAgreement: (agreementId: string | number) => api.get(`/vacancies/agreement/${agreementId}`),
  createVacancy: (agreementId: string | number, data: any) =>
    api.post(`/vacancies/${agreementId}`, data),
  toggleVacancyStatus: (vacancyId: string | number) =>
    api.patch(`/vacancies/${vacancyId}/toggle`),

  // Requests
  getRequests: () => api.get('/requests'),
  getMyRequests: () => api.get('/requests/me'),
  applyVacancy: (vacancyId: string | number) =>
    api.post('/requests/apply', { vacancyId }),
  approveRequest: (id: string | number) => api.patch(`/requests/${id}/approve`),
  rejectRequest: (id: string | number) => api.patch(`/requests/${id}/reject`),

  // Prelocalization Calls
  getCalls: () => api.get('/prelocalization/calls'),
  getCall: (id: string | number) => api.get(`/prelocalization/calls/${id}`),
  createCall: (data: any) => api.post('/prelocalization/calls', data),
  closeCall: (id: string | number) => api.patch(`/prelocalization/calls/${id}/close`),

  // Reference data
  getCareers: () => api.get('/careers'),
  getMunicipalities: () => api.get('/municipalities'),
  getPublicVacancies: () => api.get('/public/vacancies'),

  // Ranking
  getRanking: (callId: string | number) =>
    api.get(`/prelocalization/calls/${callId}/ranking`),
  createRankingEntry: (callId: string | number, data: any) =>
    api.post(`/prelocalization/calls/${callId}/ranking`, data),
  removeRankingEntry: (callId: string | number, rankingId: string | number) =>
    api.delete(`/prelocalization/calls/${callId}/ranking/${rankingId}`),

  // Results
  getResults: () => api.get('/prelocalization/results/me'),
  getCallResults: (callId: string | number) =>
    api.get(`/prelocalization/calls/${callId}/results`),

  // Assignments
  getAssignments: (callId: string | number) =>
    api.get(`/prelocalization/calls/${callId}/assignments`),
  assignStudent: (callId: string | number, vacancyId: string | number) =>
    api.post(`/prelocalization/calls/${callId}/assignments/${vacancyId}`),
};
