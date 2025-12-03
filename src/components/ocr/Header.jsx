import React from 'react'
import { AlertTriangle } from 'lucide-react'
import PropTypes from 'prop-types'

export const Header = ({ backendStatus }) => {
  return (
    <header className="flex-shrink-0 w-full px-6 py-4 border-b border-blue-200/50 bg-white/90 backdrop-blur-md shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
            CE-GPT Service
          </h1>
          <p className="text-xs text-gray-600 mt-0.5 break-words">
            Upload documents for OCR extraction, text processing, and vector database indexing
          </p>
        </div>
        {backendStatus === 'disconnected' && (
          <div className="flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-lg px-3 py-1.5 text-orange-800 text-xs flex-shrink-0">
            <AlertTriangle className="w-4 h-4" />
            <span>Backend disconnected</span>
          </div>
        )}
      </div>
    </header>
  )
}

Header.propTypes = {
  backendStatus: PropTypes.string,
}

