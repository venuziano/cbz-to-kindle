import JSZip from "jszip";

self.onmessage = async (event) => {
  const { file } = event.data;
  try {
    // Create an instance of JSZip.
    const zip = new JSZip();

    // Convert the File/Blob to an ArrayBuffer.
    const fileData = await file.arrayBuffer();
    const cbzContents = await zip.loadAsync(fileData);

    // === Step 1: Extract Images from CBZ ===
    const imageFilenames = [];
    for (const filename in cbzContents.files) {
      if (/\.(jpg|jpeg|png)$/i.test(filename)) {
        imageFilenames.push(filename);
      }
    }
    imageFilenames.sort((a, b) =>
      a.localeCompare(b, undefined, { numeric: true })
    );

    const images = [];
    for (let i = 0; i < imageFilenames.length; i++) {
      const base64Data = await cbzContents.files[imageFilenames[i]].async("base64");
      images.push(base64Data);

      // Report extraction progress (0 to 50%).
      const extractionProgress = Math.floor(((i + 1) / imageFilenames.length) * 50);
      self.postMessage({ type: "progress", progress: extractionProgress });
    }

    // === Step 2: Create EPUB ===
    const epub = new JSZip();
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

    // Build content.opf.
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

    // Add images.
    const imagesFolder = oebps.folder("images");
    images.forEach((base64Data, i) => {
      imagesFolder.file(`img${i}.jpg`, base64Data, { base64: true });
    });

    // Generate the EPUB file.
    // Use JSZip's onUpdate callback to report progress (maps 50–100%).
    const epubBlob = await epub.generateAsync(
      { type: "blob", compression: "DEFLATE" },
      (metadata) => {
        const creationProgress = 50 + Math.floor(metadata.percent / 2);
        self.postMessage({ type: "progress", progress: creationProgress });
      }
    );

    // Return the final EPUB blob.
    self.postMessage({ type: "result", blob: epubBlob });
  } catch (error) {
    self.postMessage({ type: "error", error: error.message });
  }
};