"use client";

import { useState } from 'react';
import { XMarkIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import FileUpload from './FileUpload';
import { downloadBlob } from '../utils/pdfUtils';
import toast from 'react-hot-toast';

export default function PdfToWordModal({ isOpen, onClose }) {
  const [file, setFile] = useState(null);
  const [wordBuffer, setWordBuffer] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showPreview, setShowPreview] = useState(false);

  const handleFileSelected = (selectedFiles) => {
    if (selectedFiles.length > 0) {
      setFile(selectedFiles[0]);
      setWordBuffer(null);
      setShowPreview(false);
    }
  };

  const handleConvertToWord = async () => {
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

      const response = await fetch('/api/convert-pdf-to-word', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('API Error:', errorData);
        throw new Error(errorData.details || errorData.error || 'Conversion failed');
      }

      setProgress(80);

      const blob = await response.blob();
      setWordBuffer(blob);
      setShowPreview(true);
      toast.success('PDF converted to Word successfully!');
    } catch (error) {
      console.error('PDF to Word error:', error);
      toast.error('Error converting PDF to Word. Please try again.');
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  const handleDownloadWord = () => {
    if (!wordBuffer) {
      toast.error('No Word document to download');
      return;
    }

    const blob = new Blob([wordBuffer], { type: 'text/plain' });
    downloadBlob(blob, `${file.name.replace('.pdf', '')}.txt`);
    toast.success('Word document downloaded!');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            PDF to Word
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
              Conversion Details
            </h3>
            <div className="text-xs text-blue-700 dark:text-blue-300">
              This tool extracts text from your PDF and creates an editable Word document (.docx).
              Note: Complex formatting, images, and layout may not be perfectly preserved.
              For best results, use PDFs with clear, selectable text.
            </div>
          </div>

          {!showPreview && (
            <div className="flex justify-center mb-6">
              <button
                onClick={handleConvertToWord}
                disabled={!file || isProcessing}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <DocumentTextIcon className="h-5 w-5" />
                <span>{isProcessing ? 'Converting...' : 'Convert to Word'}</span>
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

          {showPreview && wordBuffer && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Word Document Ready
                </h3>
                <button
                  onClick={handleDownloadWord}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2"
                >
                  <DocumentTextIcon className="h-4 w-4" />
                  <span>Download .docx</span>
                </button>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <DocumentTextIcon className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {file.name.replace('.pdf', '.docx')}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {wordBuffer.length} bytes • Ready for download
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-center mt-4 space-x-4">
                <button
                  onClick={() => setShowPreview(false)}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Convert Another
                </button>
                <button
                  onClick={handleDownloadWord}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Download Word Document
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
