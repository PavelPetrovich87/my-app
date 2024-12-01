import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { AuthTokens } from '../types/auth.types';

const TOKEN_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
} as const;

export class AuthService {
  private async set(key: string, value: string): Promise<void> {
    if (Platform.OS === 'web') {
      await AsyncStorage.setItem(key, value);
    } else {
      await SecureStore.setItemAsync(key, value);
    }
  }

  private async get(key: string): Promise<string | null> {
    if (Platform.OS === 'web') {
      return AsyncStorage.getItem(key);
    } else {
      return SecureStore.getItemAsync(key);
    }
  }

  private async remove(key: string): Promise<void> {
    if (Platform.OS === 'web') {
      await AsyncStorage.removeItem(key);
    } else {
      await SecureStore.deleteItemAsync(key);
    }
  }

  async saveTokens({ accessToken, refreshToken }: AuthTokens): Promise<void> {
    await Promise.all([
      this.set(TOKEN_KEYS.ACCESS_TOKEN, accessToken),
      this.set(TOKEN_KEYS.REFRESH_TOKEN, refreshToken),
    ]);
  }

  async getTokens(): Promise<AuthTokens | null> {
    const [accessToken, refreshToken] = await Promise.all([
      this.get(TOKEN_KEYS.ACCESS_TOKEN),
      this.get(TOKEN_KEYS.REFRESH_TOKEN),
    ]);

    if (!accessToken || !refreshToken) return null;

    return { accessToken, refreshToken };
  }

  async removeTokens(): Promise<void> {
    await Promise.all([
      this.remove(TOKEN_KEYS.ACCESS_TOKEN),
      this.remove(TOKEN_KEYS.REFRESH_TOKEN),
    ]);
  }
}

export const authService = new AuthService(); 