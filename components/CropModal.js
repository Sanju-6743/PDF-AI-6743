"use client";

import { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import FileUpload from './FileUpload';
import { cropPages, downloadBlob } from '../utils/pdfUtils';
import toast from 'react-hot-toast';

export default function CropModal({ isOpen, onClose }) {
  const [file, setFile] = useState(null);
  const [cropOptions, setCropOptions] = useState({
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  });
  const [unit, setUnit] = useState('points'); // points, inches, mm
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileSelected = (selectedFiles) => {
    if (selectedFiles.length > 0) {
      setFile(selectedFiles[0]);
    }
  };

  const handleCropOptionChange = (field, value) => {
    setCropOptions(prev => ({
      ...prev,
      [field]: parseFloat(value) || 0
    }));
  };

  const convertToPoints = (value, unit) => {
    switch (unit) {
      case 'inches':
        return value * 72; // 72 points per inch
      case 'mm':
        return (value * 72) / 25.4; // Convert mm to points
      case 'points':
      default:
        return value;
    }
  };

  const handleCropPages = async () => {
    if (!file) {
      toast.error('Please select a PDF file');
      return;
    }

    // Check if any crop margins are set
    const hasCropMargins = Object.values(cropOptions).some(value => value > 0);
    if (!hasCropMargins) {
      toast.error('Please set at least one crop margin');
      return;
    }

    setIsProcessing(true);
    setProgress(0);

    try {
      const convertedOptions = {
        top: convertToPoints(cropOptions.top, unit),
        bottom: convertToPoints(cropOptions.bottom, unit),
        left: convertToPoints(cropOptions.left, unit),
        right: convertToPoints(cropOptions.right, unit),
      };

      const croppedPdfBytes = await cropPages(file, convertedOptions, (progressValue, message) => {
        setProgress(progressValue);
      });

      const blob = new Blob([croppedPdfBytes], { type: 'application/pdf' });
      downloadBlob(blob, 'cropped.pdf');
      toast.success('Pages cropped successfully!');
      onClose();
    } catch (error) {
      console.error('Error cropping pages:', error);
      toast.error('Error cropping pages. Please try again.');
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
            Crop Pages
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
              Unit
            </label>
            <select
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="points">Points</option>
              <option value="inches">Inches</option>
              <option value="mm">Millimeters</option>
            </select>
          </div>

          <div className="space-y-4 mb-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Top Margin
                </label>
                <input
                  type="number"
                  value={cropOptions.top}
                  onChange={(e) => handleCropOptionChange('top', e.target.value)}
                  min="0"
                  step="0.1"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Bottom Margin
                </label>
                <input
                  type="number"
                  value={cropOptions.bottom}
                  onChange={(e) => handleCropOptionChange('bottom', e.target.value)}
                  min="0"
                  step="0.1"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Left Margin
                </label>
                <input
                  type="number"
                  value={cropOptions.left}
                  onChange={(e) => handleCropOptionChange('left', e.target.value)}
                  min="0"
                  step="0.1"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Right Margin
                </label>
                <input
                  type="number"
                  value={cropOptions.right}
                  onChange={(e) => handleCropOptionChange('right', e.target.value)}
                  min="0"
                  step="0.1"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-6">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Preview</h3>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              Margins will be cropped from all sides of each page.
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
              onClick={handleCropPages}
              disabled={!file || isProcessing}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? 'Cropping...' : 'Crop Pages'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
