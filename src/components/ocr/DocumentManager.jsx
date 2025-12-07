import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import PropTypes from 'prop-types'
import { Database, Trash2, Eye, RefreshCw, FileText, X, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react'
import { Button } from './ui/Button'
import { Modal } from './ui/Modal'
import { 
  getVectorStatistics, 
  listDocuments, 
  getDocument, 
  deleteDocument, 
  getOtherChunks, 
  deleteOtherChunks, 
  deleteChunk 
} from '../../services/ocr/api'

/**
 * Statistics Card Component
 */
const StatisticsCard = ({ label, value, color = 'blue', icon: Icon }) => {
  const colorClasses = {
    blue: 'border-blue-200 text-blue-600 bg-blue-50/50',
    orange: 'border-orange-200 text-orange-600 bg-orange-50/50',
    green: 'border-green-200 text-green-600 bg-green-50/50',
    purple: 'border-purple-200 text-purple-600 bg-purple-50/50',
  }

  return (
    <div className={`bg-white rounded-lg p-3 border-2 ${colorClasses[color]} shadow-sm hover:shadow-md transition-shadow`}>
      <div className="flex items-center justify-between mb-1">
        <div className="text-xs font-medium text-gray-600">{label}</div>
        {Icon && <Icon className="w-3 h-3 text-gray-400" />}
      </div>
      <div className={`text-xl font-bold ${colorClasses[color].split(' ')[1]}`}>
        {value}
      </div>
    </div>
  )
}

StatisticsCard.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  color: PropTypes.oneOf(['blue', 'orange', 'green', 'purple']),
  icon: PropTypes.elementType,
}

/**
 * Error Alert Component
 */
const ErrorAlert = ({ message, onDismiss }) => (
  <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-400 rounded-lg flex items-start gap-3">
    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
    <div className="flex-1">
      <p className="text-sm font-medium text-red-800">{message}</p>
    </div>
    {onDismiss && (
      <button
        onClick={onDismiss}
        className="text-red-600 hover:text-red-800 transition-colors"
        aria-label="Dismiss error"
      >
        <X className="w-4 h-4" />
      </button>
    )}
  </div>
)

ErrorAlert.propTypes = {
  message: PropTypes.string.isRequired,
  onDismiss: PropTypes.func,
}

/**
 * Empty State Component
 */
const EmptyState = ({ icon: Icon, title, description }) => (
  <div className="p-12 text-center">
    {Icon && <Icon className="w-16 h-16 mx-auto mb-4 text-gray-300" />}
    <h3 className="text-lg font-semibold text-gray-700 mb-2">{title}</h3>
    {description && <p className="text-sm text-gray-500">{description}</p>}
  </div>
)

EmptyState.propTypes = {
  icon: PropTypes.elementType,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
}

/**
 * Loading State Component
 */
const LoadingState = ({ message = 'Loading...' }) => (
  <div className="flex items-center justify-center h-full">
    <div className="flex flex-col items-center gap-3">
      <RefreshCw className="w-5 h-5 animate-spin text-blue-600" />
      <span className="text-sm text-gray-500 font-medium">{message}</span>
    </div>
  </div>
)

LoadingState.propTypes = {
  message: PropTypes.string,
}

/**
 * Confirmation Modal Component
 */
const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Delete', confirmVariant = 'secondary' }) => {
  const [isConfirming, setIsConfirming] = useState(false)

  useEffect(() => {
    if (!isOpen) {
      setIsConfirming(false)
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleConfirm = async () => {
    if (isConfirming) return
    setIsConfirming(true)
    try {
      await onConfirm()
      onClose()
    } finally {
      setIsConfirming(false)
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-2xl border border-gray-100 w-full max-w-xs"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-1.5">{title}</h3>
            <p className="text-xs text-gray-500 leading-relaxed">{message}</p>
          </div>
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={onClose}
              disabled={isConfirming}
              className="px-3 py-1.5 text-xs font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 border-2 border-gray-300 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={isConfirming}
              className="px-3 py-1.5 text-xs font-medium text-white bg-red-600 hover:bg-red-700 border-2 border-red-700 rounded-md transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

ConfirmModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  confirmText: PropTypes.string,
  confirmVariant: PropTypes.string,
}

/**
 * Chunk Item Component
 */
const ChunkItem = ({ chunk, onDelete, isDeleting, showDocumentActions = false }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const textRef = useRef(null)
  const [needsCollapse, setNeedsCollapse] = useState(false)
  
  const hasText = chunk.text && chunk.text.trim()
  
  useEffect(() => {
    if (textRef.current && hasText) {
      const maxHeight = 96
      setNeedsCollapse(textRef.current.scrollHeight > maxHeight)
    }
  }, [hasText, chunk.text])
  
  return (
    <div className="bg-white rounded-lg p-3 border border-gray-200 hover:border-gray-300 transition-colors shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-2">
            {chunk.data_type && chunk.data_type !== 'unknown' && (
              <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-md text-xs font-semibold">
                {chunk.data_type}
              </span>
            )}
            {chunk.page !== null && chunk.page !== undefined && (
              <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-md text-xs font-semibold">
                Page {chunk.page}
              </span>
            )}
            {chunk.point_id && (
              <span className="text-xs text-gray-400 font-mono">
                ID: {chunk.point_id.substring(0, 12)}...
              </span>
            )}
            {chunk.filename && chunk.filename !== 'unknown' && (
              <span className="text-xs text-gray-500 truncate max-w-xs">
                {chunk.filename}
              </span>
            )}
          </div>
          
          {hasText ? (
            <div>
              <div className="relative">
                <p
                  ref={textRef}
                  className={`text-sm text-gray-700 whitespace-pre-wrap break-words leading-relaxed ${
                    !isExpanded && needsCollapse ? 'max-h-12 overflow-hidden' : ''
                  }`}
                >
                  {chunk.text}
                </p>
                {!isExpanded && needsCollapse && (
                  <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent pointer-events-none" />
                )}
              </div>
              {needsCollapse && (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="mt-2 flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-medium"
                >
                  {isExpanded ? (
                    <>
                      <ChevronUp className="w-3.5 h-3.5" />
                      Show less
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-3.5 h-3.5" />
                      Show more
                    </>
                  )}
                </button>
              )}
            </div>
          ) : (
            <div className="text-sm text-gray-400 italic py-1">
              <p>No text content available</p>
              {chunk.all_fields && chunk.all_fields.length > 0 && (
                <p className="mt-2 text-xs text-gray-500">
                  Available fields: <span className="font-mono">{chunk.all_fields.join(', ')}</span>
                </p>
              )}
            </div>
          )}
          
          {(chunk.source && chunk.source !== 'unknown') && (
            <div className="mt-2 pt-2 border-t border-gray-100">
              <div className="text-xs text-gray-500">
                <span className="font-medium">Source:</span> {chunk.source}
              </div>
            </div>
          )}
        </div>
        {showDocumentActions && (
          <Button
            onClick={() => onDelete(chunk.point_id)}
            variant="secondary"
            size="sm"
            title="Delete chunk"
            disabled={isDeleting}
            className="flex-shrink-0"
          >
            {isDeleting ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Trash2 className="w-3.5 h-3.5" />
            )}
          </Button>
        )}
      </div>
    </div>
  )
}

ChunkItem.propTypes = {
  chunk: PropTypes.object.isRequired,
  onDelete: PropTypes.func,
  isDeleting: PropTypes.bool,
  showDocumentActions: PropTypes.bool,
}

/**
 * Document Item Component
 */
const DocumentItem = ({ 
  document, 
  onView, 
  onDelete, 
  isDeleting,
  onViewOther,
  onDeleteOther,
  isDeletingOther 
}) => {
  const isOtherChunks = !document.document_id
  
  return (
    <div
      className="px-5 py-4 transition-all rounded-lg hover:bg-blue-50/50 cursor-pointer border border-blue-100"
      onClick={() => isOtherChunks ? onViewOther() : onView(document.document_id)}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="w-4 h-4 flex-shrink-0 text-blue-600" />
            <h4 className="font-semibold text-gray-800 truncate">
              {isOtherChunks ? 'Other Chunks' : (document.filename || 'Unknown')}
            </h4>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-600 ml-6">
            <span className="font-medium">{document.chunk_count || 0} chunks</span>
          </div>
        </div>
        <div className="flex items-center gap-2 ml-4">
          {isOtherChunks ? (
            <>
              <Button
                onClick={(e) => {
                  e.stopPropagation()
                  onViewOther()
                }}
                variant="blue"
                size="sm"
                title="View other chunks"
              >
                <Eye className="w-4 h-4" />
              </Button>
              <Button
                onClick={(e) => {
                  e.stopPropagation()
                  onDeleteOther()
                }}
                variant="secondary"
                size="sm"
                title="Delete all other chunks"
                disabled={isDeletingOther}
              >
                {isDeletingOther ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
              </Button>
            </>
          ) : (
            <>
              <Button
                onClick={(e) => {
                  e.stopPropagation()
                  onView(document.document_id)
                }}
                variant="blue"
                size="sm"
                title="View document"
              >
                <Eye className="w-4 h-4" />
              </Button>
              <Button
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete(document.document_id, e)
                }}
                variant="secondary"
                size="sm"
                title="Delete document"
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

DocumentItem.propTypes = {
  document: PropTypes.object.isRequired,
  onView: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  isDeleting: PropTypes.bool,
  onViewOther: PropTypes.func,
  onDeleteOther: PropTypes.func,
  isDeletingOther: PropTypes.bool,
}

/**
 * Main Document Manager Component
 */
export const DocumentManager = () => {
  // State management
  const [statistics, setStatistics] = useState(null)
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedDocument, setSelectedDocument] = useState(null)
  const [showDocumentModal, setShowDocumentModal] = useState(false)
  const [deleting, setDeleting] = useState(new Set())
  const [otherChunks, setOtherChunks] = useState(null)
  const [showOtherModal, setShowOtherModal] = useState(false)
  const [deletingOther, setDeletingOther] = useState(false)
  const [deletingChunkId, setDeletingChunkId] = useState(null)
  
  // Confirmation modal state
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Delete',
    confirmVariant: 'secondary',
    onConfirm: null,
  })
  
  // Ref to prevent duplicate calls (React StrictMode in dev causes double renders)
  const hasLoadedRef = useRef(false)
  
  // Refs to track current values for closure-safe callbacks
  const selectedDocumentRef = useRef(null)
  const showOtherModalRef = useRef(false)
  
  // Keep refs in sync with state
  useEffect(() => {
    selectedDocumentRef.current = selectedDocument
  }, [selectedDocument])
  
  useEffect(() => {
    showOtherModalRef.current = showOtherModal
  }, [showOtherModal])

  // Load initial data
  const loadData = useCallback(async (force = false) => {
    // Prevent duplicate concurrent calls unless forced (e.g., refresh button)
    if (hasLoadedRef.current && !force) {
      return
    }
    
    hasLoadedRef.current = true
    setLoading(true)
    setError(null)
    try {
      const [stats, docsData] = await Promise.all([
        getVectorStatistics(),
        listDocuments(100, 0),
      ])
      setStatistics(stats)
      setDocuments(docsData.documents || [])
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Failed to load data')
      hasLoadedRef.current = false // Reset on error so retry works
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    // Only load once on mount (React StrictMode in dev causes double render)
    if (!hasLoadedRef.current) {
      loadData()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Intentionally empty - only run on mount

  // Document handlers
  const handleViewDocument = useCallback(async (documentId) => {
    if (!documentId) {
      setError('Cannot view document: No document ID')
      return
    }
    try {
      setError(null)
      const doc = await getDocument(documentId)
      setSelectedDocument(doc)
      setShowDocumentModal(true)
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Failed to load document')
    }
  }, [])

  const handleDeleteDocument = useCallback((documentId, e) => {
    e?.stopPropagation()
    if (!documentId) {
      setError('Cannot delete: No document ID')
      return
    }
    
    setConfirmModal({
      isOpen: true,
      title: 'Delete Document',
      message: 'Are you sure you want to delete this document? This action cannot be undone.',
      confirmText: 'Delete',
      confirmVariant: 'secondary',
      onConfirm: async () => {
        setDeleting(prev => new Set(prev).add(documentId))
        try {
          setError(null)
          await deleteDocument(documentId)
          await loadData(true) // Force reload after deletion
        } catch (err) {
          setError(err.response?.data?.detail || err.message || 'Failed to delete document')
        } finally {
          setDeleting(prev => {
            const next = new Set(prev)
            next.delete(documentId)
            return next
          })
        }
      },
    })
  }, [loadData])

  // Other chunks handlers
  const handleViewOther = useCallback(async () => {
    try {
      setError(null)
      const data = await getOtherChunks(1000)
      setOtherChunks(data.chunks || [])
      setShowOtherModal(true)
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Failed to load other chunks')
    }
  }, [])

  const handleDeleteOther = useCallback(() => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete All Other Chunks',
      message: 'Are you sure you want to delete ALL other chunks? This action cannot be undone.',
      confirmText: 'Delete All',
      confirmVariant: 'secondary',
      onConfirm: async () => {
        setDeletingOther(true)
        try {
          setError(null)
          await deleteOtherChunks()
          await loadData(true) // Force reload after deletion
          setShowOtherModal(false)
          setOtherChunks(null)
        } catch (err) {
          setError(err.response?.data?.detail || err.message || 'Failed to delete other chunks')
        } finally {
          setDeletingOther(false)
        }
      },
    })
  }, [loadData])

  // Single chunk deletion handler
  const handleDeleteSingleChunk = useCallback((pointId, documentId = null) => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete Chunk',
      message: 'Are you sure you want to delete this chunk? This action cannot be undone.',
      confirmText: 'Delete',
      confirmVariant: 'secondary',
      onConfirm: async () => {
        setDeletingChunkId(pointId)
        try {
          setError(null)
          await deleteChunk(pointId)
          
          // Reload current view - use refs to get current values, not stale closure values
          const currentSelectedDocument = selectedDocumentRef.current
          const currentShowOtherModal = showOtherModalRef.current
          
          if (documentId && currentSelectedDocument?.document_id === documentId) {
            const doc = await getDocument(documentId)
            setSelectedDocument(doc)
          }
          
          if (currentShowOtherModal) {
            const data = await getOtherChunks(1000)
            setOtherChunks(data.chunks || [])
          }
          
          await loadData(true) // Force reload after deletion
        } catch (err) {
          setError(err.response?.data?.detail || err.message || 'Failed to delete chunk')
        } finally {
          setDeletingChunkId(null)
        }
      },
    })
  }, [loadData])

  // Memoized statistics cards
  const statisticsCards = useMemo(() => {
    if (!statistics) return null
    
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        <StatisticsCard
          label="Total Chunks"
          value={statistics.total_chunks || 0}
          color="blue"
        />
        <StatisticsCard
          label="Total Documents"
          value={statistics.total_documents || 0}
          color="orange"
        />
      </div>
    )
  }, [statistics])

  if (loading) {
    return (
      <div className="flex-1 overflow-hidden bg-gradient-to-br from-blue-50 via-white to-orange-50 flex flex-col">
        <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-br from-gray-50 to-orange-50/30 flex items-center justify-center">
          <LoadingState message="Loading documents..." />
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-hidden bg-gradient-to-br from-blue-50 via-white to-orange-50 flex flex-col">
      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-br from-gray-50 to-orange-50/30">
        {error && (
          <ErrorAlert 
            message={error} 
            onDismiss={() => setError(null)} 
          />
        )}

        {statisticsCards}

        {/* Documents List */}
        <div className="bg-white rounded-xl border-2 border-gray-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
              Documents
            </h3>
            <Button
              onClick={() => {
                hasLoadedRef.current = false
                loadData(true)
              }}
              variant="blue"
              size="sm"
              title="Refresh data"
              disabled={loading}
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
          
          {documents.length === 0 ? (
            <EmptyState
              icon={Database}
              title="No documents found"
              description="Upload and process documents to see them here."
            />
          ) : (
            <div className="p-4 space-y-2">
              {documents.map((doc) => (
                <DocumentItem
                  key={doc.document_id || `other-${doc.filename}`}
                  document={doc}
                  onView={handleViewDocument}
                  onDelete={handleDeleteDocument}
                  isDeleting={deleting.has(doc.document_id)}
                  onViewOther={handleViewOther}
                  onDeleteOther={handleDeleteOther}
                  isDeletingOther={deletingOther}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Document Detail Modal */}
      <Modal
        isOpen={showDocumentModal}
        onClose={() => {
          setShowDocumentModal(false)
          setSelectedDocument(null)
        }}
        title={
          <div className="flex items-center gap-2">
            <span>Document Details</span>
          </div>
        }
      >
        {selectedDocument && (
          <div className="flex-1 flex flex-col p-6 overflow-hidden">
            {/* Document Metadata */}
            <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4 flex-shrink-0">
              <div className="bg-orange-50 rounded-lg p-4">
                <div className="text-xs font-semibold text-orange-500 mb-1">Document ID</div>
                <div className="text-xs font-mono text-orange-800 break-all">{selectedDocument.document_id}</div>
              </div>
              <div className="bg-orange-50 rounded-lg p-4">
                <div className="text-xs font-semibold text-orange-600 mb-1">Chunks</div>
                <div className="text-sm font-medium text-orange-800">{selectedDocument.chunk_count}</div>
              </div>
              <div className="bg-orange-50 rounded-lg p-4">
                <div className="text-xs font-semibold text-orange-600 mb-1">Source</div>
                <div className="text-sm font-medium text-orange-800">{selectedDocument.source}</div>
              </div>
            </div>

            {/* Chunks List */}
            <div className="pt-2 flex-1 flex flex-col overflow-hidden">
              <div className="flex items-center justify-between mb-4 flex-shrink-0">
                <h3 className="text-lg font-semibold text-gray-700">
                  Chunks
                </h3>
              </div>
              <div className="flex-1 overflow-y-auto space-y-3">
                {selectedDocument.chunks?.map((chunk, idx) => (
                  <ChunkItem
                    key={chunk.point_id || idx}
                    chunk={chunk}
                    onDelete={(pointId) => handleDeleteSingleChunk(pointId, selectedDocument.document_id)}
                    isDeleting={deletingChunkId === chunk.point_id}
                    showDocumentActions
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Other Chunks Modal */}
      <Modal
        isOpen={showOtherModal}
        onClose={() => {
          setShowOtherModal(false)
          setOtherChunks(null)
        }}
        title="Other Chunks"
      >
        <div className="flex-1 flex flex-col p-6 overflow-hidden">
          <div className="mb-6 flex items-center justify-between flex-shrink-0">
            <div>
              <p className="text-sm font-medium text-gray-700">
                Total: <span className="font-bold">{otherChunks?.length || 0}</span> chunks
              </p>
            </div>
            <Button
              onClick={handleDeleteOther}
              variant="secondary"
              size="sm"
              title="Delete all other chunks"
              disabled={deletingOther || !otherChunks || otherChunks.length === 0}
            >
              <div className="flex items-center">
                {deletingOther ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-1.5 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4 mr-1.5" />
                    <span>Delete All</span>
                  </>
                )}
              </div>
            </Button>
          </div>

          {!otherChunks || otherChunks.length === 0 ? (
            <EmptyState
              icon={Database}
              title="No other chunks found"
            />
          ) : (
            <div className="flex-1 overflow-y-auto space-y-3">
              {otherChunks.map((chunk, idx) => (
                <ChunkItem
                  key={chunk.point_id || idx}
                  chunk={chunk}
                  onDelete={handleDeleteSingleChunk}
                  isDeleting={deletingChunkId === chunk.point_id}
                  showDocumentActions
                />
              ))}
            </div>
          )}
        </div>
      </Modal>

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
        onConfirm={confirmModal.onConfirm || (() => {})}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmText={confirmModal.confirmText}
        confirmVariant={confirmModal.confirmVariant}
      />
    </div>
  )
}

DocumentManager.propTypes = {}

