function dataUrlBase64(uri: string): string | null {
  if (!uri.startsWith('data:')) return null;
  const comma = uri.indexOf(',');
  if (comma < 0) return null;
  return uri.slice(comma + 1);
}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Could not read the selected image.'));
    reader.onloadend = () => {
      const result = typeof reader.result === 'string' ? reader.result : '';
      const base64 = dataUrlBase64(result);
      if (!base64) reject(new Error('Could not extract image data.'));
      else resolve(base64);
    };
    reader.readAsDataURL(blob);
  });
}

function optimizeForWeb(uri: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onerror = () => reject(new Error('Could not load the selected image.'));
    image.onload = () => {
      const maxSide = 1400;
      const scale = Math.min(1, maxSide / Math.max(image.naturalWidth, image.naturalHeight));
      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
      canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
      const context = canvas.getContext('2d');
      if (!context) {
        reject(new Error('Could not prepare the selected image.'));
        return;
      }
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      const base64 = dataUrlBase64(canvas.toDataURL('image/jpeg', 0.72));
      if (!base64) reject(new Error('Could not prepare the selected image.'));
      else resolve(base64);
    };
    image.src = uri;
  });
}

async function uriToBase64(uri: string): Promise<string> {
  const response = await fetch(uri);
  if (!response.ok) throw new Error('Could not load the selected image.');
  const blob = await response.blob();
  return blobToBase64(blob);
}

export async function ensureBase64(base64: string | null | undefined, uri: string): Promise<string> {
  // Keep browser uploads comfortably below Vercel's request-body limit.
  if (typeof document !== 'undefined' && typeof Image !== 'undefined') return optimizeForWeb(uri);
  if (base64) return base64;
  const fromDataUrl = dataUrlBase64(uri);
  if (fromDataUrl) return fromDataUrl;
  return uriToBase64(uri);
}
