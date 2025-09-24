"use client";

import { useState } from 'react';
import { XMarkIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import FileUpload from './FileUpload';
import { unlockPDF, downloadBlob } from '../utils/pdfUtils';
import toast from 'react-hot-toast';

export default function UnlockModal({ isOpen, onClose }) {
  const [file, setFile] = useState(null);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileSelected = (selectedFiles) => {
    if (selectedFiles.length > 0) {
      setFile(selectedFiles[0]);
    }
  };

  const handleUnlockPDF = async () => {
    if (!file) {
      toast.error('Please select a PDF file');
      return;
    }

    if (!password.trim()) {
      toast.error('Please enter the password');
      return;
    }

    setIsProcessing(true);
    setProgress(0);

    try {
      const unlockedPdfBytes = await unlockPDF(file, password, (progressValue, message) => {
        setProgress(progressValue);
      });

      const blob = new Blob([unlockedPdfBytes], { type: 'application/pdf' });
      downloadBlob(blob, 'unlocked.pdf');
      toast.success('PDF unlocked successfully!');
      onClose();
    } catch (error) {
      console.error('Error unlocking PDF:', error);
      toast.error('Incorrect password or unable to unlock PDF. Please try again.');
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
            Unlock PDF
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
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Enter password to unlock PDF"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                ) : (
                  <EyeIcon className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg mb-6">
            <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-2">
              Important Note
            </h3>
            <div className="text-xs text-yellow-700 dark:text-yellow-300">
              Make sure you have permission to unlock this PDF. Only unlock PDFs that you own or have been authorized to access.
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
              onClick={handleUnlockPDF}
              disabled={!file || !password.trim() || isProcessing}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? 'Unlocking...' : 'Unlock PDF'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
