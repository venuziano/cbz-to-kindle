"use client";
import React from 'react';

export default function FormHints() {
  return (
    <div className="p-4 bg-gray-100 rounded-md border border-gray-300 shadow-sm">
      <p className="text-sm text-gray-700 mb-4">
        Configure the settings below to generate your PDF. For optimal results:
      </p>
      <ul className="list-disc pl-5 text-sm text-gray-700 mb-4">
        <li><strong>Max Width:</strong> Recommended between <span className="font-semibold">1200px and 1400px</span>.</li>
        <li><strong>Image Quality:</strong> Recommended between <span className="font-semibold">60 and 80</span>.</li>
      </ul>
      <p className="text-sm text-red-600">
        Note: Amazon only allows PDFs up to <strong>200MB</strong>. Adjust your settings accordingly.
      </p>
      <p className="text-sm text-gray-500 italic mt-2">
        These recommendations are based on my personal usage and may vary depending on your specific requirements and constraints.
      </p>
      <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-300 shadow-md">
        <p className="text-sm text-gray-700 font-medium mb-2">
          Don’t have a CBZ file to test?
        </p>
        <a
          href="https://d378pye9mzk55i.cloudfront.net/cbz-file-test.cbz"
          download
          className="inline-block px-4 py-2 bg-blue-500 text-white font-bold text-sm rounded-md shadow hover:bg-blue-600 transition-all">
          Click Here to Download a Test File
        </a>
      </div>
    </div>
  );
}