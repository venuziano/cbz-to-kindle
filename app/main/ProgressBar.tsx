/* eslint-disable react/no-unescaped-entities */
import React, { useState, useEffect } from "react";

interface IProgressBarProperties {
  progress: number,
  eta: string | null
}

function ProgressBar({ progress, eta }: IProgressBarProperties) {
  const [showWarning, setShowWarning] = useState<boolean>(false);

  useEffect(() => {
    if (progress >= 50 && !showWarning) {
      setShowWarning(true);
    }

    if (progress === 100 && showWarning) {
      setShowWarning(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progress]);

  return (
    <>
      {progress > 0 && (
        <p className="text-gray-700 mt-4">Converting: {Math.round(progress)}% - ETA: {eta}</p>
      )}

      {progress > 0 && progress < 100 && (
        <>
          <div className="mt-4 text-gray-700">
            <div className="bg-gray-200 rounded-full h-4 mt-2 overflow-hidden">
              <div
                className="bg-green-500 h-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            {showWarning && (
              <div className="mt-2 p-2 bg-yellow-300 text-gray-800 rounded shadow-md min-w-[221px]">
                🚀 You're halfway there! Hang tight, we're still converting.
              </div>
            )}
          </div>
        </>
      )}
    </>

  );
}

export default ProgressBar;