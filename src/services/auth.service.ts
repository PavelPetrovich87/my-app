import { secureStorage } from './storage';

const AUTH_STORAGE_KEY = 'auth_token';

export class AuthService {
  async saveToken(token: string): Promise<void> {
    await secureStorage.set(AUTH_STORAGE_KEY, token);
  }

  async getToken(): Promise<string | null> {
    return await secureStorage.get(AUTH_STORAGE_KEY);
  }

  async removeToken(): Promise<void> {
    await secureStorage.remove(AUTH_STORAGE_KEY);
  }
}

export const authService = new AuthService(); 