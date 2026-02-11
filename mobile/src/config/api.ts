import { Platform } from 'react-native';
import Constants from 'expo-constants';

// Android emulator uses 10.0.2.2 to reach host machine's localhost
const DEFAULT_URL = Platform.OS === 'android'
  ? 'http://10.0.2.2:3001/api'
  : 'http://localhost:3001/api';

export const API_BASE_URL: string =
  (Constants.expoConfig?.extra as any)?.apiUrl || DEFAULT_URL;
