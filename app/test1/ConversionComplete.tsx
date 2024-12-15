import React, { useState, useEffect } from "react";
import { FaCheckDouble } from "react-icons/fa6";

interface IConversionCompleteProperties {
  progress: number,
  downloadLink: string
}

function ConversionComplete({ progress, downloadLink }: IConversionCompleteProperties) {
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
            <>
              <div className="p-2 bg-green-300 text-gray-800 rounded shadow-md">
                <p className="flex items-center space-x-2">
                  <FaCheckDouble className="text-green-800"/>
                  <a href={downloadLink} download="converted.pdf" className="text-blue-700 underline font-semibold">
                    Click here
                  </a>
                  <span className="ml-1">to download your PDF.</span>
                </p>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}

export default ConversionComplete;