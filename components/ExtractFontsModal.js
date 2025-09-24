"use client";

import { useState } from 'react';
import { XMarkIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import FileUpload from './FileUpload';
import { downloadBlob } from '../utils/pdfUtils';
import toast from 'react-hot-toast';

export default function ExtractFontsModal({ isOpen, onClose }) {
  const [file, setFile] = useState(null);
  const [fonts, setFonts] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showPreview, setShowPreview] = useState(false);

  const handleFileSelected = (selectedFiles) => {
    if (selectedFiles.length > 0) {
      setFile(selectedFiles[0]);
      setFonts([]);
      setShowPreview(false);
    }
  };

  const handleExtractFonts = async () => {
    if (!file) {
      toast.error('Please select a PDF file');
      return;
    }

    setIsProcessing(true);
    setProgress(10);

    try {
      const formData = new FormData();
      formData.append('file', file);

      setProgress(30);

      const response = await fetch('/api/extract-fonts', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('API Error:', errorData);
        throw new Error(errorData.details || errorData.error || 'Extraction failed');
      }

      setProgress(80);

      const result = await response.json();
      setFonts(result.fonts || []);
      setShowPreview(true);
      const method = result.method || 'unknown';
      toast.success(`Extracted ${result.fonts?.length || 0} fonts using ${method}!`);
    } catch (error) {
      console.error('Extract fonts error:', error);
      toast.error('Error extracting fonts from PDF. Please try again.');
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  const handleDownloadFontReport = () => {
    if (!fonts || fonts.length === 0) {
      toast.error('No fonts to download');
      return;
    }

    const reportContent = `PDF Font Analysis Report
Generated: ${new Date().toLocaleString()}

Source File: ${file.name}

Font Summary:
${fonts.map((font, index) =>
  `${index + 1}. ${font.name || 'Unknown Font'}
   - Family: ${font.family || 'N/A'}
   - Style: ${font.style || 'N/A'}
   - Type: ${font.type || 'N/A'}
   - Usage: ${font.usage || 'N/A'} characters
   - Pages: ${font.pages || 'N/A'}
`).join('\n')}

Total Fonts Found: ${fonts.length}
`;

    const blob = new Blob([reportContent], { type: 'text/plain' });
    downloadBlob(blob, `${file.name.replace('.pdf', '')}_fonts.txt`);
    toast.success('Font report downloaded!');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Extract Fonts
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Select PDF File
            </label>
            <FileUpload
              onFilesSelected={handleFileSelected}
              multiple={false}
              maxFiles={1}
              accept=".pdf"
            />
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-6">
            <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
              Font Analysis Details
            </h3>
            <div className="text-xs text-blue-700 dark:text-blue-300">
              This tool analyzes and extracts information about all fonts used in your PDF document.
              It provides details about font families, styles, usage statistics, and page locations.
            </div>
          </div>

          {!showPreview && (
            <div className="flex justify-center mb-6">
              <button
                onClick={handleExtractFonts}
                disabled={!file || isProcessing}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <DocumentTextIcon className="h-5 w-5" />
                <span>{isProcessing ? 'Analyzing...' : 'Extract Fonts'}</span>
              </button>
            </div>
          )}

          {isProcessing && (
            <div className="mb-6">
              <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 text-center">
                Processing... {progress}%
              </p>
            </div>
          )}

          {showPreview && fonts.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Font Analysis Results ({fonts.length} fonts found)
                </h3>
                <button
                  onClick={handleDownloadFontReport}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2"
                >
                  <DocumentTextIcon className="h-4 w-4" />
                  <span>Download Report</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {fonts.map((font, index) => (
                  <div key={index} className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {font.name || `Font ${index + 1}`}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {font.family || 'Unknown Family'}
                        </p>
                      </div>
                      <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded">
                        {font.type || 'Unknown'}
                      </span>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Style:</span>
                        <span className="text-gray-900 dark:text-white">{font.style || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Usage:</span>
                        <span className="text-gray-900 dark:text-white">{font.usage || 'N/A'} chars</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Pages:</span>
                        <span className="text-gray-900 dark:text-white">{font.pages || 'N/A'}</span>
                      </div>
                    </div>

                    {font.sample && (
                      <div className="mt-3 p-2 bg-white dark:bg-gray-800 rounded border">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Sample:</p>
                        <p className="text-sm font-medium" style={{ fontFamily: font.family || 'inherit' }}>
                          {font.sample}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex justify-center mt-6 space-x-4">
                <button
                  onClick={() => setShowPreview(false)}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Analyze Again
                </button>
                <button
                  onClick={handleDownloadFontReport}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Download Font Report
                </button>
              </div>
            </div>
          )}

          {showPreview && fonts.length === 0 && (
            <div className="text-center py-8">
              <DocumentTextIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No Fonts Found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Unable to analyze fonts in this PDF. The document may be corrupted or use an unsupported format.
              </p>
              <button
                onClick={() => setShowPreview(false)}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Try Another PDF
              </button>
            </div>
          )}

          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
