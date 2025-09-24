"use client";

import { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import FileUpload from './FileUpload';
import { mergePDFs, downloadBlob } from '../utils/pdfUtils';
import { useAuth } from '../lib/AuthContext';
import { sendProcessingUpdate } from '../lib/supabase';
import toast from 'react-hot-toast';

export default function MergeModal({ isOpen, onClose }) {
  const [files, setFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const { user } = useAuth();

  const handleFilesSelected = (selectedFiles) => {
    setFiles(selectedFiles);
  };

  const handleMerge = async () => {
    if (files.length < 2) {
      toast.error('Please select at least 2 PDF files to merge');
      return;
    }

    setIsProcessing(true);
    try {
      // Send real-time notification for processing start
      if (user) {
        await sendProcessingUpdate(user.id, 'info', `Starting to merge ${files.length} PDF files...`);
      }

      const mergedPdfBytes = await mergePDFs(files);
      const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
      downloadBlob(blob, 'merged.pdf');

      // Send real-time notification for success
      if (user) {
        await sendProcessingUpdate(user.id, 'success', `Successfully merged ${files.length} PDF files!`);
      }

      toast.success('PDFs merged successfully!');
      onClose();
    } catch (error) {
      console.error('Error merging PDFs:', error);

      // Send real-time notification for error
      if (user) {
        await sendProcessingUpdate(user.id, 'error', 'Failed to merge PDF files. Please try again.');
      }

      toast.error('Error merging PDFs. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Merge PDFs
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
              multiple={true}
              maxFiles={20}
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              onClick={handleMerge}
              disabled={files.length < 2 || isProcessing}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? 'Merging...' : 'Merge PDFs'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
