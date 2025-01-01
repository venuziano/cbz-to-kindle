"use client"; // or not needed if we just want to inject <script>?

import React from 'react';

const SeoStructuredData = () => {
  const data = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Converter CBZ 2 PDF",
    "url": "https://www.cbz-to-pdf.com.br/",
    "description": "Convert any CBZ file to PDF (CBZ to PDF) to use in your Kindle device or do whatever you want.",
    "publisher": {
      "@type": "Organization",
      "name": "Non-profit Individual",
      "logo": "https://d378pye9mzk55i.cloudfront.net/Image20241212182458.jpg"
    },
    "isPartOf": {
      "@type": "WebSite",
      "name": "Converter CBZ 2 PDF",
      "url": "https://www.cbz-to-pdf.com.br/"
    },
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How do I convert CBZ to PDF?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Simply upload your CBZ, set your options, and click Convert. Check How to use section to understand how to define your options."
        }
      }
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
};

export default SeoStructuredData;