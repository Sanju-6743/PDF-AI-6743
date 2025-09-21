"use client";

import { useState } from 'react';
import { XMarkIcon, PhotoIcon } from '@heroicons/react/24/outline';
import FileUpload from './FileUpload';
import { downloadBlob } from '../utils/pdfUtils';
import toast from 'react-hot-toast';

export default function ExtractImagesModal({ isOpen, onClose }) {
  const [file, setFile] = useState(null);
  const [images, setImages] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showPreview, setShowPreview] = useState(false);

  const handleFileSelected = (selectedFiles) => {
    if (selectedFiles.length > 0) {
      setFile(selectedFiles[0]);
      setImages([]);
      setShowPreview(false);
    }
  };

  const handleExtractImages = async () => {
    if (!file) {
      toast.error('Please select a PDF file');
      return;
    }

    setIsProcessing(true);
    setProgress(10);

    try {
      const formData = new FormData();
      formData.append('file', file);

      setProgress(30);

      const response = await fetch('/api/extract-images', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('API Error:', errorData);
        throw new Error(errorData.details || errorData.error || 'Extraction failed');
      }

      setProgress(80);

      const result = await response.json();
      setImages(result.images || []);
      setShowPreview(true);
      const method = result.method || 'unknown';
      toast.success(`Extracted ${result.images?.length || 0} images using ${method}!`);
    } catch (error) {
      console.error('Extract images error:', error);
      toast.error('Error extracting images from PDF. Please try again.');
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  const handleDownloadImage = (imageData, filename) => {
    const blob = new Blob([new Uint8Array(imageData)], { type: 'image/png' });
    downloadBlob(blob, filename);
    toast.success('Image downloaded!');
  };

  const handleDownloadAllImages = () => {
    images.forEach((image, index) => {
      const blob = new Blob([new Uint8Array(image.data)], { type: 'image/png' });
      downloadBlob(blob, `extracted_image_${index + 1}.png`);
    });
    toast.success('All images downloaded!');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Extract Images
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
              Select PDF File
            </label>
            <FileUpload
              onFilesSelected={handleFileSelected}
              multiple={false}
              maxFiles={1}
              accept=".pdf"
            />
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-6">
            <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
              Image Extraction Details
            </h3>
            <div className="text-xs text-blue-700 dark:text-blue-300">
              This tool extracts all images found in your PDF document. Images will be saved as PNG files.
              Note: Some PDFs may contain embedded images that cannot be extracted due to security restrictions.
            </div>
          </div>

          {!showPreview && (
            <div className="flex justify-center mb-6">
              <button
                onClick={handleExtractImages}
                disabled={!file || isProcessing}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <PhotoIcon className="h-5 w-5" />
                <span>{isProcessing ? 'Extracting...' : 'Extract Images'}</span>
              </button>
            </div>
          )}

          {isProcessing && (
            <div className="mb-6">
              <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 text-center">
                Processing... {progress}%
              </p>
            </div>
          )}

          {showPreview && images.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Extracted Images ({images.length})
                </h3>
                <button
                  onClick={handleDownloadAllImages}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2"
                >
                  <PhotoIcon className="h-4 w-4" />
                  <span>Download All</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {images.map((image, index) => (
                  <div key={index} className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                    <div className="aspect-w-16 aspect-h-9 mb-3">
                      <img
                        src={`data:image/png;base64,${btoa(String.fromCharCode(...new Uint8Array(image.data)))}`}
                        alt={`Extracted image ${index + 1}`}
                        className="w-full h-32 object-contain rounded"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Image {index + 1}
                      </div>
                      <button
                        onClick={() => handleDownloadImage(image.data, `extracted_image_${index + 1}.png`)}
                        className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                      >
                        Download
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-center mt-6 space-x-4">
                <button
                  onClick={() => setShowPreview(false)}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Extract Again
                </button>
                <button
                  onClick={handleDownloadAllImages}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Download All Images
                </button>
              </div>
            </div>
          )}

          {showPreview && images.length === 0 && (
            <div className="text-center py-8">
              <PhotoIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No Images Found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                This PDF doesn&#39;t contain any extractable images, or the images are embedded in a way that cannot be extracted.
              </p>
              <button
                onClick={() => setShowPreview(false)}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Try Another PDF
              </button>
            </div>
          )}

          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
