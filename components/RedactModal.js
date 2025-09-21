"use client";

import { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import FileUpload from './FileUpload';
import { redactPDF, downloadBlob } from '../utils/pdfUtils';
import toast from 'react-hot-toast';

export default function RedactModal({ isOpen, onClose }) {
  const [file, setFile] = useState(null);
  const [redactions, setRedactions] = useState([]);
  const [currentRedaction, setCurrentRedaction] = useState({
    page: 1,
    x: 0,
    y: 0,
    width: 100,
    height: 20,
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileSelected = (selectedFiles) => {
    if (selectedFiles.length > 0) {
      setFile(selectedFiles[0]);
    }
  };

  const addRedaction = () => {
    if (currentRedaction.page > 0 && currentRedaction.width > 0 && currentRedaction.height > 0) {
      setRedactions(prev => [...prev, { ...currentRedaction }]);
      setCurrentRedaction({
        page: 1,
        x: 0,
        y: 0,
        width: 100,
        height: 20,
      });
    } else {
      toast.error('Please enter valid redaction dimensions');
    }
  };

  const removeRedaction = (index) => {
    setRedactions(prev => prev.filter((_, i) => i !== index));
  };

  const handleRedactPDF = async () => {
    if (!file) {
      toast.error('Please select a PDF file');
      return;
    }

    if (redactions.length === 0) {
      toast.error('Please add at least one redaction area');
      return;
    }

    setIsProcessing(true);
    setProgress(0);

    try {
      const redactedPdfBytes = await redactPDF(file, redactions, (progressValue, message) => {
        setProgress(progressValue);
      });

      const blob = new Blob([redactedPdfBytes], { type: 'application/pdf' });
      downloadBlob(blob, 'redacted.pdf');
      toast.success('Content redacted successfully!');
      onClose();
    } catch (error) {
      console.error('Error redacting PDF:', error);
      toast.error('Error redacting PDF. Please try again.');
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Redact PDF
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
            <FileUpload
              onFilesSelected={handleFileSelected}
              multiple={false}
              maxFiles={1}
              accept=".pdf"
            />
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Add Redaction Areas
            </h3>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Page Number
                </label>
                <input
                  type="number"
                  value={currentRedaction.page}
                  onChange={(e) => setCurrentRedaction(prev => ({ ...prev, page: parseInt(e.target.value) || 1 }))}
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  X Position
                </label>
                <input
                  type="number"
                  value={currentRedaction.x}
                  onChange={(e) => setCurrentRedaction(prev => ({ ...prev, x: parseFloat(e.target.value) || 0 }))}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Y Position
                </label>
                <input
                  type="number"
                  value={currentRedaction.y}
                  onChange={(e) => setCurrentRedaction(prev => ({ ...prev, y: parseFloat(e.target.value) || 0 }))}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Width
                </label>
                <input
                  type="number"
                  value={currentRedaction.width}
                  onChange={(e) => setCurrentRedaction(prev => ({ ...prev, width: parseFloat(e.target.value) || 0 }))}
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Height
              </label>
              <input
                type="number"
                value={currentRedaction.height}
                onChange={(e) => setCurrentRedaction(prev => ({ ...prev, height: parseFloat(e.target.value) || 0 }))}
                min="1"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>

            <button
              onClick={addRedaction}
              className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Add Redaction Area
            </button>
          </div>

          {redactions.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Redaction Areas ({redactions.length})
              </h3>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {redactions.map((redaction, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                    <div className="text-sm text-gray-700 dark:text-gray-300">
                      Page {redaction.page}: ({redaction.x}, {redaction.y}) - {redaction.width}×{redaction.height}
                    </div>
                    <button
                      onClick={() => removeRedaction(index)}
                      className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg mb-6">
            <h3 className="text-sm font-medium text-red-800 dark:text-red-200 mb-2">
              Important Warning
            </h3>
            <div className="text-xs text-red-700 dark:text-red-300">
              Redaction permanently removes content from the PDF. Make sure you have permission to redact this content and that you&#39;re redacting the correct areas.
            </div>
          </div>

          {isProcessing && (
            <div className="mb-4">
              <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Processing... {progress}%
              </p>
            </div>
          )}

          <div className="flex justify-end space-x-4">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              onClick={handleRedactPDF}
              disabled={!file || redactions.length === 0 || isProcessing}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? 'Redacting...' : 'Redact PDF'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
