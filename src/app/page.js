"use client";

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../lib/themeContext';
import ToolCard from "../../components/ToolCard";
import MergeModal from "../../components/MergeModal";
import CompressModal from "../../components/CompressModal";
import SplitModal from "../../components/SplitModal";
import ExtractModal from "../../components/ExtractModal";
import RemoveModal from "../../components/RemoveModal";
import DuplicateModal from "../../components/DuplicateModal";
import WatermarkModal from "../../components/WatermarkModal";
import PageNumbersModal from "../../components/PageNumbersModal";
import MetadataModal from "../../components/MetadataModal";
import CropModal from "../../components/CropModal";
import BackgroundModal from "../../components/BackgroundModal";
import OverlayModal from "../../components/OverlayModal";
import ProtectModal from "../../components/ProtectModal";
import UnlockModal from "../../components/UnlockModal";
import RedactModal from "../../components/RedactModal";
import SignatureModal from "../../components/SignatureModal";
import ImagesToPdfModal from "../../components/ImagesToPdfModal";
import PdfToTextModal from "../../components/PdfToTextModal";
import PdfToWordModal from "../../components/PdfToWordModal";
import ExtractImagesModal from "../../components/ExtractImagesModal";
import ExtractFontsModal from "../../components/ExtractFontsModal";
import ConversionPlaceholderModal from "../../components/ConversionPlaceholderModal";
import { Toaster } from 'react-hot-toast';
import SearchBar from "../../components/SearchBar";
import {
  FileText,
  Scissors,
  Archive,
  RotateCw,
  Move,
  Trash2,
  Download,
  Copy,
  Droplets,
  Hash,
  Edit,
  Crop,
  Palette,
  Layers,
  Lock,
  Unlock,
  EyeOff,
  PenTool,
  FileType,
  Image,
  Video,
  Music,
  Code,
  FileSpreadsheet,
  FileText as FileTextIcon,
  Image as ImageIcon,
  Type,
  Highlighter,
  MessageSquare,
  Brush,
  Bookmark,
  FormInput,
  FileCheck,
  Database,
  Zap,
  GitCompare,
  Search,
  Bot,
  Languages,
  BookOpen,
  MessageCircle,
  Tag
} from "lucide-react";

export default function Home() {
  const { getThemeClasses } = useTheme();
  const themeClasses = getThemeClasses();

  const [filteredTools, setFilteredTools] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

  const [mergeModalOpen, setMergeModalOpen] = useState(false);
  const [compressModalOpen, setCompressModalOpen] = useState(false);
  const [splitModalOpen, setSplitModalOpen] = useState(false);
  const [extractModalOpen, setExtractModalOpen] = useState(false);
  const [removeModalOpen, setRemoveModalOpen] = useState(false);
  const [duplicateModalOpen, setDuplicateModalOpen] = useState(false);

  // Advanced tool modals
  const [watermarkModalOpen, setWatermarkModalOpen] = useState(false);
  const [pageNumbersModalOpen, setPageNumbersModalOpen] = useState(false);
  const [metadataModalOpen, setMetadataModalOpen] = useState(false);
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [backgroundModalOpen, setBackgroundModalOpen] = useState(false);
  const [overlayModalOpen, setOverlayModalOpen] = useState(false);
  const [protectModalOpen, setProtectModalOpen] = useState(false);
  const [unlockModalOpen, setUnlockModalOpen] = useState(false);
  const [redactModalOpen, setRedactModalOpen] = useState(false);
  const [signatureModalOpen, setSignatureModalOpen] = useState(false);

  // Conversion tool modals
  const [imagesToPdfModalOpen, setImagesToPdfModalOpen] = useState(false);
  const [pdfToTextModalOpen, setPdfToTextModalOpen] = useState(false);
  const [pdfToWordModalOpen, setPdfToWordModalOpen] = useState(false);
  const [extractImagesModalOpen, setExtractImagesModalOpen] = useState(false);
  const [extractFontsModalOpen, setExtractFontsModalOpen] = useState(false);
  const [conversionPlaceholderModalOpen, setConversionPlaceholderModalOpen] = useState(false);
  const [currentPlaceholderTitle, setCurrentPlaceholderTitle] = useState('');
  const [currentPlaceholderDescription, setCurrentPlaceholderDescription] = useState('');
  const [currentPlaceholderRequirements, setCurrentPlaceholderRequirements] = useState([]);

  const handleToolClick = (toolName) => {
    if (toolName === "Merge PDFs") {
      setMergeModalOpen(true);
    } else if (toolName === "Compress PDF") {
      setCompressModalOpen(true);
    } else if (toolName === "Split PDFs") {
      setSplitModalOpen(true);
    } else if (toolName === "Extract Pages") {
      setExtractModalOpen(true);
    } else if (toolName === "Remove Pages") {
      setRemoveModalOpen(true);
    } else if (toolName === "Duplicate Pages") {
      setDuplicateModalOpen(true);
    } else if (toolName === "Add Watermark") {
      setWatermarkModalOpen(true);
    } else if (toolName === "Add Page Numbers") {
      setPageNumbersModalOpen(true);
    } else if (toolName === "Edit Metadata") {
      setMetadataModalOpen(true);
    } else if (toolName === "Crop Pages") {
      setCropModalOpen(true);
    } else if (toolName === "Change Background") {
      setBackgroundModalOpen(true);
    } else if (toolName === "Overlay PDFs") {
      setOverlayModalOpen(true);
    } else if (toolName === "Protect PDF") {
      setProtectModalOpen(true);
    } else if (toolName === "Unlock PDF") {
      setUnlockModalOpen(true);
    } else if (toolName === "Redact PDF") {
      setRedactModalOpen(true);
    } else if (toolName === "Digital Signature") {
      setSignatureModalOpen(true);
    } else if (toolName === "Images to PDF") {
      setImagesToPdfModalOpen(true);
    } else if (toolName === "PDF to TXT") {
      setPdfToTextModalOpen(true);
    } else if (toolName === "PDF to Word") {
      setPdfToWordModalOpen(true);
    } else if (toolName === "Extract Images") {
      setExtractImagesModalOpen(true);
    } else if (toolName === "Extract Fonts") {
      setExtractFontsModalOpen(true);
    } else if (toolName === "PDF to Excel") {
      // Handle PDF to Excel conversion
      handleConversion("PDF to Excel", "/api/pdf-to-excel");
    } else if (toolName === "PDF to PPT") {
      // Handle PDF to PPT conversion
      handleConversion("PDF to PPT", "/api/pdf-to-ppt");
    } else if (toolName === "PDF to HTML") {
      // Handle PDF to HTML conversion
      handleConversion("PDF to HTML", "/api/pdf-to-html");
    } else if (toolName === "PDF to ePub") {
      // Handle PDF to ePub conversion
      handleConversion("PDF to ePub", "/api/pdf-to-epub");
    } else if (toolName === "PDF to CSV") {
      // Handle PDF to CSV conversion
      handleConversion("PDF to CSV", "/api/pdf-to-csv");
    } else if (toolName === "PDF to Markdown") {
      // Handle PDF to Markdown conversion
      handleConversion("PDF to Markdown", "/api/pdf-to-markdown");
    } else if (toolName === "PDF to Images") {
      // Handle PDF to Images conversion
      handleConversion("PDF to Images", "/api/pdf-to-images");
    } else if (toolName === "OCR Text Extraction") {
      // Handle OCR Text Extraction
      handleConversion("OCR Text Extraction", "/api/ocr-extract");
    } else if (toolName === "AI Translate") {
      // Handle AI Translate
      handleAITool("AI Translate", "/api/ai-translate");
    } else if (toolName === "AI Summarize") {
      // Handle AI Summarize
      handleAITool("AI Summarize", "/api/ai-summarize");
    } else if (toolName === "Chat with PDF") {
      // Handle Chat with PDF
      handleChatTool("Chat with PDF");
    } else if (toolName === "Keyword Search") {
      // Handle Keyword Search
      handleSearchTool("Keyword Search");
    } else {
      alert(`${toolName} tool selected. Implementation coming soon!`);
    }
  };

  const basicTools = [
    { icon: FileText, title: "Merge PDFs", description: "Combine multiple PDF files into one", onClick: () => handleToolClick("Merge PDFs") },
    { icon: Scissors, title: "Split PDFs", description: "Split PDF by pages, size, or bookmarks", onClick: () => handleToolClick("Split PDFs") },
    { icon: Archive, title: "Compress PDF", description: "Reduce PDF file size", onClick: () => handleToolClick("Compress PDF") },
    { icon: RotateCw, title: "Rotate PDF", description: "Rotate pages in PDF", onClick: () => handleToolClick("Rotate PDF") },
    { icon: Move, title: "Reorder Pages", description: "Drag & drop to reorder PDF pages", onClick: () => handleToolClick("Reorder Pages") },
    { icon: Trash2, title: "Remove Pages", description: "Delete specific pages from PDF", onClick: () => handleToolClick("Remove Pages") },
    { icon: Download, title: "Extract Pages", description: "Extract specific pages to new PDF", onClick: () => handleToolClick("Extract Pages") },
    { icon: Copy, title: "Duplicate Pages", description: "Duplicate pages within PDF", onClick: () => handleToolClick("Duplicate Pages") },
  ];

  const advancedTools = [
    { icon: Droplets, title: "Add Watermark", description: "Add text or image watermark", onClick: () => handleToolClick("Add Watermark") },
    { icon: Hash, title: "Add Page Numbers", description: "Add page numbers to PDF", onClick: () => handleToolClick("Add Page Numbers") },
    { icon: Edit, title: "Edit Metadata", description: "Edit title, author, keywords", onClick: () => handleToolClick("Edit Metadata") },
    { icon: Crop, title: "Crop Pages", description: "Crop margins from PDF pages", onClick: () => handleToolClick("Crop Pages") },
    { icon: Palette, title: "Change Background", description: "Change PDF background color", onClick: () => handleToolClick("Change Background") },
    { icon: Layers, title: "Overlay PDFs", description: "Overlay one PDF on another", onClick: () => handleToolClick("Overlay PDFs") },
    { icon: Lock, title: "Protect PDF", description: "Add password protection", onClick: () => handleToolClick("Protect PDF") },
    { icon: Unlock, title: "Unlock PDF", description: "Remove password protection", onClick: () => handleToolClick("Unlock PDF") },
    { icon: EyeOff, title: "Redact PDF", description: "Blackout sensitive information", onClick: () => handleToolClick("Redact PDF") },
    { icon: PenTool, title: "Digital Signature", description: "Add eSign to PDF", onClick: () => handleToolClick("Digital Signature") },
  ];

  const conversionTools = [
    { icon: FileType, title: "PDF to Word", description: "Convert PDF to Word document", onClick: () => handleToolClick("PDF to Word") },
    { icon: FileSpreadsheet, title: "PDF to Excel", description: "Convert PDF to Excel spreadsheet", onClick: () => handleToolClick("PDF to Excel") },
    { icon: Video, title: "PDF to PPT", description: "Convert PDF to PowerPoint", onClick: () => handleToolClick("PDF to PPT") },
    { icon: FileTextIcon, title: "PDF to TXT", description: "Convert PDF to plain text", onClick: () => handleToolClick("PDF to TXT") },
    { icon: Code, title: "PDF to HTML", description: "Convert PDF to HTML", onClick: () => handleToolClick("PDF to HTML") },
    { icon: BookOpen, title: "PDF to ePub", description: "Convert PDF to ePub format", onClick: () => handleToolClick("PDF to ePub") },
    { icon: Database, title: "PDF to CSV", description: "Convert PDF to CSV", onClick: () => handleToolClick("PDF to CSV") },
    { icon: FileTextIcon, title: "PDF to Markdown", description: "Convert PDF to Markdown", onClick: () => handleToolClick("PDF to Markdown") },
    { icon: Image, title: "PDF to Images", description: "Convert PDF pages to images", onClick: () => handleToolClick("PDF to Images") },
    { icon: FileText, title: "Images to PDF", description: "Convert images to PDF", onClick: () => handleToolClick("Images to PDF") },
  ];

  const annotationTools = [
    { icon: Image, title: "Extract Images", description: "Extract images from PDF", onClick: () => handleToolClick("Extract Images") },
    { icon: Type, title: "Extract Fonts", description: "Extract fonts from PDF", onClick: () => handleToolClick("Extract Fonts") },
    { icon: Highlighter, title: "Highlight Text", description: "Highlight text in PDF", onClick: () => handleToolClick("Highlight Text") },
    { icon: MessageSquare, title: "Add Comments", description: "Add comments and notes", onClick: () => handleToolClick("Add Comments") },
    { icon: Brush, title: "Draw on PDF", description: "Freehand drawing annotation", onClick: () => handleToolClick("Draw on PDF") },
    { icon: Bookmark, title: "Bookmark Pages", description: "Add bookmarks to PDF", onClick: () => handleToolClick("Bookmark Pages") },
  ];

  const formTools = [
    { icon: FormInput, title: "Fill PDF Forms", description: "Fill out PDF forms", onClick: () => handleToolClick("Fill PDF Forms") },
    { icon: FileCheck, title: "Create PDF Forms", description: "Create interactive PDF forms", onClick: () => handleToolClick("Create PDF Forms") },
    { icon: Database, title: "Flatten Forms", description: "Make forms non-editable", onClick: () => handleToolClick("Flatten Forms") },
    { icon: FileSpreadsheet, title: "Export Form Data", description: "Export form data to CSV/Excel", onClick: () => handleToolClick("Export Form Data") },
  ];

  const batchTools = [
    { icon: Zap, title: "Batch Processing", description: "Apply actions to multiple PDFs", onClick: () => handleToolClick("Batch Processing") },
    { icon: GitCompare, title: "Compare PDFs", description: "Compare two PDFs and highlight differences", onClick: () => handleToolClick("Compare PDFs") },
  ];

  const aiTools = [
    { icon: Search, title: "OCR Text Extraction", description: "Extract text using Optic API", onClick: () => handleToolClick("OCR Text Extraction") },
    { icon: Languages, title: "AI Translate", description: "Translate PDF content with AI", onClick: () => handleToolClick("AI Translate") },
    { icon: BookOpen, title: "AI Summarize", description: "Summarize PDF with AI", onClick: () => handleToolClick("AI Summarize") },
    { icon: MessageCircle, title: "Chat with PDF", description: "Ask questions about PDF content", onClick: () => handleToolClick("Chat with PDF") },
    { icon: Tag, title: "Keyword Search", description: "Search and auto-tag PDF", onClick: () => handleToolClick("Keyword Search") },
  ];

  // Initialize filtered tools with all tools
  useEffect(() => {
    const allTools = [...basicTools, ...advancedTools, ...conversionTools, ...annotationTools, ...formTools, ...batchTools, ...aiTools];
    setFilteredTools(allTools);
    setSearchResults(allTools);
  }, []);

  const handleSearchResults = useCallback((results) => {
    setSearchResults(results);
  }, []);

  const handleConversion = async (toolName, apiEndpoint) => {
    // Create a file input for the user to select a PDF
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf';
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch(apiEndpoint, {
          method: 'POST',
          body: formData,
        });

        const result = await response.json();

        if (result.success) {
          // For now, just show the result in console and alert
          // In a real implementation, you'd download the file or show results
          console.log(`${toolName} result:`, result);
          alert(`${toolName} completed! Check console for results.`);
        } else {
          alert(`Error: ${result.error}`);
        }
      } catch (error) {
        console.error(`Error with ${toolName}:`, error);
        alert(`Error processing ${toolName}`);
      }
    };
    input.click();
  };

  const handleAITool = async (toolName, apiEndpoint) => {
    // Create a file input for the user to select a PDF
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf';
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      // For AI tools, we might need additional parameters
      let additionalData = {};

      if (toolName === 'AI Translate') {
        const targetLanguage = prompt('Enter target language (es, fr, de, it, pt, ru, ja, ko, zh, ar, hi):', 'es');
        if (!targetLanguage) return;
        additionalData.targetLanguage = targetLanguage;
      } else if (toolName === 'AI Summarize') {
        const summaryLength = prompt('Choose summary length (short, medium, long):', 'medium');
        if (!summaryLength) return;
        additionalData.length = summaryLength;
      }

      try {
        const formData = new FormData();
        formData.append('file', file);

        // Add additional parameters
        Object.keys(additionalData).forEach(key => {
          formData.append(key, additionalData[key]);
        });

        const response = await fetch(apiEndpoint, {
          method: 'POST',
          body: formData,
        });

        const result = await response.json();

        if (result.success) {
          console.log(`${toolName} result:`, result);
          alert(`${toolName} completed! Check console for results.`);
        } else {
          alert(`Error: ${result.error}`);
        }
      } catch (error) {
        console.error(`Error with ${toolName}:`, error);
        alert(`Error processing ${toolName}`);
      }
    };
    input.click();
  };

  const handleChatTool = async (toolName) => {
    // For chat functionality, we'd need a more complex UI
    // For now, just show a placeholder
    alert('Chat with PDF feature requires a dedicated chat interface. Implementation coming soon!');
  };

  const handleSearchTool = async (toolName) => {
    // Create a file input for the user to select a PDF
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf';
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const keywords = prompt('Enter keywords to search for:');
      if (!keywords) return;

      const searchType = prompt('Search type (exact, fuzzy, semantic):', 'exact');
      if (!searchType) return;

      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('keywords', keywords);
        formData.append('searchType', searchType);

        const response = await fetch('/api/keyword-search', {
          method: 'POST',
          body: formData,
        });

        const result = await response.json();

        if (result.success) {
          console.log(`${toolName} result:`, result);
          alert(`${toolName} completed! Found results for "${keywords}". Check console for details.`);
        } else {
          alert(`Error: ${result.error}`);
        }
      } catch (error) {
        console.error(`Error with ${toolName}:`, error);
        alert(`Error processing ${toolName}`);
      }
    };
    input.click();
  };

  const toolsData = {
    basicTools,
    advancedTools,
    conversionTools,
    annotationTools,
    formTools,
    batchTools,
    aiTools
  };

  return (
    <>
      {/* Enhanced Hero Section with Glassmorphism */}
      <section className="relative bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20 py-20 overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl float-animation"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400/20 rounded-full blur-3xl float-animation" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="hero-title text-4xl md:text-6xl lg:text-7xl font-bold gradient-text mb-6"
            >
              Professional PDF Tools
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed"
            >
              Transform, edit, and manage your PDF documents with our comprehensive toolkit.
              All processing happens locally for maximum privacy and security.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
            >
              <button className="glass-card hover:glass-card-dark text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 hover:scale-105 focus-ring">
                Get Started
              </button>
              <button className="glass-card hover:glass-card-dark text-gray-700 dark:text-gray-300 px-8 py-4 rounded-2xl font-semibold transition-all duration-300 hover:scale-105 focus-ring">
                Learn More
              </button>
            </motion.div>

            {/* Enhanced Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto"
            >
              <div className="glass-card rounded-2xl p-6 hover:scale-105 transition-transform duration-300">
                <div className="text-4xl font-bold gradient-text mb-2">50+</div>
                <div className="text-gray-600 dark:text-gray-400 font-medium">PDF Tools</div>
              </div>
              <div className="glass-card rounded-2xl p-6 hover:scale-105 transition-transform duration-300">
                <div className="text-4xl font-bold gradient-text mb-2">100%</div>
                <div className="text-gray-600 dark:text-gray-400 font-medium">Privacy</div>
              </div>
              <div className="glass-card rounded-2xl p-6 hover:scale-105 transition-transform duration-300">
                <div className="text-4xl font-bold gradient-text mb-2">Free</div>
                <div className="text-gray-600 dark:text-gray-400 font-medium">Forever</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Tools Grid */}
      <section id="tools" className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Choose Your Tool
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
              Select from our comprehensive collection of PDF processing tools
            </p>

            {/* Search Bar */}
            <SearchBar tools={toolsData} onSearchResults={handleSearchResults} />
          </div>

          {/* Enhanced Tools Grid with Glassmorphism */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="tool-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6"
          >
            {searchResults.map((tool, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="group glass-card rounded-2xl p-6 hover:scale-105 transition-all duration-300 cursor-pointer hover:shadow-2xl focus-ring"
                onClick={tool.onClick}
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div className="tool-icon w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-3"
                       style={{
                         background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(147, 51, 234, 0.2))',
                         border: '1px solid rgba(59, 130, 246, 0.3)'
                       }}>
                    <tool.icon
                      className="w-6 h-6 transition-colors duration-300"
                      style={{ color: 'var(--theme-icon)' }}
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400">
                      {tool.title}
                    </h3>
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  {tool.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Enhanced Features Section with Glassmorphism */}
      <section id="features" className="py-20 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-4">
              Why Choose PDF Toolkit?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Built for professionals who value privacy and efficiency
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="glass-card rounded-3xl p-8 text-center hover:scale-105 transition-all duration-300 group"
            >
              <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">100% Private</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                All processing happens in your browser. Your files never leave your device.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="glass-card rounded-3xl p-8 text-center hover:scale-105 transition-all duration-300 group"
            >
              <div className="w-20 h-20 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Lightning Fast</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Process large PDF files instantly with our optimized algorithms.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="glass-card rounded-3xl p-8 text-center hover:scale-105 transition-all duration-300 group"
            >
              <div className="w-20 h-20 bg-gradient-to-r from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">AI Powered</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Advanced AI features for intelligent PDF processing and analysis.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <MergeModal
        isOpen={mergeModalOpen}
        onClose={() => setMergeModalOpen(false)}
      />

      <CompressModal
        isOpen={compressModalOpen}
        onClose={() => setCompressModalOpen(false)}
      />

      <SplitModal
        isOpen={splitModalOpen}
        onClose={() => setSplitModalOpen(false)}
      />

      <ExtractModal
        isOpen={extractModalOpen}
        onClose={() => setExtractModalOpen(false)}
      />

      <RemoveModal
        isOpen={removeModalOpen}
        onClose={() => setRemoveModalOpen(false)}
      />

      <DuplicateModal
        isOpen={duplicateModalOpen}
        onClose={() => setDuplicateModalOpen(false)}
      />

      <WatermarkModal
        isOpen={watermarkModalOpen}
        onClose={() => setWatermarkModalOpen(false)}
      />

      <PageNumbersModal
        isOpen={pageNumbersModalOpen}
        onClose={() => setPageNumbersModalOpen(false)}
      />

      <MetadataModal
        isOpen={metadataModalOpen}
        onClose={() => setMetadataModalOpen(false)}
      />

      <CropModal
        isOpen={cropModalOpen}
        onClose={() => setCropModalOpen(false)}
      />

      <BackgroundModal
        isOpen={backgroundModalOpen}
        onClose={() => setBackgroundModalOpen(false)}
      />

      <OverlayModal
        isOpen={overlayModalOpen}
        onClose={() => setOverlayModalOpen(false)}
      />

      <ProtectModal
        isOpen={protectModalOpen}
        onClose={() => setProtectModalOpen(false)}
      />

      <UnlockModal
        isOpen={unlockModalOpen}
        onClose={() => setUnlockModalOpen(false)}
      />

      <RedactModal
        isOpen={redactModalOpen}
        onClose={() => setRedactModalOpen(false)}
      />

      <SignatureModal
        isOpen={signatureModalOpen}
        onClose={() => setSignatureModalOpen(false)}
      />

      <ImagesToPdfModal
        isOpen={imagesToPdfModalOpen}
        onClose={() => setImagesToPdfModalOpen(false)}
      />

      <PdfToTextModal
        isOpen={pdfToTextModalOpen}
        onClose={() => setPdfToTextModalOpen(false)}
      />

      <PdfToWordModal
        isOpen={pdfToWordModalOpen}
        onClose={() => setPdfToWordModalOpen(false)}
      />

      <ExtractImagesModal
        isOpen={extractImagesModalOpen}
        onClose={() => setExtractImagesModalOpen(false)}
      />

      <ExtractFontsModal
        isOpen={extractFontsModalOpen}
        onClose={() => setExtractFontsModalOpen(false)}
      />

      <ConversionPlaceholderModal
        isOpen={conversionPlaceholderModalOpen}
        onClose={() => setConversionPlaceholderModalOpen(false)}
        title={currentPlaceholderTitle}
        description={currentPlaceholderDescription}
        requirements={currentPlaceholderRequirements}
      />

      <Toaster position="top-right" />
    </>
  );
}
