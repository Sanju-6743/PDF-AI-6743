"use client";

import { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import FileUpload from './FileUpload';
import { removePages, downloadBlob } from '../utils/pdfUtils';
import toast from 'react-hot-toast';

export default function RemoveModal({ isOpen, onClose }) {
  const [files, setFiles] = useState([]);
  const [pages, setPages] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressText, setProgressText] = useState('');

  const handleFilesSelected = (selectedFiles) => {
    setFiles(selectedFiles);
  };

  const handleRemove = async () => {
    if (files.length === 0) {
      toast.error('Please select a PDF file');
      return;
    }

    if (!pages.trim()) {
      toast.error('Please enter page numbers to remove');
      return;
    }

    const pageNumbers = pages.split(',').map(p => parseInt(p.trim())).filter(p => !isNaN(p));

    if (pageNumbers.length === 0) {
      toast.error('Please enter valid page numbers');
      return;
    }

    setIsProcessing(true);
    setProgress(0);
    setProgressText('Starting removal process...');

    try {
      const modifiedPdfBytes = await removePages(files[0], pageNumbers, (progressValue, text) => {
        setProgress(progressValue);
        setProgressText(text);
      });

      const blob = new Blob([modifiedPdfBytes], { type: 'application/pdf' });
      downloadBlob(blob, 'modified.pdf');

      toast.success(`Pages removed successfully! ${pageNumbers.length} page(s) removed`);
      onClose();
    } catch (error) {
      console.error('Error removing pages:', error);
      toast.error('Error removing pages. Please try again.');
    } finally {
      setIsProcessing(false);
      setProgress(0);
      setProgressText('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Remove Pages
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
              onFilesSelected={handleFilesSelected}
              multiple={false}
              accept={{ 'application/pdf': ['.pdf'] }}
              maxFiles={1}
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Page Numbers to Remove
            </label>
            <input
              type="text"
              value={pages}
              onChange={(e) => setPages(e.target.value)}
              placeholder="e.g., 1,3,5 or 2,4,6"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Enter page numbers separated by commas (e.g., 1,3,5)
            </p>
          </div>

          {isProcessing && (
            <div className="mb-6">
              <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                {progressText}
              </p>
            </div>
          )}

          <div className="flex justify-end space-x-4">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
              disabled={isProcessing}
            >
              Cancel
            </button>
            <button
              onClick={handleRemove}
              disabled={files.length === 0 || !pages.trim() || isProcessing}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? 'Removing...' : 'Remove Pages'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
