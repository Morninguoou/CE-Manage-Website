import { pdfjs } from 'react-pdf'

/**
 * Configure PDF.js worker
 * This should be called once at app initialization
 */
export const configurePDFWorker = () => {
  pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`
}

