import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { AlertTriangle, Database, FileText } from 'lucide-react'
import PropTypes from 'prop-types'
import { Button } from './ui/Button'

export const Header = ({ backendStatus }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const isDocumentsPage = location.pathname === '/cegpt/documents'

  const handleToggle = () => {
    if (isDocumentsPage) {
      navigate('/cegpt')
    } else {
      navigate('/cegpt/documents')
    }
  }

  return (
    <header className="flex-shrink-0 px-6 py-4 border-b border-blue-200/50 bg-white/90 backdrop-blur-md shadow-sm">
      <div className="flex items-center">
        <div className="flex items-center gap-4 flex-1">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
              CE-GPT Service
            </h1>
            <p className="text-xs text-gray-600 mt-0.5">
              {isDocumentsPage 
                ? 'Manage your uploaded documents and vector database content'
                : 'Upload your document to extract text and store it in the vector database'}
            </p>
          </div>
        </div>
        <div className="flex-1 flex justify-center">
          {backendStatus === 'disconnected' && (
            <div className="flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-lg px-3 py-1.5 text-orange-800 text-xs">
              <AlertTriangle className="w-4 h-4" />
              <span>Backend disconnected</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-3 flex-1 justify-end">
          <Button
            onClick={handleToggle}
            variant="blue"
            size="sm"
            title={isDocumentsPage ? "Add documents" : "Manage content"}
          >
            <div className="flex items-center">
              {isDocumentsPage ? (
                <>
                  <FileText className="w-4 h-4 mr-1.5" />
                  <span>Add Documents</span>
                </>
              ) : (
                <>
                  <Database className="w-4 h-4 mr-1.5" />
                  <span>Manage Content</span>
                </>
              )}
            </div>
          </Button>
        </div>
      </div>
    </header>
  )
}

Header.propTypes = {
  backendStatus: PropTypes.string,
}

