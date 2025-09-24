# PDF Toolkit Pro 🚀

A comprehensive, professional PDF manipulation toolkit built with Next.js, featuring both basic and advanced PDF processing tools.

## 🌟 Features

### Basic PDF Tools
- 📄 **Merge PDFs** - Combine multiple PDF files into one
- ✂️ **Split PDFs** - Split PDF by pages, size, or bookmarks
- 📦 **Compress PDF** - Reduce PDF file size
- 📤 **Extract Pages** - Extract specific pages to new PDF
- 🗑️ **Remove Pages** - Delete specific pages from PDF
- 📋 **Duplicate Pages** - Duplicate pages within PDF

### Advanced PDF Tools
- 💧 **Add Watermark** - Add customizable text watermarks
- 🔢 **Add Page Numbers** - Automatic page numbering with positioning
- 📝 **Edit Metadata** - Complete PDF metadata management
- ✂️ **Crop Pages** - Precise margin cropping with unit conversion
- 🎨 **Change Background** - Solid color backgrounds with presets
- 📚 **Overlay PDFs** - Layer one PDF over another
- 🔒 **Protect PDF** - Password protection with granular permissions (works best with Adobe Acrobat)
- 🔓 **Unlock PDF** - Remove password protection
- 🚫 **Redact PDF** - Blackout sensitive content areas
- ✍️ **Digital Signature** - Add image-based signatures

### Conversion Tools
- 📄 **Images to PDF** - Convert multiple images to PDF (fully functional)
- 📝 **PDF to Text** - Extract text from PDFs (basic implementation)
- 📄 **PDF to Word** - Convert to Word documents (coming soon)
- 📊 **PDF to Excel** - Extract tables to spreadsheets (coming soon)
- 📽️ **PDF to PPT** - Convert to PowerPoint (coming soon)
- 🌐 **PDF to HTML** - Convert to web format (coming soon)
- 📖 **PDF to ePub** - Convert to e-book format (coming soon)
- 📋 **PDF to CSV** - Extract data to CSV (coming soon)
- 📝 **PDF to Markdown** - Convert to Markdown (coming soon)
- 🖼️ **PDF to Images** - Convert pages to images (coming soon)

## 🚀 Quick Start

### Option 1: Use the Batch File (Windows)
1. **Double-click** `start-server.bat` in the project root
2. The server will automatically start
3. Open http://localhost:3000 in your browser

### Option 2: Use PowerShell Script (Windows)
1. **Right-click** `start-server.ps1` and select "Run with PowerShell"
2. Or run: `.\start-server.ps1` in PowerShell
3. The server will start automatically

### Option 3: Manual Start
```bash
cd pdf-toolkit
npm run dev
```

## 🛠️ Tech Stack

- **Framework:** Next.js 15.5.3
- **PDF Processing:** pdf-lib
- **UI Components:** React with Tailwind CSS
- **Icons:** Lucide React
- **Animations:** Framer Motion
- **Notifications:** React Hot Toast

## 📁 Project Structure

```
pdf-toolkit/
├── components/           # React components
│   ├── *Modal.js        # Tool-specific modals
│   ├── ToolCard.js      # Tool card component
│   └── FileUpload.js    # File upload component
├── utils/
│   └── pdfUtils.js      # PDF processing functions
├── src/app/
│   ├── page.js          # Main application page
│   ├── layout.js        # App layout
│   └── globals.css      # Global styles
└── public/              # Static assets
```

## 🎯 Usage

1. **Start the server** using `start-server.bat` or `npm run dev`
2. **Open** http://localhost:3000 in your browser
3. **Click** on any tool card to open its interface
4. **Upload** your PDF file(s)
5. **Configure** the tool options
6. **Process** and download your modified PDF!

## 🔧 Development

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation
```bash
cd pdf-toolkit
npm install
```

### Environment Setup
The Google AI API key is already configured in `.env.local` for future AI tools implementation.

If you need to add additional API keys, create or update the `.env.local` file:

```bash
# Additional API keys (if needed)
ANOTHER_API_KEY=your_api_key_here
```

### Development Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
npm start
```

## 📝 Notes

- **PDF Protection:** Works best with Adobe Acrobat Reader. Browser PDF viewers may not always prompt for passwords due to compatibility limitations.
- **File Processing:** All processing happens locally in your browser for maximum privacy and security.
- **Performance:** Large PDF files may take longer to process depending on your device.

## 🤝 Contributing

Feel free to contribute by:
- Reporting bugs
- Suggesting new features
- Improving the codebase
- Adding more PDF tools

## 📄 License

This project is open source and available under the MIT License.

---

**Built with ❤️ for PDF enthusiasts everywhere!**
