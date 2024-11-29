import * as SecureStore from 'expo-secure-store';

// Generic secure storage service
export class SecureStorageService {
  async set(key: string, value: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch (error) {
      console.error(`Error saving to secure storage: ${key}`, error);
      throw error;
    }
  }

  async get(key: string): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(key);
    } catch (error) {
      console.error(`Error reading from secure storage: ${key}`, error);
      return null;
    }
  }

  async remove(key: string): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch (error) {
      console.error(`Error removing from secure storage: ${key}`, error);
      throw error;
    }
  }
}

export const secureStorage = new SecureStorageService(); 