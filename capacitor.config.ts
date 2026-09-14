import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.puzzlemaster.interview',
  appName: 'PuzzleMaster Interview',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#020617',
      showSpinner: false
    },
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#020617'
    }
  }
};

export default config;
