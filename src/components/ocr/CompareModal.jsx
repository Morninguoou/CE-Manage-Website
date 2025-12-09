import React, { useState } from 'react'
import { Document, Page } from 'react-pdf'
import { GitCompare, ChevronLeft, ChevronRight } from 'lucide-react'
import PropTypes from 'prop-types'
import { MarkdownRenderer } from './MarkdownRenderer'
import { formatTextAsMarkdown } from '../../utils/ocr'
import { Modal, Button } from './ui'

export const CompareModal = ({ isOpen, onClose, fileUrl, result }) => {
  const [numPages, setNumPages] = useState(null)
  const [pageNumber, setPageNumber] = useState(1)

  const isPdf = result?.file_type === 'pdf' || (fileUrl && fileUrl.toLowerCase().endsWith('.pdf'))

  const handleDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages)
    setPageNumber(1)
  }

  const handlePreviousPage = () => {
    setPageNumber((prev) => Math.max(1, prev - 1))
  }

  const handleNextPage = () => {
    setPageNumber((prev) => Math.min(numPages, prev + 1))
  }

  if (!isOpen || !fileUrl || !result) return null

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <span className="flex items-center gap-2">
          <GitCompare className="w-5 h-5 text-blue-600" />
          Compare Results
        </span>
      }
    >

        <div className="flex-1 overflow-hidden grid grid-cols-2 gap-4 p-4">
          {/* Document Preview */}
          <div className="bg-gray-50 rounded-lg border-2 border-blue-200 flex flex-col overflow-hidden">
            <div className="flex-shrink-0 flex items-center justify-between px-4 py-2 border-b border-blue-200 bg-blue-50">
              <h3 className="text-sm font-bold text-gray-800">
                {isPdf ? 'PDF Preview' : 'Image Preview'}
              </h3>
              {isPdf && numPages && (
                <span className="text-xs text-gray-600 bg-white px-2 py-1 rounded">
                  Page {pageNumber} / {numPages}
                </span>
              )}
            </div>
            <div className="flex-1 overflow-auto custom-scrollbar flex justify-center items-start p-4">
              {isPdf ? (
                <Document
                  file={fileUrl}
                  onLoadSuccess={handleDocumentLoadSuccess}
                  loading={<div className="text-gray-500 text-sm">Loading PDF...</div>}
                  error={<div className="text-red-600 text-sm">Failed to load PDF</div>}
                >
                  <Page
                    key={`page-${pageNumber}`}
                    pageNumber={pageNumber}
                    renderTextLayer={true}
                    renderAnnotationLayer={true}
                    className="shadow-lg"
                    scale={1.0}
                  />
                </Document>
              ) : (
                <div className="flex justify-center items-center w-full h-full">
                  <img
                    src={fileUrl}
                    alt="Document preview"
                    className="max-w-full max-h-full object-contain shadow-lg rounded"
                  />
                </div>
              )}
            </div>
            {isPdf && numPages && numPages > 0 && (
              <div className="flex-shrink-0 flex items-center justify-center gap-3 px-4 py-2 border-t border-blue-200 bg-blue-50">
                <Button
                  onClick={handlePreviousPage}
                  disabled={pageNumber <= 1}
                  variant="secondary"
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  Previous
                </Button>
                <span className="text-xs text-gray-600 font-medium min-w-[80px] text-center">
                  Page {pageNumber} of {numPages}
                </span>
                <Button
                  onClick={handleNextPage}
                  disabled={pageNumber >= numPages}
                  variant="secondary"
                  size="sm"
                  className="flex items-center gap-1"
                >
                  Next
                  <ChevronRight className="w-3.5 h-3.5" />
                </Button>
              </div>
            )}
          </div>

          {/* Results */}
          <div className="bg-gray-50 rounded-lg border-2 border-orange-200 flex flex-col overflow-hidden">
            <div className="flex-shrink-0 px-4 py-2 border-b border-orange-200 bg-orange-50">
              <h3 className="text-sm font-bold text-gray-800">Results</h3>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
              <div className="bg-white rounded-lg p-4 border border-gray-200 break-words">
                <MarkdownRenderer
                  content={formatTextAsMarkdown(result.text)}
                  theme="orange"
                />
              </div>
            </div>
          </div>
        </div>
    </Modal>
  )
}

CompareModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  fileUrl: PropTypes.string,
  result: PropTypes.shape({
    text: PropTypes.string.isRequired,
    file_type: PropTypes.string,
  }),
}

