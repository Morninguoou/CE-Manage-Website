import React, { useState } from "react";
import { Copy, Download, GitCompare, Eye, EyeOff, ArchiveRestore, BadgeCheck } from "lucide-react";
import PropTypes from "prop-types";
import { MarkdownRenderer } from "./MarkdownRenderer";
import {
  formatTextAsMarkdown,
  downloadTextFile,
  copyToClipboard,
} from "../../utils/ocr";
import { Button } from "./ui";

export const ResultSection = ({ result, onCompare, onCopy, onDownload, onProcess, processing }) => {
  const [viewMode, setViewMode] = useState("formatted");

  const handleCopy = async () => {
    if (!result?.text) return;
    const success = await copyToClipboard(result.text);
    if (!success) {
      alert("Failed to copy text");
    } else {
      onCopy?.();
    }
  };

  const handleDownload = () => {
    if (!result?.text) return;
    downloadTextFile(result.text, result.filename);
    onDownload?.();
  };

  return (
    <div className="bg-white rounded-xl shadow-xl border-2 border-orange-100 flex flex-col overflow-hidden">
      <div className="flex-shrink-0 flex items-center justify-between px-4 py-3 border-b border-orange-100 bg-gradient-to-r from-orange-50 to-blue-50">
        <h2 className="text-lg font-bold text-gray-600">Results</h2>
        {result && (
          <div className="flex gap-2">
            {!result.pipeline_complete && result.text && (
              <Button
                onClick={onProcess}
                variant="primary"
                size="sm"
                title="Process and store in vector database"
                className="flex items-center gap-1.5"
                disabled={processing}
              >
                <ArchiveRestore className="w-3.5 h-3.5" />
                {processing ? 'Processing...' : 'Store'}
              </Button>
            )}
            {result.pipeline_complete && (
              <span className="text-xs text-green-600 font-semibold px-2 py-1 bg-green-50 rounded flex items-center gap-1">
                <BadgeCheck className="w-3.5 h-3.5" />
                Stored
              </span>
            )}
            <Button
              onClick={onCompare}
              variant="primary"
              size="sm"
              title="Compare document and text"
              className="flex items-center gap-1.5"
            >
              <GitCompare className="w-3.5 h-3.5" />
              Compare
            </Button>
            <Button
              onClick={handleCopy}
              variant="blue"
              size="sm"
              title="Copy to clipboard"
              className="flex items-center justify-center"
            >
              <Copy className="w-4 h-4" />
            </Button>
            <Button
              onClick={handleDownload}
              variant="blue"
              size="sm"
              title="Download as text"
              className="flex items-center justify-center"
            >
              <Download className="w-4 h-4" />
            </Button>
            <Button
              onClick={() =>
                setViewMode(viewMode === "formatted" ? "raw" : "formatted")
              }
              variant="blue"
              size="sm"
              title={
                viewMode === "formatted"
                  ? "Show raw text"
                  : "Show formatted text"
              }
              className="flex items-center justify-center"
            >
              {viewMode === "raw" ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </Button>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 bg-gradient-to-br from-gray-50 to-orange-50/30">
        {result ? (
          <div className="bg-white rounded-lg p-4 border-2 border-gray-200 shadow-sm break-words">
            <MarkdownRenderer
              content={formatTextAsMarkdown(result.text)}
              theme="blue"
              viewMode={viewMode}
            />
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            <p className="text-sm">
              Upload a document and run OCR to see results
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

ResultSection.propTypes = {
  result: PropTypes.shape({
    text: PropTypes.string.isRequired,
    pages: PropTypes.number,
    filename: PropTypes.string,
    pipeline_complete: PropTypes.bool,
  }),
  onCompare: PropTypes.func.isRequired,
  onCopy: PropTypes.func,
  onDownload: PropTypes.func,
  onProcess: PropTypes.func,
  processing: PropTypes.bool,
};
