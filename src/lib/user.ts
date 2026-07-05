import AsyncStorage from '@react-native-async-storage/async-storage';

// A stable, anonymous per-device id used to attribute the server-side token
// budget. Generated once and persisted — no account/login required.
const KEY = 'prismiq:userId';
let cached: string | null = null;

export async function getUserId(): Promise<string> {
  if (cached) return cached;
  try {
    let id = await AsyncStorage.getItem(KEY);
    if (!id) {
      id = `u_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`;
      await AsyncStorage.setItem(KEY, id);
    }
    cached = id;
    return id;
  } catch {
    // storage unavailable — fall back to an ephemeral id for this session
    cached = `u_ephemeral_${Math.random().toString(36).slice(2, 10)}`;
    return cached;
  }
}
