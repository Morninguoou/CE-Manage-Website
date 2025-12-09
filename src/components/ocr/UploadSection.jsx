import React, { useState } from 'react'
import { Upload, Sparkles, AlertCircle, FileText } from 'lucide-react'
import { Document, Page } from 'react-pdf'
import PropTypes from 'prop-types'
import { ACCEPT_FILE_EXTENSIONS } from '../../constants/ocr'
import { validateFile } from '../../utils/ocr'
import { Button } from './ui'
import 'react-pdf/dist/esm/Page/AnnotationLayer.css'
import 'react-pdf/dist/esm/Page/TextLayer.css'

export const UploadSection = ({
  file,
  fileUrl,
  fileInputRef,
  loading,
  error,
  onFileChange,
  onSubmit,
  onReset,
}) => {
  const [numPages, setNumPages] = useState(null)
  
  const isPdf = file?.type === 'application/pdf'
  
  React.useEffect(() => {
    if (file) {
      if (isPdf) {
        setNumPages(null)
      } else {
        setNumPages(1)
      }
    }
  }, [file, isPdf])
  
  const handleDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages)
  }
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      const validation = validateFile(selectedFile)
      if (!validation.valid) {
        // Reset input
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
        return
      }
    }
    onFileChange(e)
  }
  return (
    <div className="bg-white rounded-xl shadow-xl border-2 border-blue-100 flex flex-col overflow-hidden">
      <div className="flex-shrink-0 px-4 py-3 border-b border-blue-100 bg-gradient-to-r from-blue-50 to-orange-50">
        <h2 className="text-lg font-bold text-gray-600">Upload Document</h2>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden p-3">
        <form onSubmit={onSubmit} className="flex flex-col h-full">
          {/* Upload area - fixed at top */}
          <div className="flex-shrink-0 mb-3">
            <div className="relative">
              <input
                ref={fileInputRef}
                id="file-input"
                type="file"
                accept={ACCEPT_FILE_EXTENSIONS}
                onChange={handleFileChange}
                className="hidden"
                disabled={loading}
              />
              <label
                htmlFor="file-input"
                className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-blue-300 rounded-xl cursor-pointer bg-gradient-to-br from-blue-50 to-orange-50 hover:from-blue-100 hover:to-orange-100 hover:border-blue-400 transition-all duration-300 shadow-md hover:shadow-lg group"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <div className="relative">
                    <Upload className="w-12 h-12 mb-3 text-blue-500 transition-colors" />
                    <Sparkles className="w-6 h-6 absolute -top-1 -right-1 text-orange-400 animate-pulse" />
                  </div>
                  <p className="mb-1 text-sm text-gray-700 font-semibold">
                    {file ? file.name : 'Drop a file here or click to browse'}
                  </p>
                  <p className="text-xs text-gray-500">Supports JPEG, PNG, WebP, GIF, PDF (max 4.5MB)</p>
                  <p className="text-xs text-gray-500">Text will be extracted and added to vector database</p>
                </div>
              </label>
            </div>
          </div>

          {/* Error message - fixed below upload */}
          {error && (
            <div className="flex-shrink-0 mb-3">
              <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-3 flex items-center gap-2 text-sm shadow-sm">
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </div>
            </div>
          )}

          {/* Scrollable page cards section */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar min-h-0">
            {file && fileUrl && (
              <div>
                {!numPages && isPdf ? (
                  <Document
                    file={fileUrl}
                    onLoadSuccess={handleDocumentLoadSuccess}
                    loading={
                      <div className="flex items-center justify-center p-8">
                        <div className="flex flex-col items-center gap-2">
                          <FileText className="w-8 h-8 text-blue-500 animate-pulse" />
                          <span className="text-sm text-gray-400">Loading PDF...</span>
                        </div>
                      </div>
                    }
                    error={
                      <div className="flex items-center justify-center p-8">
                        <div className="flex flex-col items-center gap-2">
                          <FileText className="w-8 h-8 text-red-500" />
                          <span className="text-sm text-red-500">Failed to load PDF</span>
                        </div>
                      </div>
                    }
                  />
                ) : numPages ? (
                  isPdf ? (
                    <Document
                      file={fileUrl}
                      loading={
                        <div className="flex items-center justify-center p-8">
                          <div className="flex flex-col items-center gap-2">
                            <FileText className="w-8 h-8 text-blue-500 animate-pulse" />
                            <span className="text-sm text-gray-400">Loading PDF...</span>
                          </div>
                        </div>
                      }
                      error={
                        <div className="flex items-center justify-center p-8">
                          <div className="flex flex-col items-center gap-2">
                            <FileText className="w-8 h-8 text-red-500" />
                            <span className="text-sm text-red-500">Failed to load PDF</span>
                          </div>
                        </div>
                      }
                    >
                      <div className="grid grid-cols-3 gap-3">
                        {Array.from({ length: numPages }, (_, i) => i + 1).map((pageNum) => (
                          <div
                            key={pageNum}
                            className="group relative rounded-lg overflow-hidden bg-white border border-gray-200 shadow-sm"
                          >
                            <div className="relative bg-gray-50 p-3 flex items-center justify-center">
                              <div className="w-full h-48 bg-white rounded border border-gray-100 flex items-center justify-center overflow-hidden relative">
                                <Page
                                  pageNumber={pageNum}
                                  width={180}
                                  renderTextLayer={false}
                                  renderAnnotationLayer={false}
                                  className="relative z-10"
                                />
                                <div className="absolute bottom-3 right-3 z-20">
                                  <div className="px-2.5 py-0.5 bg-white/95 backdrop-blur-sm border border-gray-200 rounded-full shadow-sm">
                                    <span className="text-xs font-medium text-gray-700">
                                      Page {pageNum}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </Document>
                  ) : (
                    <div className="grid grid-cols-3 gap-3">
                      {Array.from({ length: numPages }, (_, i) => i + 1).map((pageNum) => (
                        <div
                          key={pageNum}
                          className="group relative rounded-lg overflow-hidden bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200"
                        >
                          <div className="relative bg-gray-50 p-3 flex items-center justify-center">
                            <div className="w-full h-48 bg-white rounded border border-gray-100 overflow-hidden flex items-center justify-center relative">
                              <img
                                src={fileUrl}
                                alt="Preview"
                                className="max-w-full max-h-full object-contain relative z-10"
                              />
                              <div className="absolute top-3 right-3 z-20">
                                <div className="px-2.5 py-1 bg-white/95 backdrop-blur-sm border border-gray-200 rounded-full shadow-sm">
                                  <span className="text-xs font-medium text-gray-700">
                                    {pageNum}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                ) : null}
              </div>
            )}
          </div>

          {/* Buttons - fixed at bottom */}
          <div className="flex-shrink-0 flex gap-3 pt-3 mt-3 border-t border-gray-200">
            <Button
              type="submit"
              variant="primary"
              disabled={!file || loading}
              className="flex-1 transform hover:scale-105 disabled:transform-none"
            >
              {loading ? 'Processing...' : 'Submit'}
            </Button>
            {file && (
              <Button
                type="button"
                variant="secondary"
                onClick={onReset}
                disabled={loading}
              >
                Reset
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}

UploadSection.propTypes = {
  file: PropTypes.object,
  fileUrl: PropTypes.string,
  fileInputRef: PropTypes.object.isRequired,
  loading: PropTypes.bool,
  error: PropTypes.string,
  onFileChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
}

