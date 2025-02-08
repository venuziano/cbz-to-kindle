import JSZip from "jszip";

export async function extractCBZ(file: File, onProgress?: (progress: number) => void) {
  const zip = new JSZip();
  const cbzContents = await zip.loadAsync(file);

  // Collect image files and sort them numerically
  const imageFiles = [];
  for (const filename in cbzContents.files) {
    if (/\.(jpg|jpeg|png)$/i.test(filename)) {
      imageFiles.push(filename);
    }
  }
  imageFiles.sort((a, b) =>
    a.localeCompare(b, undefined, { numeric: true })
  );

  const images = [];
  for (let i = 0; i < imageFiles.length; i++) {
    const base64Data = await cbzContents.files[imageFiles[i]].async("base64");
    images.push(base64Data);

    // Update extraction progress (maps from 0 to 50%)
    if (onProgress) {
      const extractionProgress = Math.floor(((i + 1) / imageFiles.length) * 50);
      onProgress(extractionProgress);
    }
  }

  return images;
}

export async function createEPUB(
  images: string[],
  onProgress?: (metadata: { percent: number }) => void
) {
  const epub = new JSZip();

  // Add EPUB structure
  epub.file("mimetype", "application/epub+zip");
  const metaInf = epub.folder("META-INF");
  metaInf.file(
    "container.xml",
    `<?xml version="1.0" encoding="UTF-8" ?>
    <container xmlns="urn:oasis:names:tc:opendocument:xmlns:container" version="1.0">
      <rootfiles>
        <rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/>
      </rootfiles>
    </container>`
  );

  const oebps = epub.folder("OEBPS");

  // Generate the content.opf file
  const manifestItems = images
    .map((_, i) => `<item id="img${i}" href="images/img${i}.jpg" media-type="image/jpeg"/>`)
    .join("\n");

  const spineItems = images
    .map((_, i) => `<itemref idref="img${i}"/>`)
    .join("\n");

  const contentOpf = `<?xml version="1.0" encoding="UTF-8" ?>
  <package xmlns="http://www.idpf.org/2007/opf" version="3.0">
    <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
      <dc:title>Converted Comic</dc:title>
      <dc:creator>Unknown</dc:creator>
      <dc:language>en</dc:language>
    </metadata>
    <manifest>
      <item id="ncx" href="toc.ncx" media-type="application/x-dtbncx+xml"/>
      ${manifestItems}
    </manifest>
    <spine>
      ${spineItems}
    </spine>
  </package>`;
  oebps.file("content.opf", contentOpf);

  // Add images
  const imagesFolder = oebps.folder("images");
  images.forEach((base64Data, i) => {
    imagesFolder.file(`img${i}.jpg`, base64Data, { base64: true });
  });

  // Generate the EPUB file with compression
  // Use JSZip's onUpdate callback to report progress.
  const epubBlob = await epub.generateAsync(
    { type: "blob", compression: "DEFLATE" },
    (metadata) => {
      // Map metadata.percent (0-100) to 50-100 progress range.
      if (onProgress) {
        const creationProgress = 50 + Math.floor(metadata.percent / 2);
        onProgress({ percent: creationProgress });
      }
    }
  );

  return epubBlob;
}