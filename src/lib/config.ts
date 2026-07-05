import { Platform } from 'react-native';

// Base URL of the analyze proxy (see server/). Override with EXPO_PUBLIC_API_URL
// — required on a physical device, where localhost points at the phone itself.
// Android emulators reach the host machine via 10.0.2.2.
const WEB_ORIGIN = typeof window !== 'undefined' ? window.location.origin : '';
const DEFAULT_URL =
  Platform.OS === 'web' ? `${WEB_ORIGIN}/api` : Platform.OS === 'android' ? 'http://10.0.2.2:8787' : 'http://localhost:8787';

export const API_URL = (process.env.EXPO_PUBLIC_API_URL || DEFAULT_URL).replace(/\/$/, '');
