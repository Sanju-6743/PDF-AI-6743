"use client";

import { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import FileUpload from './FileUpload';
import { addWatermark, downloadBlob } from '../utils/pdfUtils';
import toast from 'react-hot-toast';

export default function WatermarkModal({ isOpen, onClose }) {
  const [file, setFile] = useState(null);
  const [watermarkText, setWatermarkText] = useState('DRAFT');
  const [fontSize, setFontSize] = useState(50);
  const [opacity, setOpacity] = useState(0.3);
  const [rotation, setRotation] = useState(45);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileSelected = (selectedFiles) => {
    if (selectedFiles.length > 0) {
      setFile(selectedFiles[0]);
    }
  };

  const handleAddWatermark = async () => {
    if (!file) {
      toast.error('Please select a PDF file');
      return;
    }
    if (!watermarkText.trim()) {
      toast.error('Please enter watermark text');
      return;
    }

    setIsProcessing(true);
    setProgress(0);

    try {
      const options = {
        fontSize: parseInt(fontSize),
        opacity: parseFloat(opacity),
        rotation: parseInt(rotation),
      };

      const watermarkedPdfBytes = await addWatermark(file, watermarkText, options, (progressValue, message) => {
        setProgress(progressValue);
      });

      const blob = new Blob([watermarkedPdfBytes], { type: 'application/pdf' });
      downloadBlob(blob, 'watermarked.pdf');
      toast.success('Watermark added successfully!');
      onClose();
    } catch (error) {
      console.error('Error adding watermark:', error);
      toast.error('Error adding watermark. Please try again.');
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
            Add Watermark
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
                Watermark Text
              </label>
              <input
                type="text"
                value={watermarkText}
                onChange={(e) => setWatermarkText(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Enter watermark text"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Font Size
                </label>
                <input
                  type="number"
                  value={fontSize}
                  onChange={(e) => setFontSize(e.target.value)}
                  min="10"
                  max="200"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Opacity
                </label>
                <input
                  type="number"
                  value={opacity}
                  onChange={(e) => setOpacity(e.target.value)}
                  min="0.1"
                  max="1"
                  step="0.1"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Rotation (degrees)
              </label>
              <input
                type="number"
                value={rotation}
                onChange={(e) => setRotation(e.target.value)}
                min="0"
                max="360"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
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
              onClick={handleAddWatermark}
              disabled={!file || !watermarkText.trim() || isProcessing}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? 'Adding Watermark...' : 'Add Watermark'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
