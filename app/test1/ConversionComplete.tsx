import React, { useState, useEffect } from "react";

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
    <div className="mt-4 w-full">
      {progress === 100 && (
        <>
          <div className="mt-4 text-gray-700">
            {showDownload && (
              <>
                <div className="mt-2 p-2 bg-green-300 text-gray-800 rounded shadow-md">
                  <p>
                    Your download didn’t start automatically?{" "}
                    <a href={downloadLink} download="converted.pdf" className="text-blue-700 underline font-semibold">
                      Click here
                    </a>{" "}
                    to download manually.
                  </p>
                </div>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default ConversionComplete;