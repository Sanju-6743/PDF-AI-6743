"use client";

import { useState } from 'react';
import { XMarkIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import FileUpload from './FileUpload';
import { pdfToText, downloadBlob } from '../utils/pdfUtils';
import toast from 'react-hot-toast';

export default function PdfToTextModal({ isOpen, onClose }) {
  const [file, setFile] = useState(null);
  const [extractedText, setExtractedText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showPreview, setShowPreview] = useState(false);

  const handleFileSelected = (selectedFiles) => {
    if (selectedFiles.length > 0) {
      setFile(selectedFiles[0]);
      setExtractedText('');
      setShowPreview(false);
    }
  };

  const handleExtractText = async () => {
    if (!file) {
      toast.error('Please select a PDF file');
      return;
    }

    setIsProcessing(true);
    setProgress(0);

    try {
      const text = await pdfToText(file, (progressValue, message) => {
        setProgress(progressValue);
      });

      setExtractedText(text);
      setShowPreview(true);
      toast.success('Text extracted successfully!');
    } catch (error) {
      console.error('PDF to Text error:', error);
      toast.error('Error extracting text from PDF. Please try again.');
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  const handleDownloadText = () => {
    if (!extractedText) {
      toast.error('No text to download');
      return;
    }

    const blob = new Blob([extractedText], { type: 'text/plain' });
    downloadBlob(blob, `${file.name.replace('.pdf', '')}.txt`);
    toast.success('Text file downloaded!');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            PDF to Text
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

          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg mb-6">
            <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-2">
              Current Implementation
            </h3>
            <div className="text-xs text-yellow-700 dark:text-yellow-300">
              This is a basic text extraction. For full OCR capabilities and better text extraction from scanned PDFs,
              additional libraries would be needed. The current implementation provides basic file information.
            </div>
          </div>

          {!showPreview && (
            <div className="flex justify-center mb-6">
              <button
                onClick={handleExtractText}
                disabled={!file || isProcessing}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <DocumentTextIcon className="h-5 w-5" />
                <span>{isProcessing ? 'Extracting...' : 'Extract Text'}</span>
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

          {showPreview && extractedText && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Extracted Text Preview
                </h3>
                <button
                  onClick={handleDownloadText}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2"
                >
                  <DocumentTextIcon className="h-4 w-4" />
                  <span>Download .txt</span>
                </button>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-lg p-4 max-h-96 overflow-y-auto">
                <pre className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap font-mono">
                  {extractedText}
                </pre>
              </div>

              <div className="flex justify-center mt-4 space-x-4">
                <button
                  onClick={() => setShowPreview(false)}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Extract Again
                </button>
                <button
                  onClick={handleDownloadText}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Download Text File
                </button>
              </div>
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
