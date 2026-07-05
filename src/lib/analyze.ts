import type { LensId, LensResult } from '../config/types';
import { API_URL } from './config';
import { getUserId } from './user';

export interface CapturedImage {
  base64: string;
  mimeType: string;
  uri: string;
}

/** Send a captured image to the proxy and get back a typed, AI-generated result. */
export async function analyzeImage(image: CapturedImage, lensId: LensId): Promise<LensResult> {
  const userId = await getUserId();
  const appKey = process.env.EXPO_PUBLIC_APP_KEY;
  let res: Response;
  try {
    res = await fetch(`${API_URL}/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': userId,
        ...(appKey ? { 'x-app-key': appKey } : {}),
      },
      body: JSON.stringify({ image: image.base64, mimeType: image.mimeType, lensId }),
    });
  } catch {
    throw new Error(`Can't reach the analyzer at ${API_URL}. Is the server running?`);
  }

  if (!res.ok) {
    let msg = `Analysis failed (${res.status}).`;
    try {
      const body = await res.json();
      if (body?.error) msg = body.error;
    } catch {
      /* keep default */
    }
    throw new Error(msg);
  }

  return (await res.json()) as LensResult;
}
