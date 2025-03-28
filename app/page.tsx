/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useCallback, useEffect, useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import JSZip from 'jszip';
import { FcInfo } from "react-icons/fc";
import { IoCloseCircle } from "react-icons/io5";
import { useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';
import * as Sentry from "@sentry/nextjs";

import ErrorToast from './main/ErrorToast';
import SuccessToast from './main/SuccessToast';
import Actions from './main/Actions';
import FormHints from './main/FormHints';
import ProgressBar from './main/ProgressBar';
import ConversionComplete from './main/ConversionComplete';
import { useGA } from '@/hooks/useGA';

interface FormErrors {
  newPDFWidth?: string;
  newPDFQuality?: string;
  file?: string;
}

export default function Home() {
  const { logPageView, recordGa } = useGA();
  const translation: TFunction = useTranslation('common').t;

  const [newPDFWidth, setNewPDFWidth] = useState<string>('1200');
  const [newPDFQuality, setNewPDFQuality] = useState<string>('72');
  const [hint, setHint] = useState<boolean | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [progress, setProgress] = useState<number>(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [eta, setEta] = useState<string | null>(null);
  const [showWarning, setShowWarning] = useState<boolean>(false);
  const [newPDFBlob, setNewPDFBlob] = useState<Blob | null>(null);
  const [errorToastMessage, setErrorToastMessage] = useState<string>('');
  const [successToastMessage, setSuccessToastMessage] = useState<string>('');
  const [convertToType, setConvertToType] = useState<string>('pdf');

  const isPDFTypeSelected: boolean = convertToType === 'pdf'

  // Memoize the onClose handler
  const closeToast = useCallback(() => setErrorToastMessage(''), []);
  const successToast = useCallback(() => setSuccessToastMessage(''), []);

  useEffect(() => {
    const currentUrl = `https://www.cbz-to-pdf.com.br/`;
    logPageView(currentUrl);
  }, []);

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

  // const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   setNewPDFBlob(null)
  //   const formErrors: FormErrors = {};

  //   // Validate first number
  //   if (!newPDFWidth && isPDFTypeSelected) {
  //     formErrors.newPDFWidth = translation('imageWidthRequired');
  //   } else if (isNaN(Number(newPDFWidth))) {
  //     formErrors.newPDFWidth = translation('mustBeValidNumber');
  //   }

  //   // Validate second number
  //   if (!newPDFQuality && isPDFTypeSelected) {
  //     formErrors.newPDFQuality = translation('imageWidthQualityRequired');
  //   } else if (isNaN(Number(newPDFQuality))) {
  //     formErrors.newPDFQuality = translation('mustBeValidNumber');
  //   } else if (Number(newPDFQuality) > 100) {
  //     formErrors.newPDFQuality = translation('imageWidthQualityMaxAllowed');
  //   }

  //   // Validate file input
  //   if (!file) {
  //     formErrors.file = translation('chooseFileRequired');
  //   } else {
  //     const allowedExtensions = ['cbz'];
  //     const fileExtension = file.name.split('.').pop()?.toLowerCase();
  //     const maxFileSizeInBytes = 1 * 1024 * 1024 * 1024; // 1GB in bytes

  //     if (!allowedExtensions.includes(fileExtension || '')) {
  //       formErrors.file = translation('onlyCbzAllowed');
  //     } else if (file.size > maxFileSizeInBytes) {
  //       formErrors.file = translation('fileSizeExceeded');
  //     }
  //   }

  //   setErrors(formErrors);

  //   // Submit form if no errors
  //   if (Object.keys(formErrors).length === 0 && file) {
  //     recordGa({ category: 'Interaction', action: 'Convert_test' })

  //     if (isPDFTypeSelected) {
  //       setProgress(0);
  //       setStartTime(Date.now()); // Record start time
  //       const pdfBlob = await convertComicToPdf(file, setProgress, setErrorToastMessage, newPDFWidth, newPDFQuality);
  //       if (pdfBlob) {
  //         window.scrollTo({
  //           top: document.body.scrollHeight,
  //           behavior: 'smooth',
  //         });

  //         recordGa({ category: 'Interaction', action: 'Finish_to_uploaded_test' })
  //         setNewPDFBlob(pdfBlob)
  //         setSuccessToastMessage(translation('fileConvertedSuccessfuly'))
  //       }
  //     } else {
  //       setProgress(0);
  //       // Extract images from CBZ
  //       const images = await extractCBZ(file, (extractionProgress) => {
  //         setProgress(extractionProgress);
  //       });

  //       // Create EPUB file
  //       const epubBlob = await createEPUB(images, (metadata) => {
  //         // metadata.percent is already mapped to 50–100
  //         setProgress(metadata.percent);
  //       });

  //       setNewPDFBlob(epubBlob)
  //       setProgress(100);
  //     }
  //   }
  // };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setNewPDFBlob(null);
    const formErrors: FormErrors = {};
  
    // Validate first number
    if (!newPDFWidth && isPDFTypeSelected) {
      formErrors.newPDFWidth = translation('imageWidthRequired');
    } else if (isNaN(Number(newPDFWidth))) {
      formErrors.newPDFWidth = translation('mustBeValidNumber');
    }
  
    // Validate second number
    if (!newPDFQuality && isPDFTypeSelected) {
      formErrors.newPDFQuality = translation('imageWidthQualityRequired');
    } else if (isNaN(Number(newPDFQuality))) {
      formErrors.newPDFQuality = translation('mustBeValidNumber');
    } else if (Number(newPDFQuality) > 100) {
      formErrors.newPDFQuality = translation('imageWidthQualityMaxAllowed');
    }
  
    // Validate file input
    if (!file) {
      formErrors.file = translation('chooseFileRequired');
    } else {
      const allowedExtensions = ['cbz'];
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      const maxFileSizeInBytes = 1 * 1024 * 1024 * 1024; // 1GB in bytes
  
      if (!allowedExtensions.includes(fileExtension || '')) {
        formErrors.file = translation('onlyCbzAllowed');
      } else if (file.size > maxFileSizeInBytes) {
        formErrors.file = translation('fileSizeExceeded');
      }
    }
  
    setErrors(formErrors);
  
    // Submit form if no errors
    if (Object.keys(formErrors).length === 0 && file) {
      const formatBytes = (bytes: number): string => {
        const gb = 1024 * 1024 * 1024;
        const mb = 1024 * 1024;
        if (bytes >= gb) {
          return `${(bytes / gb).toFixed(2)} GB`;
        } else {
          return `${(bytes / mb).toFixed(2)} MB`;
        }
      };

      recordGa({ 
        category: 'Interaction', 
        action: 'Convert_test',
        fileName: file.name,
        fileSize: `${String(formatBytes(file.size))}`
      });
  
      if (isPDFTypeSelected) {
        // PDF conversion branch remains unchanged.
        setProgress(0);
        setStartTime(Date.now()); // Record start time
        const pdfBlob = await convertComicToPdf(
          file,
          setProgress,
          setErrorToastMessage,
          newPDFWidth,
          newPDFQuality
        );
        if (pdfBlob) {
          window.scrollTo({
            top: document.body.scrollHeight,
            behavior: 'smooth',
          });
          recordGa({ category: 'Interaction', action: 'Finish_to_uploaded_test' });
          setNewPDFBlob(pdfBlob);
          setSuccessToastMessage(translation('fileConvertedSuccessfuly'));
        }
      } else {
        // Use a Web Worker for EPUB conversion.
        setProgress(0);
        const worker = new Worker(new URL('../workers/worker.js', import.meta.url));
  
        worker.onmessage = (e: MessageEvent) => {
          const { type, progress: workerProgress, blob, error } = e.data;
          if (type === 'progress') {
            setProgress(workerProgress);
          } else if (type === 'result') {
            setNewPDFBlob(blob);
            setProgress(100);
            worker.terminate();
          } else if (type === 'error') {
            setErrorToastMessage(error);
            worker.terminate();
          }
        };
  
        // Post the file to the worker.
        worker.postMessage({ file });
      }
    }
  };

  const handleDownload = (): void => {
    if (isPDFTypeSelected) {
      const url = URL.createObjectURL(newPDFBlob as Blob);

      // Create a temporary anchor element
      const link = document.createElement('a');
      link.href = url;
      link.download = `${file?.name.replace(/\.[^/.]+$/, '')}.pdf`

      // Append to the body and trigger the download
      document.body.appendChild(link);
      link.click();

      // Clean up: remove the anchor and revoke the URL
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } else {
      const link = document.createElement("a");
      link.href = URL.createObjectURL(newPDFBlob as Blob);
      link.download = 'converted.epub';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const selectedFile = e.target.files && e.target.files[0];
    setFile(selectedFile || null);
  };

  useEffect(() => {
    // Dynamically import the worker using the URL syntax.
    const worker = new Worker(new URL('../workers/worker.js', import.meta.url));

    // Listen for messages from the worker.
    worker.onmessage = (event) => {
      console.log('event', event)
      // setResult(event.data);
    };

    // Optionally handle errors.
    worker.onerror = (error) => {
      console.error('Worker error:', error);
    };

    // Send a message to the worker.
    worker.postMessage(20);

    // Cleanup the worker on component unmount.
    return () => worker.terminate();
  }, []);

  return (
    <>
      <div className="relative flex items-center flex-col justify-center min-h-screen bg-gray-100" style={{
        backgroundImage: "url('https://d378pye9mzk55i.cloudfront.net/Image20241212182458.jpg')",
        backgroundSize: "contain",
      }}>
        <form
          className="bg-white p-8 rounded shadow-md max-w-md flex flex-col mt-4 custom-form"
          onSubmit={handleSubmit}
        >
          <div className='text-center'>
            <h1 className="sr-only">Convert CBZ to PDF / Comic Book Converter</h1>
            <h3 className="sr-only">Converter CBZ para PDF</h3>
            <h1 className="text-3xl font-bold text-gray-700">{translation('toolTitle')}</h1>

            {/* A short h2 and paragraph for extra SEO context. */}
            <h2 className="sr-only">
              The Easiest Way to Convert Your Comic Book Files (CBZ) to PDF. CBZ to PDF Converter - Free Online Tool
            </h2>

            <p className="sr-only">
              This tool helps you quickly transform CBZ files into PDFs or EPUBs for your Kindle device or any other e-reader.
              No installation required — everything happens in your browser!
            </p>

            <p className="text-xs font-bold text-gray-700 mt-4">
              {translation('toolDescription')}
            </p>

            <div
              className="inline-block text-xs text-blue-600 py-1 px-1 rounded-md transition duration-300 cursor-pointer mx-auto"
              onClick={() => {
                setHint(true)
                recordGa({ category: 'Interaction', action: 'How_to_use_test' })
              }}
            >
              {translation('howToUse')}
            </div>
          </div>

          {hint && (
            <div
              className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
              onClick={() => setHint(false)}
            >
              <div
                className="bg-white rounded-lg shadow-lg p-5 relative w-96"
              >
                <button
                  className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition duration-300"
                  aria-label="Close modal"
                >
                  <IoCloseCircle />
                </button>

                <FormHints />
              </div>
            </div>
          )}

          <div className="flex items-center mt-4 mb-4">
            <span className="text-gray-700">{translation('convertTo')}</span>

            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="options"
                value="pdf"
                className="hidden peer"
                checked={convertToType === "pdf"}
                onChange={() => setConvertToType("pdf")}
              />
              <div className="w-5 h-5 border-2 border-gray-400 rounded-full flex items-center justify-center peer-checked:border-blue-500 peer-checked:bg-blue-500">
                <div className="w-2.5 h-2.5 bg-white rounded-full peer-checked:block"></div>
              </div>
              <span className="text-gray-700">PDF</span>
            </label>

            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="options"
                value="epub"
                className="hidden peer"
                checked={convertToType === "epub"}
                onChange={() => setConvertToType("epub")}
              />
              <div className="w-5 h-5 border-2 border-gray-400 rounded-full flex items-center justify-center peer-checked:border-blue-500 peer-checked:bg-blue-500">
                <div className="w-2.5 h-2.5 bg-white rounded-full peer-checked:block"></div>
              </div>
              <span className="text-gray-700">EPUB</span>
            </label>
          </div>

          {isPDFTypeSelected ?
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {/* Image Width Field */}
              <div>
                <label className="block text-gray-700">{translation('imageWidh')}</label>
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
                  <label className="block text-gray-700">{translation('imageQuality')}</label>
                  <div className="relative group ml-2 cursor-pointer">
                    <FcInfo />
                    <div className="absolute left-0 -top-10 hidden w-48 p-2 text-sm text-white bg-black rounded-md shadow-lg group-hover:block">
                      {translation('imagemQualityHint')}
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
            </div> : <></>}


          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">{translation('uploadCbzFileInput')}</label>
            <div className="flex items-center">
              <label
                htmlFor="fileInput"
                className="cursor-pointer inline-block px-4 py-2 bg-indigo-500 text-white font-semibold rounded-md shadow-sm hover:bg-indigo-600 focus:ring focus:ring-indigo-300 focus:outline-none"
                style={{ minWidth: 123 }}
              >
                {translation('chooseFile')}
              </label>
              <input
                id="fileInput"
                type="file"
                accept=".cbz"
                onChange={handleFileChange}
                className="hidden"
                disabled={progress > 0 && progress < 99}
                onClick={() => recordGa({ category: 'Interaction', action: 'Choose_File_test' })}
              />
              <span id="fileName" className="ml-3 text-gray-500 text-sm truncate" title={file ? file.name : "No file chosen"}>
                {file ? file.name : `${translation("noFileChosen")}`}
              </span>
            </div>
            {errors.file && (
              <p className="text-red-500 text-sm mt-1">{errors.file}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition duration-300"
            disabled={progress > 0 && progress < 99}
          >
            {translation('convert')}
          </button>

          <ProgressBar progress={progress} eta={eta} />
          <ConversionComplete progress={progress} handleDownloadFile={handleDownload} />
        </form>

        <Actions customClassName="flex flex-col md:flex-row md:mt-0 mt-6 md:absolute bottom-4" />

        <ErrorToast message={errorToastMessage} onClose={closeToast} />
        <SuccessToast message={successToastMessage} onClose={successToast} />
      </div>
    </>
  );
}

const MAX_ARRAYBUFFER_SIZE_GB = 500; // Threshold: 500 GB

// async function processLargeZip(blob) {
//   // Convert the Blob into a ReadableStream of Uint8Array chunks
//   const reader = blob.stream().getReader();
//   let buffer = new Uint8Array(0);

//   while (true) {
//     const { done, value } = await reader.read();
//     if (done) break;
//     // Append new chunks to the buffer (fflate can work in a streaming manner)
//     const newBuffer = new Uint8Array(buffer.length + value.length);
//     newBuffer.set(buffer, 0);
//     newBuffer.set(value, buffer.length);
//     buffer = newBuffer;
//   }

//   // Unzip using fflate
//   unzip(buffer, (err, files) => {
//     if (err) {
//       console.error("Unzip error:", err);
//       return;
//     }
//     // `files` is an object mapping filenames to their Uint8Array content
//     for (const filename in files) {
//       console.log(`Extracted ${filename}`, files[filename]);
//     }
//   });
// }

// Helper functions
async function convertComicToPdf(
  file: File,
  setProgress: (value: number) => void,
  setErrorToastMessage: (value: string) => void,
  imageWidth: string,
  imageQuality: string
): Promise<Blob | null> {
  try {
    // const fileSizeGB = file.size / (1024 * 1024)
    // const arrayBuffer = fileSizeGB > MAX_ARRAYBUFFER_SIZE_GB ? await streamToBlob(file) : await file.arrayBuffer();
    const arrayBuffer = await file.arrayBuffer()
    // console.log('arrayBuffer', arrayBuffer)
    // const zip = fileSizeGB > MAX_ARRAYBUFFER_SIZE_GB ? await processLargeZip(file) : await JSZip.loadAsync(await file.arrayBuffer());
    const zip = await JSZip.loadAsync(arrayBuffer);
    // console.log('zip', zip)

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
    console.log('err', err)
    Sentry.captureException(err)
    setErrorToastMessage('An unexpected error happened :('); // Trigger the toast with the error message
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

