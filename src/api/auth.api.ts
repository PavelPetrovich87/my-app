import { 
  LoginCredentials, 
  RegisterCredentials, 
  AuthResponse 
} from '../types/auth.types';
import apiClient from './axios';
import { handleApiError } from '../utils/error.utils';

class AuthApi {
  private readonly BASE_PATH = '/auth';

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const { data } = await apiClient.post<AuthResponse>(
        `${this.BASE_PATH}/login`,
        credentials
      );
      return data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async register(userData: RegisterCredentials): Promise<AuthResponse> {
    try {
      const { data } = await apiClient.post<AuthResponse>(
        `${this.BASE_PATH}/register`,
        userData
      );
      return data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async logout(): Promise<void> {
    try {
      return;
    } catch (error) {
      throw handleApiError(error);
    }
  }
}

export const authApi = new AuthApi(); 