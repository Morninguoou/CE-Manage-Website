import { useState, useCallback } from 'react'
import { extractTextFromDocument } from '../../services/ocr/api'

export const useOCR = () => {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const extractText = useCallback(async (file) => {
    if (!file) {
      setError('Please select a file first')
      return
    }

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const data = await extractTextFromDocument(file)
      setResult(data)
    } catch (err) {
      const errorMessage = err.response?.data?.detail || err.message || 'An error occurred'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [])

  const reset = useCallback(() => {
    setResult(null)
    setError(null)
  }, [])

  return {
    loading,
    result,
    error,
    extractText,
    reset,
  }
}

