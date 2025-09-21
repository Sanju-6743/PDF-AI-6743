"use client";

import { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import FileUpload from './FileUpload';
import { overlayPDFs, downloadBlob } from '../utils/pdfUtils';
import toast from 'react-hot-toast';

export default function OverlayModal({ isOpen, onClose }) {
  const [baseFile, setBaseFile] = useState(null);
  const [overlayFile, setOverlayFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleBaseFileSelected = (selectedFiles) => {
    if (selectedFiles.length > 0) {
      setBaseFile(selectedFiles[0]);
    }
  };

  const handleOverlayFileSelected = (selectedFiles) => {
    if (selectedFiles.length > 0) {
      setOverlayFile(selectedFiles[0]);
    }
  };

  const handleOverlayPDFs = async () => {
    if (!baseFile) {
      toast.error('Please select a base PDF file');
      return;
    }

    if (!overlayFile) {
      toast.error('Please select an overlay PDF file');
      return;
    }

    setIsProcessing(true);
    setProgress(0);

    try {
      const overlaidPdfBytes = await overlayPDFs(baseFile, overlayFile, (progressValue, message) => {
        setProgress(progressValue);
      });

      const blob = new Blob([overlaidPdfBytes], { type: 'application/pdf' });
      downloadBlob(blob, 'overlaid.pdf');
      toast.success('PDFs overlaid successfully!');
      onClose();
    } catch (error) {
      console.error('Error overlaying PDFs:', error);
      toast.error('Error overlaying PDFs. Please try again.');
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
            Overlay PDFs
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
              Base PDF File
            </label>
            <FileUpload
              onFilesSelected={handleBaseFileSelected}
              multiple={false}
              maxFiles={1}
              accept=".pdf"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              This PDF will be the base document
            </p>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Overlay PDF File
            </label>
            <FileUpload
              onFilesSelected={handleOverlayFileSelected}
              multiple={false}
              maxFiles={1}
              accept=".pdf"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              This PDF will be overlaid on the base document
            </p>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-6">
            <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
              How it works
            </h3>
            <div className="text-xs text-blue-700 dark:text-blue-300">
              The overlay PDF will be placed on top of the base PDF. Both PDFs should have the same page count for best results. Pages will be overlaid in order (page 1 over page 1, page 2 over page 2, etc.).
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
              onClick={handleOverlayPDFs}
              disabled={!baseFile || !overlayFile || isProcessing}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? 'Overlaying...' : 'Overlay PDFs'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
