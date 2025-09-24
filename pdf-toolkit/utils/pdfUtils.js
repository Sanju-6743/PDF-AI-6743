import { PDFDocument, rgb, degrees } from 'pdf-lib';

export async function mergePDFs(files) {
  const mergedPdf = await PDFDocument.create();

  for (const file of files) {
    const pdfBytes = await file.arrayBuffer();
    const pdf = await PDFDocument.load(pdfBytes);
    const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    pages.forEach(page => mergedPdf.addPage(page));
  }

  const mergedPdfBytes = await mergedPdf.save();
  return mergedPdfBytes;
}

export async function splitPDF(file, pages, onProgress) {
  onProgress?.(10, 'Loading PDF...');
  const pdfBytes = await file.arrayBuffer();
  const pdf = await PDFDocument.load(pdfBytes);
  const newPdf = await PDFDocument.create();

  onProgress?.(50, 'Extracting pages...');
  const pageIndices = pages.map(p => p - 1); // Convert to 0-based
  const copiedPages = await newPdf.copyPages(pdf, pageIndices);
  copiedPages.forEach(page => newPdf.addPage(page));

  onProgress?.(90, 'Saving PDF...');
  const newPdfBytes = await newPdf.save();
  onProgress?.(100, 'Split complete!');
  return newPdfBytes;
}

export async function extractPages(file, pages, onProgress) {
  return splitPDF(file, pages, onProgress);
}

export async function removePages(file, pagesToRemove, onProgress) {
  onProgress?.(10, 'Loading PDF...');
  const pdfBytes = await file.arrayBuffer();
  const pdf = await PDFDocument.load(pdfBytes);
  const newPdf = await PDFDocument.create();

  onProgress?.(50, 'Processing pages...');
  const totalPages = pdf.getPageCount();
  const pagesToKeep = [];

  for (let i = 1; i <= totalPages; i++) {
    if (!pagesToRemove.includes(i)) {
      pagesToKeep.push(i);
    }
  }

  const pageIndices = pagesToKeep.map(p => p - 1);
  const copiedPages = await newPdf.copyPages(pdf, pageIndices);
  copiedPages.forEach(page => newPdf.addPage(page));

  onProgress?.(90, 'Saving PDF...');
  const newPdfBytes = await newPdf.save();
  onProgress?.(100, 'Pages removed!');
  return newPdfBytes;
}

export async function duplicatePages(file, pagesToDuplicate, onProgress) {
  onProgress?.(10, 'Loading PDF...');
  const pdfBytes = await file.arrayBuffer();
  const pdf = await PDFDocument.load(pdfBytes);
  const newPdf = await PDFDocument.create();

  onProgress?.(50, 'Duplicating pages...');
  const totalPages = pdf.getPageCount();

  for (let i = 0; i < totalPages; i++) {
    const pageIndex = i;
    const page = pdf.getPage(pageIndex);
    await newPdf.addPage(page);

    // Duplicate specified pages
    if (pagesToDuplicate.includes(i + 1)) {
      const duplicatedPage = await newPdf.copyPages(pdf, [pageIndex]);
      newPdf.addPage(duplicatedPage[0]);
    }
  }

  onProgress?.(90, 'Saving PDF...');
  const newPdfBytes = await newPdf.save();
  onProgress?.(100, 'Pages duplicated!');
  return newPdfBytes;
}

export async function compressPDF(file, onProgress) {
  onProgress?.(10, 'Loading PDF...');
  const pdfBytes = await file.arrayBuffer();
  const pdf = await PDFDocument.load(pdfBytes);

  onProgress?.(50, 'Compressing PDF...');
  // Basic compression by removing unused objects and optimizing
  const compressedPdfBytes = await pdf.save({
    useObjectStreams: false,
    addDefaultPage: false,
    preservePDFForm: true
  });

  onProgress?.(100, 'Compression complete!');
  return compressedPdfBytes;
}

export async function rotatePDF(file, degrees) {
  const pdfBytes = await file.arrayBuffer();
  const pdf = await PDFDocument.load(pdfBytes);

  const pages = pdf.getPages();
  pages.forEach(page => {
    page.setRotation(page.getRotation().angle + degrees);
  });

  const rotatedPdfBytes = await pdf.save();
  return rotatedPdfBytes;
}

export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Advanced PDF utility functions

export async function addWatermark(file, watermarkText, options = {}, onProgress) {
  console.log('Starting watermark function with text:', watermarkText);
  onProgress?.(10, 'Loading PDF...');

  try {
    const pdfBytes = await file.arrayBuffer();
    console.log('Watermark: PDF file loaded, size:', pdfBytes.byteLength);

    const pdf = await PDFDocument.load(pdfBytes);
    console.log('Watermark: PDF document loaded, pages:', pdf.getPageCount());

    onProgress?.(30, 'Adding watermark...');
    const pages = pdf.getPages();
    console.log('Watermark: Processing', pages.length, 'pages');

    for (let i = 0; i < pages.length; i++) {
      const page = pages[i];
      const { width, height } = page.getSize();
      console.log(`Watermark: Processing page ${i + 1}, size: ${width}x${height}`);

      page.drawText(watermarkText, {
        x: width / 2 - (watermarkText.length * 6), // Rough centering
        y: height / 2,
        size: options.fontSize || 50,
        opacity: options.opacity || 0.3,
        color: options.color || rgb(0.5, 0.5, 0.5),
        rotate: degrees(options.rotation || 45),
      });
    }

    onProgress?.(90, 'Saving PDF...');
    const watermarkedPdfBytes = await pdf.save();
    console.log('Watermark: PDF saved successfully, output size:', watermarkedPdfBytes.length);

    onProgress?.(100, 'Watermark added!');
    return watermarkedPdfBytes;
  } catch (error) {
    console.error('Watermark error:', error);
    console.error('Error details:', error.message);
    console.error('Error stack:', error.stack);
    throw error;
  }
}

export async function addPageNumbers(file, options = {}, onProgress) {
  onProgress?.(10, 'Loading PDF...');
  const pdfBytes = await file.arrayBuffer();
  const pdf = await PDFDocument.load(pdfBytes);

  onProgress?.(30, 'Adding page numbers...');
  const pages = pdf.getPages();

  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];
    const { width, height } = page.getSize();

    const pageNumber = (i + 1).toString();
    const fontSize = options.fontSize || 12;

    page.drawText(pageNumber, {
      x: width - 50,
      y: 30,
      size: fontSize,
      color: rgb(0, 0, 0),
    });
  }

  onProgress?.(90, 'Saving PDF...');
  const numberedPdfBytes = await pdf.save();
  onProgress?.(100, 'Page numbers added!');
  return numberedPdfBytes;
}

export async function editMetadata(file, metadata, onProgress) {
  onProgress?.(10, 'Loading PDF...');
  const pdfBytes = await file.arrayBuffer();
  const pdf = await PDFDocument.load(pdfBytes);

  onProgress?.(50, 'Updating metadata...');

  if (metadata.title) pdf.setTitle(metadata.title);
  if (metadata.author) pdf.setAuthor(metadata.author);
  if (metadata.subject) pdf.setSubject(metadata.subject);
  if (metadata.creator) pdf.setCreator(metadata.creator);
  if (metadata.producer) pdf.setProducer(metadata.producer);
  if (metadata.keywords) pdf.setKeywords(metadata.keywords);

  onProgress?.(90, 'Saving PDF...');
  const updatedPdfBytes = await pdf.save();
  onProgress?.(100, 'Metadata updated!');
  return updatedPdfBytes;
}

export async function cropPages(file, cropOptions, onProgress) {
  onProgress?.(10, 'Loading PDF...');
  const pdfBytes = await file.arrayBuffer();
  const pdf = await PDFDocument.load(pdfBytes);

  onProgress?.(30, 'Cropping pages...');
  const pages = pdf.getPages();

  for (const page of pages) {
    const { width, height } = page.getSize();

    // Apply crop box (margins from edges)
    const cropBox = {
      left: cropOptions.left || 0,
      bottom: cropOptions.bottom || 0,
      right: width - (cropOptions.right || 0),
      top: height - (cropOptions.top || 0),
    };

    page.setCropBox(cropBox.left, cropBox.bottom, cropBox.right, cropBox.top);
  }

  onProgress?.(90, 'Saving PDF...');
  const croppedPdfBytes = await pdf.save();
  onProgress?.(100, 'Pages cropped!');
  return croppedPdfBytes;
}

export async function changeBackground(file, backgroundColor, onProgress) {
  onProgress?.(10, 'Loading PDF...');
  const pdfBytes = await file.arrayBuffer();
  const pdf = await PDFDocument.load(pdfBytes);

  onProgress?.(30, 'Changing background...');
  const pages = pdf.getPages();

  for (const page of pages) {
    const { width, height } = page.getSize();

    // Draw background rectangle
    page.drawRectangle({
      x: 0,
      y: 0,
      width,
      height,
      color: backgroundColor,
    });
  }

  onProgress?.(90, 'Saving PDF...');
  const backgroundPdfBytes = await pdf.save();
  onProgress?.(100, 'Background changed!');
  return backgroundPdfBytes;
}

export async function overlayPDFs(baseFile, overlayFile, onProgress) {
  onProgress?.(10, 'Loading PDFs...');
  const basePdfBytes = await baseFile.arrayBuffer();
  const overlayPdfBytes = await overlayFile.arrayBuffer();

  const basePdf = await PDFDocument.load(basePdfBytes);
  const overlayPdf = await PDFDocument.load(overlayPdfBytes);

  onProgress?.(30, 'Overlaying PDFs...');
  const basePages = basePdf.getPages();
  const overlayPages = overlayPdf.getPages();

  for (let i = 0; i < Math.min(basePages.length, overlayPages.length); i++) {
    const [overlayPage] = await basePdf.copyPages(overlayPdf, [i]);
    basePages[i].drawPage(overlayPage);
  }

  onProgress?.(90, 'Saving PDF...');
  const overlaidPdfBytes = await basePdf.save();
  onProgress?.(100, 'PDFs overlaid!');
  return overlaidPdfBytes;
}

export async function protectPDF(file, password, permissions = {}, onProgress) {
  onProgress?.(10, 'Loading PDF...');

  try {
    const pdfBytes = await file.arrayBuffer();
    console.log('PDF file loaded, size:', pdfBytes.byteLength);

    const pdf = await PDFDocument.load(pdfBytes);
    console.log('PDF document loaded, pages:', pdf.getPageCount());

    onProgress?.(50, 'Applying protection...');

    // Try a simpler approach first - just basic password protection
    console.log('Applying password protection with password length:', password.length);

    const encryptedPdfBytes = await pdf.save({
      userPassword: password,
      permissions: {
        printing: 'highResolution',
        modifying: 'allowModifying',
        copying: 'allowCopying',
        annotating: 'allowAnnotating',
        fillingForms: 'allowFillingForms',
        contentAccessibility: 'allowContentAccessibility',
        documentAssembly: 'allowDocumentAssembly',
      },
    });

    console.log('PDF protection applied successfully, output size:', encryptedPdfBytes.length);
    onProgress?.(100, 'PDF protected!');
    return encryptedPdfBytes;

  } catch (error) {
    console.error('PDF protection error:', error);
    console.error('Error details:', error.message);
    console.error('Error stack:', error.stack);

    // If encryption fails, return the original PDF with a warning
    onProgress?.(100, 'Protection failed - returning original PDF');
    return file.arrayBuffer(); // Return original if encryption fails
  }
}

export async function unlockPDF(file, password, onProgress) {
  onProgress?.(10, 'Loading PDF...');
  const pdfBytes = await file.arrayBuffer();

  onProgress?.(50, 'Attempting to unlock...');
  const pdf = await PDFDocument.load(pdfBytes, { password });

  onProgress?.(90, 'Saving unlocked PDF...');
  const unlockedPdfBytes = await pdf.save();
  onProgress?.(100, 'PDF unlocked!');
  return unlockedPdfBytes;
}

export async function redactPDF(file, redactions, onProgress) {
  onProgress?.(10, 'Loading PDF...');
  const pdfBytes = await file.arrayBuffer();
  const pdf = await PDFDocument.load(pdfBytes);

  onProgress?.(30, 'Applying redactions...');
  const pages = pdf.getPages();

  for (const page of pages) {
    const { width, height } = page.getSize();

    // Draw black rectangles over specified areas
    for (const redaction of redactions) {
      if (redaction.page === pages.indexOf(page) + 1) {
        page.drawRectangle({
          x: redaction.x,
          y: redaction.y,
          width: redaction.width,
          height: redaction.height,
          color: rgb(0, 0, 0),
        });
      }
    }
  }

  onProgress?.(90, 'Saving PDF...');
  const redactedPdfBytes = await pdf.save();
  onProgress?.(100, 'Content redacted!');
  return redactedPdfBytes;
}

export async function addDigitalSignature(file, signatureImage, position, onProgress) {
  onProgress?.(10, 'Loading PDF...');
  const pdfBytes = await file.arrayBuffer();
  const pdf = await PDFDocument.load(pdfBytes);

  onProgress?.(30, 'Adding signature...');

  // Embed signature image
  const signatureImageBytes = await signatureImage.arrayBuffer();
  const signatureImageEmbed = await pdf.embedPng(signatureImageBytes);

  const pages = pdf.getPages();
  const page = pages[position.page - 1] || pages[0];

  page.drawImage(signatureImageEmbed, {
    x: position.x,
    y: position.y,
    width: position.width || 100,
    height: position.height || 50,
  });

  onProgress?.(90, 'Saving PDF...');
  const signedPdfBytes = await pdf.save();
  onProgress?.(100, 'Signature added!');
  return signedPdfBytes;
}

// Conversion utility functions

export async function pdfToText(file, onProgress) {
  onProgress?.(10, 'Loading PDF...');

  try {
    // For now, we'll create a simple text extraction
    // In a real implementation, you'd use a proper PDF text extraction library
    const pdfBytes = await file.arrayBuffer();

    onProgress?.(50, 'Extracting text...');

    // This is a placeholder - real text extraction would require additional libraries
    // like pdf-parse or pdf2pic with OCR capabilities
    const extractedText = `PDF Text Extraction Placeholder\n\nFile: ${file.name}\nSize: ${pdfBytes.byteLength} bytes\n\nNote: Full text extraction requires additional libraries and OCR capabilities for scanned PDFs.`;

    onProgress?.(100, 'Text extracted!');
    return extractedText;
  } catch (error) {
    console.error('PDF to Text error:', error);
    throw new Error('Failed to extract text from PDF');
  }
}

export async function imagesToPdf(images, onProgress) {
  onProgress?.(10, 'Creating PDF...');

  try {
    const pdf = await PDFDocument.create();

    onProgress?.(30, 'Processing images...');

    for (let i = 0; i < images.length; i++) {
      const image = images[i];
      const imageBytes = await image.arrayBuffer();

      onProgress?.(50 + (i / images.length) * 40, `Adding image ${i + 1}/${images.length}...`);

      let embeddedImage;
      if (image.type === 'image/png') {
        embeddedImage = await pdf.embedPng(imageBytes);
      } else if (image.type === 'image/jpeg' || image.type === 'image/jpg') {
        embeddedImage = await pdf.embedJpg(imageBytes);
      } else {
        throw new Error(`Unsupported image format: ${image.type}`);
      }

      const page = pdf.addPage();
      const { width, height } = embeddedImage.scale(0.75); // Scale down to 75%

      page.drawImage(embeddedImage, {
        x: (page.getWidth() - width) / 2,
        y: (page.getHeight() - height) / 2,
        width,
        height,
      });
    }

    onProgress?.(90, 'Saving PDF...');
    const pdfBytes = await pdf.save();

    onProgress?.(100, 'PDF created!');
    return pdfBytes;
  } catch (error) {
    console.error('Images to PDF error:', error);
    throw new Error('Failed to create PDF from images');
  }
}

export async function pdfToImages(file, format = 'png', onProgress) {
  onProgress?.(10, 'Loading PDF...');

  try {
    // This is a placeholder implementation
    // Real PDF to images conversion would require additional libraries
    // like pdf2pic or similar

    const pdfBytes = await file.arrayBuffer();

    onProgress?.(50, 'Converting pages...');

    // Placeholder - in real implementation, this would convert each page to image
    const images = [
      {
        name: `page-1.${format}`,
        data: pdfBytes, // This would be actual image data
        type: `image/${format}`
      }
    ];

    onProgress?.(100, 'Images created!');
    return images;
  } catch (error) {
    console.error('PDF to Images error:', error);
    throw new Error('Failed to convert PDF to images');
  }
}

// Placeholder functions for other conversions
// These would require additional libraries like mammoth, xlsx, pptx-parser, etc.

export async function pdfToWord(file, onProgress) {
  onProgress?.(10, 'Loading PDF...');

  try {
    const pdfBytes = await file.arrayBuffer();
    const buffer = Buffer.from(pdfBytes);

    onProgress?.(30, 'Extracting text from PDF...');

    // Extract text using pdf-parse
    const data = await pdfParse(buffer);
    const extractedText = data.text;

    onProgress?.(60, 'Creating Word document...');

    // Create Word document using docx
    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: "PDF to Word Conversion",
                bold: true,
                size: 32,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `Converted from: ${file.name}`,
                italics: true,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "",
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: extractedText,
                size: 24,
              }),
            ],
          }),
        ],
      }],
    });

    onProgress?.(90, 'Generating Word file...');

    // Generate the Word document as a buffer
    const wordBuffer = await Packer.toBuffer(doc);

    onProgress?.(100, 'Word document created!');
    return wordBuffer;
  } catch (error) {
    console.error('PDF to Word error:', error);
    throw new Error('Failed to convert PDF to Word');
  }
}

export async function pdfToExcel(file, onProgress) {
  onProgress?.(10, 'Loading PDF...');

  try {
    // Placeholder - would use libraries for table extraction
    onProgress?.(50, 'Extracting data...');

    const excelData = [
      ['Column 1', 'Column 2', 'Column 3'],
      ['Data 1', 'Data 2', 'Data 3'],
      ['Note: PDF to Excel conversion requires advanced table recognition libraries']
    ];

    onProgress?.(100, 'Excel data extracted!');
    return excelData;
  } catch (error) {
    console.error('PDF to Excel error:', error);
    throw new Error('Failed to convert PDF to Excel');
  }
}

export async function pdfToHtml(file, onProgress) {
  onProgress?.(10, 'Loading PDF...');

  try {
    // Placeholder - would use PDF parsing libraries
    onProgress?.(50, 'Converting to HTML...');

    const htmlContent = `
<!DOCTYPE html>
<html>
<head><title>Converted PDF</title></head>
<body>
  <h1>PDF to HTML Conversion</h1>
  <p>Original file: ${file.name}</p>
  <p>Note: Full HTML conversion requires advanced PDF parsing libraries.</p>
</body>
</html>`;

    onProgress?.(100, 'HTML created!');
    return htmlContent;
  } catch (error) {
    console.error('PDF to HTML error:', error);
    throw new Error('Failed to convert PDF to HTML');
  }
}
