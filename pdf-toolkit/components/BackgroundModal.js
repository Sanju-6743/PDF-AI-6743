"use client";

import { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import FileUpload from './FileUpload';
import { changeBackground, downloadBlob } from '../utils/pdfUtils';
import toast from 'react-hot-toast';
import { rgb } from 'pdf-lib';

export default function BackgroundModal({ isOpen, onClose }) {
  const [file, setFile] = useState(null);
  const [backgroundType, setBackgroundType] = useState('color');
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileSelected = (selectedFiles) => {
    if (selectedFiles.length > 0) {
      setFile(selectedFiles[0]);
    }
  };

  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16) / 255,
      g: parseInt(result[2], 16) / 255,
      b: parseInt(result[3], 16) / 255,
    } : { r: 1, g: 1, b: 1 };
  };

  const handleChangeBackground = async () => {
    if (!file) {
      toast.error('Please select a PDF file');
      return;
    }

    setIsProcessing(true);
    setProgress(0);

    try {
      let backgroundRgb;

      if (backgroundType === 'color') {
        const rgbValues = hexToRgb(backgroundColor);
        backgroundRgb = rgb(rgbValues.r, rgbValues.g, rgbValues.b);
      } else {
        // For now, we'll use a default color for image backgrounds
        // In a full implementation, you'd handle image backgrounds here
        backgroundRgb = rgb(1, 1, 1);
      }

      const backgroundPdfBytes = await changeBackground(file, backgroundRgb, (progressValue, message) => {
        setProgress(progressValue);
      });

      const blob = new Blob([backgroundPdfBytes], { type: 'application/pdf' });
      downloadBlob(blob, 'background-changed.pdf');
      toast.success('Background changed successfully!');
      onClose();
    } catch (error) {
      console.error('Error changing background:', error);
      toast.error('Error changing background. Please try again.');
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  const presetColors = [
    { name: 'White', value: '#ffffff' },
    { name: 'Light Gray', value: '#f5f5f5' },
    { name: 'Light Blue', value: '#e3f2fd' },
    { name: 'Light Green', value: '#e8f5e8' },
    { name: 'Light Yellow', value: '#fffde7' },
    { name: 'Light Pink', value: '#fce4ec' },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Change Background
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
              Background Type
            </label>
            <select
              value={backgroundType}
              onChange={(e) => setBackgroundType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="color">Solid Color</option>
              <option value="image">Image (Coming Soon)</option>
            </select>
          </div>

          {backgroundType === 'color' && (
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Background Color
                </label>
                <div className="flex space-x-4">
                  <input
                    type="color"
                    value={backgroundColor}
                    onChange={(e) => setBackgroundColor(e.target.value)}
                    className="w-16 h-10 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer"
                  />
                  <input
                    type="text"
                    value={backgroundColor}
                    onChange={(e) => setBackgroundColor(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="#ffffff"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Preset Colors
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {presetColors.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => setBackgroundColor(color.value)}
                      className="flex items-center space-x-2 p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div
                        className="w-6 h-6 rounded border border-gray-300"
                        style={{ backgroundColor: color.value }}
                      ></div>
                      <span className="text-sm text-gray-700 dark:text-gray-300">{color.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {backgroundType === 'image' && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg mb-6">
              <div className="text-sm text-yellow-800 dark:text-yellow-200">
                Image background functionality is coming soon. For now, only solid colors are supported.
              </div>
            </div>
          )}

          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-6">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Preview</h3>
            <div
              className="w-full h-20 rounded border border-gray-300 flex items-center justify-center text-sm text-gray-500"
              style={{ backgroundColor: backgroundType === 'color' ? backgroundColor : '#ffffff' }}
            >
              {backgroundType === 'color' ? 'Selected Color' : 'Image Preview (Coming Soon)'}
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
              onClick={handleChangeBackground}
              disabled={!file || isProcessing}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? 'Changing...' : 'Change Background'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
