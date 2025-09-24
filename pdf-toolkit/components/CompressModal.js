"use client";

import { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import FileUpload from './FileUpload';
import { compressPDF, downloadBlob } from '../utils/pdfUtils';
import { useAuth } from '../lib/AuthContext';
import { logToolUsage } from '../utils/analytics';
import toast from 'react-hot-toast';

export default function CompressModal({ isOpen, onClose }) {
  const { user } = useAuth();
  const [files, setFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressText, setProgressText] = useState('');

  const handleFilesSelected = (selectedFiles) => {
    setFiles(selectedFiles);
  };

  const handleCompress = async () => {
    if (files.length === 0) {
      toast.error('Please select a PDF file to compress');
      return;
    }

    setIsProcessing(true);
    setProgress(0);
    setProgressText('Starting compression...');

    const startTime = Date.now();
    let success = false;
    let errorMessage = null;

    try {
      const compressedPdfBytes = await compressPDF(files[0], (progressValue, text) => {
        setProgress(progressValue);
        setProgressText(text);
      });

      const processingTime = Date.now() - startTime;
      const originalSize = files[0].size;
      const compressedSize = compressedPdfBytes.length;
      const compressionRatio = ((originalSize - compressedSize) / originalSize * 100).toFixed(1);

      const blob = new Blob([compressedPdfBytes], { type: 'application/pdf' });
      downloadBlob(blob, 'compressed.pdf');

      success = true;
      toast.success(`PDF compressed! Reduced by ${compressionRatio}%`);

      // Log successful tool usage
      if (user) {
        await logToolUsage(
          user.id,
          'compress',
          files[0].name,
          true,
          processingTime,
          {
            original_size_bytes: originalSize,
            compressed_size_bytes: compressedSize,
            compression_ratio_percent: parseFloat(compressionRatio)
          }
        );
      }

      onClose();
    } catch (error) {
      const processingTime = Date.now() - startTime;
      errorMessage = error.message || 'Unknown error';
      console.error('Error compressing PDF:', error);
      toast.error('Error compressing PDF. Please try again.');

      // Log failed tool usage
      if (user) {
        await logToolUsage(
          user.id,
          'compress',
          files[0].name,
          false,
          processingTime,
          { error: errorMessage }
        );
      }
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
            Compress PDF
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
              onClick={handleCompress}
              disabled={files.length === 0 || isProcessing}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? 'Compressing...' : 'Compress PDF'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
