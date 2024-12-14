self.onmessage = async (e) => {
  const { id, imageBlob, maxWidth, originalExt } = e.data;

  if (typeof OffscreenCanvas === 'undefined') {
    self.postMessage({ id, processedBlob: imageBlob, format: originalExt === 'png' ? 'image/png' : 'image/jpeg' });
    return;
  }

  const originalFormat = originalExt === 'png' ? 'image/png' : 'image/jpeg';
  const imgBitmap = await createImageBitmap(imageBlob);

  const needResize = imgBitmap.width > maxWidth;
  let processedBlob;

  if (!needResize) {
    processedBlob = imageBlob;
  } else {
    const width = maxWidth;
    const height = (imgBitmap.height / imgBitmap.width) * maxWidth;

    const offCanvas = new OffscreenCanvas(width, height);
    const ctx = offCanvas.getContext('2d');
    ctx.drawImage(imgBitmap, 0, 0, width, height);

    processedBlob = await offCanvas.convertToBlob({ type: originalFormat, quality: 0.8 });
  }

  imgBitmap.close(); // Release the ImageBitmap

  self.postMessage({ id, processedBlob, format: originalFormat });
};