import React, { useState, useEffect } from "react";
import { FcApproval } from "react-icons/fc";
interface IConversionCompleteProperties {
  progress: number,
  handleDownloadFile: () => void
}

function ConversionComplete({ progress, handleDownloadFile }: IConversionCompleteProperties) {
  const [showDownload, setShowDownload] = useState(true);

  useEffect(() => {
    if (progress === 100) {
      // Simulate a delay to check if the download starts automatically
      const timer = setTimeout(() => {
        setShowDownload(true);
      }, 2000); // Wait 2 seconds to show the link if no download starts
      return () => clearTimeout(timer); // Cleanup the timer
    }
  }, [progress]);

  return (
    <>
      {progress === 100 && (
        <div className="text-gray-70 mt-4">
          {showDownload && (
            <div className="p-2 bg-green-300 text-gray-800 rounded shadow-md flex items-center space-x-2 flex-wrap md:flex-nowrap">
              <FcApproval className="text-green-800" />
              <a
                className="text-blue-700 underline font-semibold whitespace-nowrap cursor-pointer"
                onClick={handleDownloadFile}
              >
                Click here
              </a>
              <span className="whitespace-normal sm:whitespace-nowrap">to download your Kindle file.</span>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default ConversionComplete;