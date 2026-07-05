import * as ImagePicker from 'expo-image-picker';
import { Platform } from 'react-native';
import type { CapturedImage } from './analyze';
import { ensureBase64 } from './imageData';

function mimeFromUri(uri: string): string {
  const ext = uri.split('.').pop()?.toLowerCase();
  if (ext === 'png') return 'image/png';
  if (ext === 'webp') return 'image/webp';
  if (ext === 'gif') return 'image/gif';
  return 'image/jpeg';
}

async function toCaptured(asset: ImagePicker.ImagePickerAsset): Promise<CapturedImage> {
  return {
    base64: await ensureBase64(asset.base64, asset.uri),
    mimeType: Platform.OS === 'web' ? 'image/jpeg' : (asset.mimeType ?? mimeFromUri(asset.uri)),
    uri: asset.uri,
  };
}

const COMMON = {
  mediaTypes: ['images'] as ImagePicker.MediaType[],
  quality: 0.7,
  base64: true,
  allowsEditing: true,
  aspect: [3, 4] as [number, number],
};

/** Open the OS photo library. Returns null if the user cancels. */
export async function pickFromLibrary(): Promise<CapturedImage | null> {
  const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!perm.granted) throw new Error('Photo library access is needed to upload a photo.');
  const result = await ImagePicker.launchImageLibraryAsync(COMMON);
  if (result.canceled || !result.assets?.length) return null;
  return toCaptured(result.assets[0]);
}
