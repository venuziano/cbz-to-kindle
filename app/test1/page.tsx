"use client";
import React, { useEffect, useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import JSZip from 'jszip';
import ProgressBar from './ProgressBar';
import ConversionComplete from './ConversionComplete';
import FormHints from './FormHints';

interface FormErrors {
  newPDFWidth?: string;
  newPDFQuality?: string;
  file?: string;
}

const images: string[] = [
  "/assets/test.jpg",
  "/assets/dall1.webp",
  "/assets/all.jpg",
];

export default function Home() {
  const [newPDFWidth, setNewPDFWidth] = useState<string>('1200');
  const [newPDFQuality, setNewPDFQuality] = useState<string>('72');
  const [file, setFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [progress, setProgress] = useState<number>(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [eta, setEta] = useState<string | null>(null);
  const [showWarning, setShowWarning] = useState<boolean>(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);

  useEffect(() => {
    if (progress > 0 && progress < 100 && startTime) {
      const elapsed = Date.now() - startTime; // elapsed time in milliseconds
      const estimatedTotal = (elapsed / progress) * 100; // estimate total time
      const remaining = estimatedTotal - elapsed; // time remaining

      // Format remaining time as mm:ss
      const minutes = Math.floor((remaining / 1000 / 60) % 60);
      const seconds = Math.floor((remaining / 1000) % 60);
      setEta(`${minutes}:${seconds.toString().padStart(2, '0')}`);
    } else if (progress === 100) {
      setEta(null); // Reset ETA when done
    }
  }, [progress, startTime]);

  useEffect(() => {
    if (progress >= 50 && !showWarning) {
      setShowWarning(true);
    }
  }, [progress, showWarning]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 2000); // Switch every 2 seconds

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formErrors: FormErrors = {};

    // window.gtag('event', 'button_click', {
    //   event_category: 'button',
    //   event_label: 'cta_button',
    // });

    // Validate first number
    if (!newPDFWidth) {
      formErrors.newPDFWidth = 'Image Width is required';
    } else if (isNaN(Number(newPDFWidth))) {
      formErrors.newPDFWidth = 'Must be a valid number';
    }

    // Validate second number
    if (!newPDFQuality) {
      formErrors.newPDFQuality = 'Image Quality is required';
    } else if (isNaN(Number(newPDFQuality))) {
      formErrors.newPDFQuality = 'Must be a valid number';
    }

    // Validate file input
    if (!file) {
      formErrors.file = 'Please select a CBZ file';
    } else {
      const allowedExtensions = ['cbz'];
      const fileExtension = file.name.split('.').pop()?.toLowerCase();

      if (!allowedExtensions.includes(fileExtension || '')) {
        formErrors.file = 'Only CBZ files are allowed';
      }
    }

    setErrors(formErrors);

    // Submit form if no errors
    if (Object.keys(formErrors).length === 0 && file) {
      setProgress(0);
      setStartTime(Date.now()); // Record start time
      const pdfBlob = await convertCbzToPdf(file, setProgress, newPDFWidth, newPDFQuality);
      if (pdfBlob) {
        const url = URL.createObjectURL(pdfBlob);
        setPdfBlobUrl(url);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${file.name.replace(/\.[^/.]+$/, '')}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files && e.target.files[0];
    setFile(selectedFile || null);
  };


  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-gray-100" style={{
        backgroundImage: "url('/assets/test.jpg')",
        // backgroundImage: "url('/assets/dall1.webp')",
        // backgroundImage: `url('${images[currentImageIndex]}')`,
        // backgroundImage: "url('/assets/all.jpg')",
        backgroundSize: "contain",
        // backgroundRepeat: "no-repeat",
        // backgroundPosition: "center",
      }}>
        <form
          className="bg-white p-8 rounded shadow-md w-full max-w-md"
          onSubmit={handleSubmit}
        >
          <h2 className="text-2xl font-bold mb-4 text-center text-gray-700">CBZ to PDF Converter 212</h2>

          {/* <div className="relative group ml-2">
            ❓
            <div className="absolute left-0 -top-10 hidden w-48 p-2 text-sm text-white bg-black rounded-md shadow-lg group-hover:block">
              <FormHints />
            </div>
          </div> */}

          <FormHints />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Image Width Field */}
            <div>
              <label className="block text-gray-700">Image Width</label>
              <input
                type="number"
                value={newPDFWidth}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setNewPDFWidth(e.target.value)
                }
                className={`text-gray-700 mt-1 w-full px-3 py-2 border ${errors.newPDFWidth ? 'border-red-500' : 'border-gray-300'
                  } rounded-md focus:outline-none focus:ring-2 ${errors.newPDFWidth ? 'focus:ring-red-200' : 'focus:ring-indigo-200'
                  }`}
              />
              {errors.newPDFWidth && (
                <p className="text-red-500 text-sm mt-1">{errors.newPDFWidth}</p>
              )}
            </div>

            {/* Image Quality Field */}
            <div>
              <div className="flex items-center">
                <label className="block text-gray-700">Image Quality</label>
                <div className="relative group ml-2">
                  ❓
                  <div className="absolute left-0 -top-10 hidden w-48 p-2 text-sm text-white bg-black rounded-md shadow-lg group-hover:block">
                    Enter a value for the quality of the image (e.g., 1–100).
                  </div>
                </div>
              </div>
              <input
                type="number"
                value={newPDFQuality}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setNewPDFQuality(e.target.value)
                }
                className={`text-gray-700 mt-1 w-full px-3 py-2 border ${errors.newPDFQuality ? 'border-red-500' : 'border-gray-300'
                  } rounded-md focus:outline-none focus:ring-2 ${errors.newPDFQuality ? 'focus:ring-red-200' : 'focus:ring-indigo-200'
                  }`}
              />
              {errors.newPDFQuality && (
                <p className="text-red-500 text-sm mt-1">{errors.newPDFQuality}</p>
              )}
            </div>
          </div>

          {/* PDF or CBZ File Input */}
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">Upload CBZ File</label>
            <div className="flex items-center">
              <label
                htmlFor="fileInput"
                className="cursor-pointer inline-block px-4 py-2 bg-indigo-500 text-white font-semibold rounded-md shadow-sm hover:bg-indigo-600 focus:ring focus:ring-indigo-300 focus:outline-none"
                style={{ minWidth: 123 }}
              >
                Choose File
              </label>
              <input
                id="fileInput"
                type="file"
                accept=".cbz"
                onChange={handleFileChange}
                className="hidden"
                disabled={progress > 0 && progress < 99}
              />
              <span id="fileName" className="ml-3 text-gray-500 text-sm truncate" title={file ? file.name : "No file chosen"}>
                {file ? file.name : "No file chosen"}
              </span>
            </div>
            {errors.file && (
              <p className="text-red-500 text-sm mt-1">{errors.file}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition duration-300"
            disabled={progress > 0 && progress < 99}
          >
            Convert
          </button>
          {/* {console.log('pdfBlobUrl', pdfBlobUrl)} */}
          {/* Progress Indicator */}
          <ProgressBar progress={progress} eta={eta} />
          <ConversionComplete progress={progress} downloadLink={pdfBlobUrl} />
        </form>
      </div>
    </>
  );
}

// Helper functions
async function convertCbzToPdf(
  file: File,
  setProgress: (value: number) => void,
  imageWidth: string,
  imageQuality: string
): Promise<Blob | null> {
  try {
    // Read the CBZ file (ZIP archive)
    const arrayBuffer = await file.arrayBuffer();
    const zip = await JSZip.loadAsync(arrayBuffer);

    // Filter and sort image files
    const imageFiles = Object.keys(zip.files)
      .filter((filename) => {
        const ext = filename.split('.').pop()?.toLowerCase();
        return ['jpg', 'jpeg', 'png'].includes(ext || '');
      })
      .sort();

    if (imageFiles.length === 0) {
      alert('No image files found in the CBZ archive.');
      return null;
    }

    // Create a new PDF document
    const pdfDoc = await PDFDocument.create();

    for (let i = 0; i < imageFiles.length; i++) {
      const filename = imageFiles[i];

      // Extract image data
      const imageData = await zip.files[filename].async('blob');

      // Process image (resize) using Canvas
      const processedImageData = await resizeImage(imageData, Number(imageWidth), Number(imageQuality));
      // const processedImageData = await resizeImage(imageData, 1200);

      // Embed the image into the PDF
      const imgBytes = await processedImageData.arrayBuffer();

      // let image;
      const image = await pdfDoc.embedJpg(imgBytes);

      // Add a new page with the image dimensions
      const page = pdfDoc.addPage([image.width, image.height]);

      // Draw the image onto the page
      page.drawImage(image, {
        x: 0,
        y: 0,
        width: image.width,
        height: image.height,
      });

      // Update progress
      setProgress(((i + 1) / imageFiles.length) * 100);
    }

    // Save the PDF document
    const pdfBytes = await pdfDoc.save();

    // Create a Blob from the PDF bytes
    const pdfBlob = new Blob([pdfBytes], { type: 'application/pdf' });

    return pdfBlob;
  } catch (err) {
    console.error('An error occurred:', err);
    return null;
  }
}


function resizeImage(imageBlob: Blob, maxWidth: number, imageQuality?: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();

    // Create a URL for the image blob
    const url = URL.createObjectURL(imageBlob);

    img.onload = () => {
      let { width, height } = img;

      // Calculate new dimensions
      if (width > maxWidth) {
        const ratio = maxWidth / width;
        width = maxWidth;
        height = height * ratio;
      }

      // Create a canvas to draw the resized image
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');

      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);

        // Convert canvas back to Blob
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Canvas is empty'));
            }
            // Revoke the object URL
            URL.revokeObjectURL(url);
          },
          'image/jpeg',
          Number(imageQuality) / 100 // Adjust quality (0 to 1) as needed
          // 0.72 // Adjust quality (0 to 1) as needed
        );
      } else {
        reject(new Error('Canvas is not supported'));
      }
    };

    img.onerror = (e) => {
      reject(e);
      URL.revokeObjectURL(url);
    };

    img.src = url;
  });
}

