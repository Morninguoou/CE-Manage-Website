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

/**
 * Process and store extracted text
 */
export const processAndStore = async (text, filename, options = {}) => {
  const response = await apiClient.post('/api/ocr/store', {
    text,
    filename: filename || null,
    chunk_size: options.chunkSize || 4000,
    chunk_overlap: options.chunkOverlap || 500,
    preserve_page_boundaries: options.preservePageBoundaries !== false,
  }, {
    timeout: TIMEOUTS.OCR_EXTRACT * 2,
  })
  return response.data
}

/**
 * Get statistics about the vector database
 */
export const getVectorStatistics = async () => {
  const response = await apiClient.get('/api/vector/statistics')
  return response.data
}

/**
 * List documents in the vector database
 */
export const listDocuments = async (limit = 100, offset = 0, filename = null) => {
  const params = { limit, offset }
  if (filename) {
    params.filename = filename
  }
  const response = await apiClient.get('/api/vector/documents', { params })
  return response.data
}

/**
 * Get a specific document with its chunks
 */
export const getDocument = async (documentId) => {
  const response = await apiClient.get(`/api/vector/documents/${documentId}`)
  return response.data
}

/**
 * Delete a document by document ID
 */
export const deleteDocument = async (documentId) => {
  const response = await apiClient.delete(`/api/vector/documents/${documentId}`)
  return response.data
}

/**
 * Get other chunks (chunks without document_id)
 */
export const getOtherChunks = async (limit = 1000) => {
  const response = await apiClient.get('/api/vector/other-chunks', { params: { limit } })
  return response.data
}

/**
 * Delete all other chunks
 */
export const deleteOtherChunks = async () => {
  const response = await apiClient.delete('/api/vector/other-chunks')
  return response.data
}

/**
 * Delete a single chunk by point_id
 */
export const deleteChunk = async (pointId) => {
  const response = await apiClient.delete(`/api/vector/chunks/${pointId}`)
  return response.data
}

