import axios from 'axios'
import { API_BASE_URL, TIMEOUTS } from '../../constants/ocr'

/**
 * Centralized API client instance
 */
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: TIMEOUTS.OCR_EXTRACT,
})

/**
 * Health check endpoint
 */
export const checkBackendHealth = async () => {
  try {
    await apiClient.get('/', {
      timeout: TIMEOUTS.BACKEND_CHECK,
    })
    return 'connected'
  } catch {
    return 'disconnected'
  }
}

/**
 * Extract text from document using OCR
 */
export const extractTextFromDocument = async (file) => {
  const formData = new FormData()
  formData.append('file', file)
  
  const response = await apiClient.post('/api/ocr/extract', formData)
  return response.data
}

