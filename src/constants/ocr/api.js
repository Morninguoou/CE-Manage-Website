export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

export const API_ENDPOINTS = {
  HEALTH: '/',
  EXTRACT: '/api/ocr/extract',
}

export const TIMEOUTS = {
  BACKEND_CHECK: 5000,
  OCR_EXTRACT: 300000,
}
