import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor: attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('ks_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('ks_token');
      localStorage.removeItem('ks_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

// ─── AUTH ─────────────────────────────────────────────────────────────────────
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

// ─── EMPLOYEES ────────────────────────────────────────────────────────────────
export const employeesAPI = {
  getDemoEmployees: () => api.get('/employees/demo'),
  getById: (id) => api.get(`/employees/${id}`),
  getDashboard: (id) => api.get(`/employees/${id}/dashboard`),
  getAll: (params) => api.get('/employees/demo', { params }),
};

// ─── ASSESSMENTS & ADAPTIVE QUIZ ──────────────────────────────────────────────
export const assessmentAPI = {
  // CRITICAL RULE: Starts fresh diagnostic attempt in PostgreSQL on every Enter Employee click
  startDiagnostic: (employeeId) => api.post('/assessments/start-diagnostic', { employeeId }),
  submitAnswer: (attemptId, questionId, selectedOptionId, responseTimeSeconds = 0) =>
    api.post(`/assessments/${attemptId}/answer`, { questionId, selectedOptionId, responseTimeSeconds }),
  submitAssessment: (attemptId, answers) =>
    api.post(`/assessments/${attemptId}/submit`, { answers }),
  getResult: (attemptId) => api.get(`/assessments/results/${attemptId}`),
  getAll: (params) => api.get('/assessments', { params }),
};

// ─── COMPETENCIES & GAPS ──────────────────────────────────────────────────────
export const competenciesAPI = {
  getByEmployee: (employeeId) => api.get(`/competencies/employee/${employeeId}`),
  getSkillGaps: (employeeId) => api.get(`/competencies/gaps/${employeeId}`),
};

// ─── COURSES ──────────────────────────────────────────────────────────────────
export const courseAPI = {
  getAll: (params) => api.get('/courses', { params }),
  getById: (id) => api.get(`/courses/${id}`),
  enroll: (id, employeeId) => api.post(`/courses/${id}/enroll`, null, { params: { employee_id: employeeId } }),
};

// ─── LEARNING PATHS & RECOMMENDATIONS ─────────────────────────────────────────
export const learningPathsAPI = {
  getRecommendations: (employeeId) => api.get(`/learning-paths/recommendations/${employeeId}`),
  getEmployeePath: (employeeId) => api.get(`/learning-paths/employee/${employeeId}`),
  refresh: (employeeId) => api.post(`/learning-paths/employee/${employeeId}/refresh`),
};

// ─── VIRTUAL LABS ─────────────────────────────────────────────────────────────
export const labsAPI = {
  getAll: () => api.get('/labs'),
  getById: (id) => api.get(`/labs/${id}`),
  submit: (id, employeeId, answers, telemetry = {}) =>
    api.post(`/labs/${id}/submit`, { employeeId, answers, telemetry }),
};

// ─── DIGITAL PASSPORT ─────────────────────────────────────────────────────────
export const passportAPI = {
  getByEmployee: (employeeId) => api.get(`/passport/${employeeId}`),
};

// ─── LEARNING STREAK ──────────────────────────────────────────────────────────
export const streakAPI = {
  getByEmployee: (employeeId) => api.get(`/streak/${employeeId}`),
};

// ─── LEADERBOARD ──────────────────────────────────────────────────────────────
export const leaderboardAPI = {
  getAll: (params) => api.get('/leaderboard', { params }),
};

// ─── FUTURE ROLE SIMULATOR ────────────────────────────────────────────────────
export const futureRolesAPI = {
  simulate: (data) => api.post('/future-roles/simulate', data),
};

// ─── DOCUMENTS & RAG ──────────────────────────────────────────────────────────
export const documentAPI = {
  upload: (formData) => api.post('/documents/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  getAll: (params) => api.get('/documents', { params }),
};

// ─── AI MCQ GENERATOR & REVIEW ────────────────────────────────────────────────
export const mcqsAPI = {
  generate: (config) => api.post('/mcqs/generate', config),
  getAll: (params) => api.get('/mcqs', { params }),
  updateStatus: (id, status, feedback) => api.patch(`/mcqs/${id}/status`, { status, feedback }),
};

// ─── COMMUNITY DISCUSSIONS ────────────────────────────────────────────────────
export const communityAPI = {
  getDiscussions: (params) => api.get('/community/discussions', { params }),
  createDiscussion: (data) => api.post('/community/discussions', data),
  reply: (id, data) => api.post(`/community/discussions/${id}/reply`, data),
};

// ─── WORKFORCE INTELLIGENCE (ADMIN) ───────────────────────────────────────────
export const workforceAPI = {
  getAnalytics: () => api.get('/workforce/analytics'),
};

// ─── AI LEARNING ASSISTANT ────────────────────────────────────────────────────
export const assistantAPI = {
  chat: (data) => api.post('/assistant/chat', data),
};

// ─── NOTIFICATIONS ────────────────────────────────────────────────────────────
export const notificationAPI = {
  getAll: () => api.get('/notifications'),
  markRead: (id) => api.patch(`/notifications/${id}/read`),
};

// ─── INTEGRATIONS ─────────────────────────────────────────────────────────────
export const integrationsAPI = {
  getIgotStatus: () => api.get('/integrations/igot/status'),
};

// ─── GROQ AI INTEGRATION ──────────────────────────────────────────────────────
export const aiAPI = {
  generateAssessment: (payload) => api.post('/ai/generate-assessment', payload),
};

