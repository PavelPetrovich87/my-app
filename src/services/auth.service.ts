import { secureStorage } from './storage';
import { AuthTokens } from '../types/auth.types';

const TOKEN_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
} as const;

export class AuthService {
  async saveTokens({ accessToken, refreshToken }: AuthTokens): Promise<void> {
    await Promise.all([
      secureStorage.set(TOKEN_KEYS.ACCESS_TOKEN, accessToken),
      secureStorage.set(TOKEN_KEYS.REFRESH_TOKEN, refreshToken),
    ]);
  }

  async getTokens(): Promise<AuthTokens | null> {
    const [accessToken, refreshToken] = await Promise.all([
      secureStorage.get(TOKEN_KEYS.ACCESS_TOKEN),
      secureStorage.get(TOKEN_KEYS.REFRESH_TOKEN),
    ]);

    if (!accessToken || !refreshToken) return null;

    return { accessToken, refreshToken };
  }

  async removeTokens(): Promise<void> {
    await Promise.all([
      secureStorage.remove(TOKEN_KEYS.ACCESS_TOKEN),
      secureStorage.remove(TOKEN_KEYS.REFRESH_TOKEN),
    ]);
  }
}

export const authService = new AuthService(); 