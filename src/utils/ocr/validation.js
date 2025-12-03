import { ACCEPT_FILE_TYPES, MAX_FILE_SIZE } from '../../constants/ocr'

/**
 * Check if file type is supported
 */
export const isSupportedFileType = (fileType) => {
  return ACCEPT_FILE_TYPES.split(',').includes(fileType)
}

/**
 * Validate file before upload
 * @returns {Object} { valid: boolean, error: string | null }
 */
export const validateFile = (file) => {
  if (!file) {
    return { valid: false, error: 'No file selected' }
  }

  if (!isSupportedFileType(file.type)) {
    return { valid: false, error: 'Unsupported file type. Supported: JPEG, PNG, WebP, GIF, PDF' }
  }

  if (file.size > MAX_FILE_SIZE) {
    const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2)
    return { valid: false, error: `File size (${fileSizeMB}MB) exceeds maximum allowed size (4.5MB)` }
  }

  return { valid: true, error: null }
}

