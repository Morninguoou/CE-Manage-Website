export const FILE_TYPES = {
  PDF: 'application/pdf',
  PNG: 'image/png',
  JPEG: 'image/jpeg',
  JPG: 'image/jpeg',
  GIF: 'image/gif',
  WEBP: 'image/webp',
}

export const SUPPORTED_FILE_EXTENSIONS = {
  PDF: '.pdf',
  PNG: '.png',
  JPG: '.jpg',
  JPEG: '.jpeg',
  GIF: '.gif',
  WEBP: '.webp',
}

export const ACCEPT_FILE_TYPES = [
  FILE_TYPES.PDF,
  FILE_TYPES.PNG,
  FILE_TYPES.JPEG,
  FILE_TYPES.GIF,
  FILE_TYPES.WEBP,
].join(',')

export const ACCEPT_FILE_EXTENSIONS = [
  SUPPORTED_FILE_EXTENSIONS.PDF,
  SUPPORTED_FILE_EXTENSIONS.PNG,
  SUPPORTED_FILE_EXTENSIONS.JPG,
  SUPPORTED_FILE_EXTENSIONS.JPEG,
  SUPPORTED_FILE_EXTENSIONS.GIF,
  SUPPORTED_FILE_EXTENSIONS.WEBP,
].join(',')

export const MAX_FILE_SIZE = 4.5 * 1024 * 1024
