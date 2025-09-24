"use client";

import { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import FileUpload from './FileUpload';
import { editMetadata, downloadBlob } from '../utils/pdfUtils';
import toast from 'react-hot-toast';

export default function MetadataModal({ isOpen, onClose }) {
  const [file, setFile] = useState(null);
  const [metadata, setMetadata] = useState({
    title: '',
    author: '',
    subject: '',
    creator: '',
    producer: '',
    keywords: '',
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileSelected = (selectedFiles) => {
    if (selectedFiles.length > 0) {
      setFile(selectedFiles[0]);
    }
  };

  const handleMetadataChange = (field, value) => {
    setMetadata(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleEditMetadata = async () => {
    if (!file) {
      toast.error('Please select a PDF file');
      return;
    }

    // Check if at least one field is filled
    const hasMetadata = Object.values(metadata).some(value => value.trim() !== '');
    if (!hasMetadata) {
      toast.error('Please fill at least one metadata field');
      return;
    }

    setIsProcessing(true);
    setProgress(0);

    try {
      const cleanMetadata = {};
      Object.keys(metadata).forEach(key => {
        if (metadata[key].trim()) {
          cleanMetadata[key] = metadata[key].trim();
        }
      });

      const updatedPdfBytes = await editMetadata(file, cleanMetadata, (progressValue, message) => {
        setProgress(progressValue);
      });

      const blob = new Blob([updatedPdfBytes], { type: 'application/pdf' });
      downloadBlob(blob, 'metadata-updated.pdf');
      toast.success('Metadata updated successfully!');
      onClose();
    } catch (error) {
      console.error('Error updating metadata:', error);
      toast.error('Error updating metadata. Please try again.');
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
            Edit Metadata
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

          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Title
              </label>
              <input
                type="text"
                value={metadata.title}
                onChange={(e) => handleMetadataChange('title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Document title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Author
              </label>
              <input
                type="text"
                value={metadata.author}
                onChange={(e) => handleMetadataChange('author', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Document author"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Subject
              </label>
              <input
                type="text"
                value={metadata.subject}
                onChange={(e) => handleMetadataChange('subject', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Document subject"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Creator
              </label>
              <input
                type="text"
                value={metadata.creator}
                onChange={(e) => handleMetadataChange('creator', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Application that created the document"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Producer
              </label>
              <input
                type="text"
                value={metadata.producer}
                onChange={(e) => handleMetadataChange('producer', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="PDF producer"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Keywords
              </label>
              <input
                type="text"
                value={metadata.keywords}
                onChange={(e) => handleMetadataChange('keywords', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Comma-separated keywords"
              />
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
              onClick={handleEditMetadata}
              disabled={!file || isProcessing}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? 'Updating...' : 'Update Metadata'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
