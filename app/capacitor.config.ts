import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.prismiq.app',
  appName: 'Prismiq',
  webDir: 'dist',
  ios: {
    contentInset: 'never',
    backgroundColor: '#ffffff',
  },
  android: {
    backgroundColor: '#ffffff',
  },
};

export default config;
