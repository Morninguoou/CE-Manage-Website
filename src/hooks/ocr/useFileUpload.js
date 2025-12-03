import { useState, useRef, useCallback } from 'react'
import { validateFile } from '../../utils/ocr'

export const useFileUpload = () => {
  const [file, setFile] = useState(null)
  const [fileUrl, setFileUrl] = useState(null)
  const [fileError, setFileError] = useState(null)
  const fileInputRef = useRef(null)

  const resetFile = useCallback(() => {
    if (fileUrl) {
      URL.revokeObjectURL(fileUrl)
    }
    setFileUrl(null)
    setFile(null)
    setFileError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [fileUrl])

  const handleFileChange = useCallback((e) => {
    const selectedFile = e.target.files[0]
    if (!selectedFile) return

    setFileError(null)

    const validation = validateFile(selectedFile)
    if (!validation.valid) {
      setFileError(validation.error)
      resetFile()
      return
    }

    if (fileUrl) {
      URL.revokeObjectURL(fileUrl)
    }
    setFile(selectedFile)
    const url = URL.createObjectURL(selectedFile)
    setFileUrl(url)
  }, [fileUrl, resetFile])

  return {
    file,
    fileUrl,
    fileInputRef,
    fileError,
    handleFileChange,
    resetFile,
  }
}

