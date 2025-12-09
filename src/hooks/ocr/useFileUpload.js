import { useState, useRef, useCallback, useEffect } from 'react'
import { validateFile } from '../../utils/ocr'

export const useFileUpload = () => {
  const [file, setFile] = useState(null)
  const [fileUrl, setFileUrl] = useState(null)
  const [fileError, setFileError] = useState(null)
  const fileInputRef = useRef(null)
  const fileUrlRef = useRef(null)

  useEffect(() => {
    fileUrlRef.current = fileUrl
  }, [fileUrl])

  const resetFile = useCallback(() => {
    if (fileUrlRef.current) {
      URL.revokeObjectURL(fileUrlRef.current)
    }
    setFileUrl(null)
    setFile(null)
    setFileError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [])

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

    if (fileUrlRef.current) {
      URL.revokeObjectURL(fileUrlRef.current)
    }
    setFile(selectedFile)
    const url = URL.createObjectURL(selectedFile)
    setFileUrl(url)
  }, [resetFile])

  return {
    file,
    fileUrl,
    fileInputRef,
    fileError,
    handleFileChange,
    resetFile,
  }
}

