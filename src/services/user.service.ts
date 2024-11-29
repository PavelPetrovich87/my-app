import { User } from '../types/auth.types';
import { secureStorage } from './storage';

const USER_STORAGE_KEY = 'user_data';

export class UserService {
  async saveUser(userData: User): Promise<void> {
    await secureStorage.set(USER_STORAGE_KEY, JSON.stringify(userData));
  }

  async getUser(): Promise<User | null> {
    const data = await secureStorage.get(USER_STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  }

  async removeUser(): Promise<void> {
    await secureStorage.remove(USER_STORAGE_KEY);
  }
}

export const userService = new UserService(); 