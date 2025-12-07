import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import PropTypes from 'prop-types'

const COMMON_STYLES = {
  wordWrap: 'break-word',
  overflowWrap: 'anywhere',
}

const createMarkdownComponents = (theme = 'blue') => {
  const isOrange = theme === 'orange'
  const borderColor = isOrange ? 'border-orange-300' : 'border-blue-300'
  const blockquoteBorder = isOrange ? 'border-orange-500' : 'border-blue-500'
  const blockquoteBg = isOrange ? 'bg-gradient-to-r from-orange-50 to-orange-100/50' : 'bg-gradient-to-r from-blue-50 to-blue-100/50'
  const codeBg = isOrange ? 'bg-orange-50' : 'bg-blue-50'
  const codeText = isOrange ? 'text-orange-900' : 'text-blue-900'
  const codeBorder = isOrange ? 'border-orange-300' : 'border-blue-300'
  const codeBlockBg = isOrange 
    ? 'bg-gradient-to-br from-orange-900 via-orange-800 to-orange-900 text-orange-50' 
    : 'bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 text-blue-50'
  const tableHeaderBg = isOrange 
    ? 'bg-gradient-to-r from-orange-50 via-orange-100/50 to-blue-50' 
    : 'bg-gradient-to-r from-blue-50 via-blue-100/50 to-orange-50'
  const textSize = isOrange ? 'text-sm' : 'text-base'
  const headingSize = isOrange ? 'text-lg' : 'text-xl'

  return {
    h1: ({ ...props }) => (
      <h1
        className={`text-gray-900 text-2xl font-bold mt-6 mb-4 pb-2 border-b-2 ${borderColor} first:mt-0`}
        {...props}
      />
    ),
    h2: ({ ...props }) => (
      <h2
        className={`text-gray-900 ${headingSize} font-bold mt-6 mb-4 pb-2 border-b-2 ${borderColor} first:mt-0`}
        {...props}
      />
    ),
    p: ({ ...props }) => (
      <p
        className={`text-gray-800 mb-3 leading-relaxed ${textSize} break-words`}
        style={COMMON_STYLES}
        {...props}
      />
    ),
    blockquote: ({ ...props }) => (
      <blockquote
        className={`border-l-4 ${blockquoteBorder} ${blockquoteBg} pl-5 pr-5 py-4 my-5 rounded-r-lg italic text-gray-800 ${textSize} break-words shadow-sm`}
        style={COMMON_STYLES}
        {...props}
      />
    ),
    table: ({ ...props }) => (
      <div className={`overflow-x-auto ${isOrange ? 'my-4' : 'my-5'} rounded-lg shadow-md`}>
        <table
          className={`min-w-full border-collapse border-2 border-gray-300 ${isOrange ? 'text-sm' : 'text-base'} rounded-lg overflow-hidden`}
          {...props}
        />
      </div>
    ),
    thead: ({ ...props }) => (
      <thead className={tableHeaderBg} {...props} />
    ),
    tbody: ({ ...props }) => <tbody className="bg-white" {...props} />,
    tr: ({ ...props }) => (
      <tr className="border-b border-gray-200 hover:bg-gray-50 transition-colors duration-200" {...props} />
    ),
    th: ({ ...props }) => (
      <th
        className={`border border-gray-300 px-4 py-3 text-left font-bold text-gray-900 ${textSize}`}
        {...props}
      />
    ),
    td: ({ ...props }) => (
      <td
        className={`border border-gray-300 px-4 py-3 text-gray-800 ${textSize}`}
        {...props}
      />
    ),
    code: ({ inline, ...props }) =>
      inline ? (
        <code
          className={`${codeBg} px-2 py-1 rounded-md ${codeText} text-xs font-mono border ${codeBorder} break-words shadow-sm`}
          style={COMMON_STYLES}
          {...props}
        />
      ) : (
        <code
          className={`block ${codeBlockBg} p-4 rounded-lg text-sm font-mono whitespace-pre-wrap break-words mb-3 shadow-lg border ${codeBorder}`}
          style={COMMON_STYLES}
          {...props}
        />
      ),
    pre: ({ ...props }) => (
      <pre
        className={`${codeBlockBg} p-4 rounded-lg break-words mb-4 shadow-lg whitespace-pre-wrap border ${codeBorder}`}
        style={COMMON_STYLES}
        {...props}
      />
    ),
  }
}

export const MarkdownRenderer = ({ content, theme = 'blue', viewMode = 'formatted' }) => {
  const components = React.useMemo(() => createMarkdownComponents(theme), [theme])

  const isOrange = theme === 'orange'

  return (
    <div>
      {viewMode === 'raw' ? (
        <pre
          className={`${isOrange ? 'bg-orange-950' : 'bg-gray-800'} p-4 rounded-lg border-2 ${
            isOrange ? 'border-orange-500' : 'border-gray-400'
          } text-white text-sm font-mono whitespace-pre-wrap break-words overflow-x-auto shadow-sm`}
          style={COMMON_STYLES}
        >
          {content}
        </pre>
      ) : (
        <div className="text-gray-900">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            className="prose prose-slate max-w-none prose-base break-words prose-headings:text-gray-900 prose-p:text-gray-900 prose-strong:text-gray-900 prose-ul:text-gray-900 prose-ol:text-gray-900 prose-li:text-gray-900 prose-a:text-blue-600 prose-blockquote:text-gray-900"
            components={components}
          >
            {content}
          </ReactMarkdown>
        </div>
      )}
    </div>
  )
}

MarkdownRenderer.propTypes = {
  content: PropTypes.string.isRequired,
  theme: PropTypes.oneOf(['blue', 'orange']),
  viewMode: PropTypes.oneOf(['formatted', 'raw']),
}

