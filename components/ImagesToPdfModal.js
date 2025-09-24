"use client";

import { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import FileUpload from './FileUpload';
import { imagesToPdf, downloadBlob } from '../utils/pdfUtils';
import toast from 'react-hot-toast';

export default function ImagesToPdfModal({ isOpen, onClose }) {
  const [images, setImages] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleImagesSelected = (selectedFiles) => {
    // Filter to only image files
    const imageFiles = selectedFiles.filter(file =>
      file.type.startsWith('image/')
    );

    if (imageFiles.length !== selectedFiles.length) {
      toast.error('Only image files are allowed');
    }

    setImages(imageFiles);
  };

  const handleConvertToPdf = async () => {
    if (images.length === 0) {
      toast.error('Please select at least one image');
      return;
    }

    setIsProcessing(true);
    setProgress(0);

    try {
      const pdfBytes = await imagesToPdf(images, (progressValue, message) => {
        setProgress(progressValue);
      });

      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      downloadBlob(blob, 'images-to-pdf.pdf');
      toast.success('PDF created successfully!');
      onClose();
    } catch (error) {
      console.error('Images to PDF error:', error);
      toast.error('Error creating PDF from images. Please try again.');
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
            Images to PDF
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
              Select Images
            </label>
            <FileUpload
              onFilesSelected={handleImagesSelected}
              multiple={true}
              maxFiles={20}
              accept="image/*"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Supported formats: PNG, JPG, JPEG, GIF, WebP
            </p>
          </div>

          {images.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Selected Images ({images.length})
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {images.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`Image ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg border border-gray-200 dark:border-gray-600"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 rounded-b-lg">
                      {image.name}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-6">
            <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
              How it works
            </h3>
            <div className="text-xs text-blue-700 dark:text-blue-300">
              Each image will be converted to a separate page in the PDF. Images are automatically scaled and centered on each page.
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
              onClick={handleConvertToPdf}
              disabled={images.length === 0 || isProcessing}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? 'Creating PDF...' : 'Create PDF'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
