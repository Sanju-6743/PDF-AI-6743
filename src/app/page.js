"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
      setCurrentPlaceholderTitle("PDF to Excel");
      setCurrentPlaceholderDescription("Extract tabular data from PDF documents and convert to Excel spreadsheets.");
      setCurrentPlaceholderRequirements([
        "xlsx - for Excel file creation",
        "pdf-parse - for PDF content extraction",
        "Table detection and parsing algorithms",
        "Data structure recognition"
      ]);
      setConversionPlaceholderModalOpen(true);
    } else if (toolName === "PDF to PPT") {
      setCurrentPlaceholderTitle("PDF to PowerPoint");
      setCurrentPlaceholderDescription("Convert PDF slides and documents to PowerPoint presentations.");
      setCurrentPlaceholderRequirements([
        "pptxgenjs - for PowerPoint creation",
        "pdf-parse - for content extraction",
        "Slide layout detection algorithms",
        "Image and text positioning logic"
      ]);
      setConversionPlaceholderModalOpen(true);
    } else if (toolName === "PDF to HTML") {
      setCurrentPlaceholderTitle("PDF to HTML");
      setCurrentPlaceholderDescription("Convert PDF documents to HTML format with preserved styling and structure.");
      setCurrentPlaceholderRequirements([
        "html-entities - for HTML encoding",
        "css-parse - for style extraction",
        "Layout analysis algorithms",
        "HTML structure generation"
      ]);
      setConversionPlaceholderModalOpen(true);
    } else if (toolName === "PDF to ePub") {
      setCurrentPlaceholderTitle("PDF to ePub");
      setCurrentPlaceholderDescription("Convert PDF documents to ePub format for e-readers.");
      setCurrentPlaceholderRequirements([
        "epub-gen - for ePub creation",
        "pdf-parse - for content extraction",
        "Chapter detection algorithms",
        "ePub formatting standards"
      ]);
      setConversionPlaceholderModalOpen(true);
    } else if (toolName === "PDF to CSV") {
      setCurrentPlaceholderTitle("PDF to CSV");
      setCurrentPlaceholderDescription("Extract tabular data from PDFs and convert to CSV format.");
      setCurrentPlaceholderRequirements([
        "csv-writer - for CSV generation",
        "Table detection algorithms",
        "Data parsing and validation",
        "CSV formatting standards"
      ]);
      setConversionPlaceholderModalOpen(true);
    } else if (toolName === "PDF to Markdown") {
      setCurrentPlaceholderTitle("PDF to Markdown");
      setCurrentPlaceholderDescription("Convert PDF documents to Markdown format for easy editing.");
      setCurrentPlaceholderRequirements([
        "markdown-it - for Markdown processing",
        "pdf-parse - for content extraction",
        "Structure analysis algorithms",
        "Markdown formatting logic"
      ]);
      setConversionPlaceholderModalOpen(true);
    } else if (toolName === "PDF to Images") {
      setCurrentPlaceholderTitle("PDF to Images");
      setCurrentPlaceholderDescription("Convert PDF pages to high-quality images (PNG, JPG, etc.).");
      setCurrentPlaceholderRequirements([
        "canvas - for image rendering",
        "pdf2pic - for PDF to image conversion",
        "Image processing libraries",
        "High-quality rendering engines"
      ]);
      setConversionPlaceholderModalOpen(true);
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

  return (
    <>
      {/* Clean Hero Section */}
      <section className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Professional PDF Tools
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              Transform, edit, and manage your PDF documents with our comprehensive toolkit.
              All processing happens locally for maximum privacy and security.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
                Get Started
              </button>
              <button className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                Learn More
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">50+</div>
                <div className="text-gray-600 dark:text-gray-400">PDF Tools</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">100%</div>
                <div className="text-gray-600 dark:text-gray-400">Privacy</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Free</div>
                <div className="text-gray-600 dark:text-gray-400">Forever</div>
              </div>
            </div>
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
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Select from our comprehensive collection of PDF processing tools
            </p>
          </div>

          {/* All Tools in One Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...basicTools, ...advancedTools, ...conversionTools, ...annotationTools, ...formTools, ...batchTools, ...aiTools].map((tool, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="group backdrop-blur-md bg-white/80 dark:bg-gray-800/80 rounded-xl shadow-lg border border-white/20 dark:border-gray-700/50 p-6 hover:shadow-xl hover:border-blue-300/50 dark:hover:border-blue-600/50 transition-all duration-200 cursor-pointer hover:bg-white/90 dark:hover:bg-gray-800/90"
                onClick={tool.onClick}
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center group-hover:bg-blue-200 dark:group-hover:bg-blue-800 transition-colors">
                    <tool.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {tool.title}
                    </h3>
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  {tool.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose PDF Toolkit?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Built for professionals who value privacy and efficiency
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">100% Private</h3>
              <p className="text-gray-600 dark:text-gray-300">
                All processing happens in your browser. Your files never leave your device.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Lightning Fast</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Process large PDF files instantly with our optimized algorithms.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">AI Powered</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Advanced AI features for intelligent PDF processing and analysis.
              </p>
            </div>
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
