"use client";
import React from 'react';
import { useGA } from '@/hooks/useGA';
import { TFunction } from 'i18next';
import { Trans, useTranslation } from 'react-i18next';

export default function FormHints() {
  const { recordGa } = useGA();
  const translation: TFunction = useTranslation('common').t;

  return (
    <div className="p-4 bg-gray-100 rounded-md border border-gray-300 shadow-sm">
      <p className="text-sm text-gray-700 mb-2">
        {translation("formHint.firstSentence")}
      </p>
      
      <strong className="text-sm text-gray-700">{translation("formHint.fileLarger200MB")}</strong>
      
      <ul className="list-disc pl-5 text-sm text-gray-700 mb-2">
        <li>
          <strong>{translation("imageWidh")}:</strong> 
          <Trans i18nKey="formHint.widthHint">
            Recommended between <span className="font-semibold">1200px and 1400px</span>
          </Trans>
        </li>

        <li>
          <strong>{translation("imageQuality")}:</strong> 
          <Trans i18nKey="formHint.imageQualityHint">
            Recommended between <span className="font-semibold">60 and 80</span>
          </Trans>
        </li>
      </ul>

      <strong className="text-sm text-gray-700">{translation("formHint.fileSmaller200MB")}</strong>

      <p className="text-sm text-red-600 mt-2">
        <Trans i18nKey="formHint.amazonNote" values={{ size: "200MB" }} />
      </p>
      <p className="text-sm text-gray-500 italic mt-2">
        {translation("formHint.lastSentence")}
      </p>
      <div
        className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-300 shadow-md"
        onClick={() => recordGa({ category: 'Interaction', action: 'Test_file_downloaded_test' })}
      >
        <p className="text-sm text-gray-700 font-medium mb-2">
          {translation("formHint.donwloadLabel")}
        </p>
        <a
          href="https://d378pye9mzk55i.cloudfront.net/cbz-file-test.cbz"
          download
          className="inline-block px-4 py-2 bg-blue-500 text-white font-bold text-sm rounded-md shadow hover:bg-blue-600 transition-all">
          {translation("formHint.downloadButtonLabel")}
        </a>
      </div>
    </div >
  );
}