import { useGA } from "@/hooks/useGA";
import { TFunction } from "i18next";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { FcApproval } from "react-icons/fc";

interface IConversionCompleteProperties {
  progress: number,
  handleDownloadFile: () => void,
}

function ConversionComplete({ progress, handleDownloadFile }: IConversionCompleteProperties) {
    const { recordGa } = useGA();
    const translation: TFunction = useTranslation('common').t;
  
    const [showDownload, setShowDownload] = useState(true);

  useEffect(() => {
    if (progress === 100) {
      // Simulate a delay to check if the download starts automatically
      const timer = setTimeout(() => {
        setShowDownload(true);
      }, 2000); // Wait 2 seconds to show the link if no download starts
      return () => clearTimeout(timer); // Cleanup the timer
    }
  }, [progress, recordGa]);

  return (
    <>
      {progress === 100 && (
        <div className="text-gray-70 mt-4">
          {showDownload && (
            <div className="p-2 bg-green-300 text-gray-800 rounded shadow-md flex items-center space-x-2 flex-wrap md:flex-nowrap">
              <FcApproval className="text-green-800" />
              <a
                className="text-blue-700 underline font-semibold whitespace-nowrap cursor-pointer"
                onClick={() => { handleDownloadFile(); recordGa({category: 'Interaction', action: 'File Downloaded test1212'}) }}
              >
                {translation("conversionComplete.clickHere")}
              </a>
              <span className="whitespace-normal sm:whitespace-nowrap">{translation("conversionComplete.toDownloadYourKindleFileText")}</span>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default ConversionComplete;