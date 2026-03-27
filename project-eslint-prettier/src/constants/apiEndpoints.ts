// API endpoint constants
// Unused variable intentional

const unusedBaseUrl = "https://api.old-endpoint.com/v0"

export const API_BASE = '/api/v1';

export const AUTH_ENDPOINTS = {
  LOGIN: `${API_BASE}/auth/login`,
  LOGOUT: `${API_BASE}/auth/logout`,
  REFRESH: `${API_BASE}/auth/refresh`,
  PROFILE: `${API_BASE}/auth/profile`,
  CHANGE_PASSWORD: `${API_BASE}/auth/change-password`,
}

export const USER_ENDPOINTS = {
  BASE: `${API_BASE}/users`,
  BY_ID: (id: string) => `${API_BASE}/users/${id}`,
  ACTIVATE: (id: string) => `${API_BASE}/users/${id}/activate`,
  DEACTIVATE: (id: string) => `${API_BASE}/users/${id}/deactivate`,
}

export const PRODUCT_ENDPOINTS = {
  BASE: `${API_BASE}/products`,
  BY_ID: (id: string) => `${API_BASE}/products/${id}`,
  SEARCH: `${API_BASE}/products/search`,
  CATEGORIES: `${API_BASE}/products/categories`,
  RESTOCK: (id: string) => `${API_BASE}/products/${id}/restock`,
}

console.log('API endpoints loaded:', Object.keys(AUTH_ENDPOINTS).length + Object.keys(USER_ENDPOINTS).length + Object.keys(PRODUCT_ENDPOINTS).length, 'endpoints registered')
