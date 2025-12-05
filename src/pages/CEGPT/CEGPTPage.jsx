import React, { useState, useEffect, useCallback } from 'react'
import { useBackendStatus, useFileUpload, useOCR } from '../../hooks/ocr'
import { Header, UploadSection, ResultSection, CompareModal } from '../../components/ocr'
import Sidebar from '../../components/Sidebar'
import { configurePDFWorker } from '../../config/ocr/pdf'
import 'react-pdf/dist/esm/Page/AnnotationLayer.css'
import 'react-pdf/dist/esm/Page/TextLayer.css'

function CEGPTPage() {
  const backendStatus = useBackendStatus()
  const { file, fileUrl, fileInputRef, fileError, handleFileChange, resetFile } = useFileUpload()
  const { extracting, storing, result, error, extractText, processAndStoreText, reset: resetOCR } = useOCR()
  const [showCompare, setShowCompare] = useState(false)

  // Configure PDF worker on mount
  useEffect(() => {
    configurePDFWorker()
  }, [])

  // Cleanup file URL on unmount
  useEffect(() => {
    return () => {
      if (fileUrl) {
        URL.revokeObjectURL(fileUrl)
      }
    }
  }, [fileUrl])

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault()
      try {
        await extractText(file)
        // After OCR extraction, the text will be processed and added to vector database
        // This happens in the backend service
      } catch (error) {
        console.error('Error processing file:', error)
      }
    },
    [extractText, file]
  )

  const handleProcess = useCallback(
    async () => {
      if (!result?.text) {
        return
      }
      try {
        await processAndStoreText(result.text, result.filename)
      } catch {
        // Error handled by useOCR hook
      }
    },
    [processAndStoreText, result]
  )

  const handleReset = useCallback(() => {
    resetFile()
    resetOCR()
    setShowCompare(false)
  }, [resetFile, resetOCR])

  const handleCompare = useCallback(() => {
    setShowCompare(true)
  }, [])

  const handleCloseCompare = useCallback(() => {
    setShowCompare(false)
  }, [])

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar activeMenu="cegpt" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="h-screen overflow-hidden bg-gradient-to-br from-blue-50 via-white to-orange-50 flex flex-col">
          <Header backendStatus={backendStatus} />

          <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-2 gap-4 p-4">
            <UploadSection
              file={file}
              fileUrl={fileUrl}
              fileInputRef={fileInputRef}
              loading={extracting}
              error={error || fileError}
              onFileChange={handleFileChange}
              onSubmit={handleSubmit}
              onReset={handleReset}
            />

            <ResultSection
              result={result}
              onCompare={handleCompare}
              onProcess={handleProcess}
              processing={storing}
            />
          </div>

          <CompareModal
            isOpen={showCompare}
            onClose={handleCloseCompare}
            fileUrl={fileUrl}
            result={result}
          />
        </div>
      </div>
    </div>
  )
}

export default CEGPTPage
