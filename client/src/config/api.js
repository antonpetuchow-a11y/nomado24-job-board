const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

export const API_ENDPOINTS = {
  base: API_BASE_URL,
  auth: `${API_BASE_URL}/api/auth`,
  admin: `${API_BASE_URL}/api/admin`,
  jobs: `${API_BASE_URL}/api/jobs`,
  users: `${API_BASE_URL}/api/users`,
  companies: `${API_BASE_URL}/api/companies`,
  applications: `${API_BASE_URL}/api/applications`,
  uploads: `${API_BASE_URL}/uploads`
};

export default API_ENDPOINTS; 