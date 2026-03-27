import { useState, useCallback } from 'react'
import { extractTextFromDocument, processAndStore } from '../../services/ocr/api'

export const useOCR = () => {
  const [extracting, setExtracting] = useState(false)
  const [storing, setStoring] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const extractText = useCallback(async (file) => {
    if (!file) {
      setError('Please select a file first')
      return
    }

    setExtracting(true)
    setError(null)
    setResult(null)

    try {
      const data = await extractTextFromDocument(file)
      setResult(data)
    } catch (err) {
      const errorMessage = err.response?.data?.detail || err.message || 'An error occurred'
      setError(errorMessage)
    } finally {
      setExtracting(false)
    }
  }, [])

  const updateResultText = useCallback((newText) => {
    setResult((prevResult) => 
      prevResult ? { ...prevResult, text: newText } : prevResult
    )
  }, [])

  const processAndStoreText = useCallback(async (text, filename, options = {}) => {
    if (!text || !text.trim()) {
      setError('No text to process')
      return
    }

    setStoring(true)
    setError(null)

    try {
      const data = await processAndStore(text, filename, options)
      setResult((prevResult) => ({
        ...(prevResult || {}),
        ...data,
        pipeline_complete: true,
      }))
    } catch (err) {
      const errorMessage = err.response?.data?.detail || err.message || 'An error occurred'
      setError(errorMessage)
    } finally {
      setStoring(false)
    }
  }, [])

  const reset = useCallback(() => {
    setResult(null)
    setError(null)
  }, [])

  return {
    extracting,
    storing,
    result,
    error,
    extractText,
    updateResultText,
    processAndStoreText,
    reset,
  }
}

