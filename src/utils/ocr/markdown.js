/**
 * Converts HTML table to Markdown format
 */
export const convertHtmlTableToMarkdown = (htmlTable) => {
  try {
    const parser = new DOMParser()
    const doc = parser.parseFromString(htmlTable, 'text/html')
    const table = doc.querySelector('table')
    
    if (!table) return htmlTable
    
    const rows = Array.from(table.querySelectorAll('tr'))
    if (rows.length === 0) return htmlTable
    
    // Calculate maximum columns needed
    const maxCols = Math.max(...rows.map(row => {
      let colCount = 0
      Array.from(row.querySelectorAll('th, td')).forEach(cell => {
        const colspan = parseInt(cell.getAttribute('colspan') || '1')
        colCount += colspan
      })
      return colCount
    }))
    
    // Calculate maximum rowspan from all cells
    let maxRowspan = 1
    rows.forEach(row => {
      Array.from(row.querySelectorAll('th, td')).forEach(cell => {
        const rowspan = parseInt(cell.getAttribute('rowspan') || '1')
        maxRowspan = Math.max(maxRowspan, rowspan)
      })
    })
    
    // Build a 2D grid to handle rowspan/colspan
    // Calculate maxRows based on actual rowspan values and number of rows
    const grid = []
    const occupied = []
    const maxRows = rows.length + maxRowspan - 1
    
    for (let i = 0; i < maxRows; i++) {
      grid[i] = Array(maxCols).fill('')
      occupied[i] = Array(maxCols).fill(false)
    }
    
    // Process each row
    rows.forEach((row, rowIdx) => {
      let colIdx = 0
      
      Array.from(row.querySelectorAll('th, td')).forEach(cell => {
        // Find next available column (skip occupied cells from rowspans)
        while (colIdx < maxCols && occupied[rowIdx][colIdx]) {
          colIdx++
        }
        
        const text = cell.textContent.trim().replace(/\n/g, ' ').replace(/\s+/g, ' ')
        const colspan = parseInt(cell.getAttribute('colspan') || '1')
        const rowspan = parseInt(cell.getAttribute('rowspan') || '1')
        
        // Fill the cell and mark occupied cells
        for (let r = 0; r < rowspan; r++) {
          for (let c = 0; c < colspan; c++) {
            if (rowIdx + r < maxRows && colIdx + c < maxCols) {
              if (c === 0) {
                grid[rowIdx + r][colIdx + c] = text
              } else {
                grid[rowIdx + r][colIdx + c] = ''
              }
              occupied[rowIdx + r][colIdx + c] = true
            }
          }
        }
        
        colIdx += colspan
      })
    })
    
    // Find the actual number of rows (non-empty)
    let maxRow = 0
    for (let r = 0; r < maxRows; r++) {
      if (grid[r].some(cell => cell.trim() !== '')) {
        maxRow = r
      }
    }
    
    // Convert grid to markdown table
    let markdown = '\n'
    let hasHeader = false
    
    for (let r = 0; r <= maxRow; r++) {
      const cells = grid[r].map(cell => cell.trim())
      
      if (cells.every(cell => cell === '')) continue
      
      markdown += '| ' + cells.join(' | ') + ' |\n'
      
      if (!hasHeader) {
        markdown += '|' + cells.map(() => '---').join('|') + '|\n'
        hasHeader = true
      }
    }
    
    return markdown + '\n'
  } catch (error) {
    console.error('Error converting HTML table to markdown:', error)
    return htmlTable
  }
}

/**
 * Formats text by converting HTML elements to Markdown
 */
export const formatTextAsMarkdown = (text) => {
  if (!text) return ''
  
  let processedText = text
  
  // Convert HTML tables to markdown
  const tableRegex = /<table[\s\S]*?<\/table>/gi
  const tables = processedText.match(tableRegex) || []
  tables.forEach((htmlTable) => {
    const markdownTable = convertHtmlTableToMarkdown(htmlTable)
    processedText = processedText.replace(htmlTable, markdownTable)
  })
  
  // Convert <figure> tags to markdown blockquotes
  const figureRegex = /<figure>([\s\S]*?)<\/figure>/gi
  processedText = processedText.replace(figureRegex, (match, content) => {
    const cleanContent = content.trim()
    const lines = cleanContent.split('\n')
    const formatted = lines.map(line => `> ${line.trim()}`).join('\n')
    return `\n${formatted}\n`
  })
  
  // Process the rest of the text
  const lines = processedText.split('\n')
  let markdown = ''
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const trimmed = line.trim()
    
    if (trimmed.startsWith('[Page')) {
      markdown += `\n## ${trimmed}\n\n`
    } else if (trimmed.length > 0) {
      markdown += `${line}\n`
    } else {
      markdown += '\n'
    }
  }
  
  return markdown
}

