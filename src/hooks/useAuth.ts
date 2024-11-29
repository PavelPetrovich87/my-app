import { useApi } from './useApi';
import { authApi } from '../api/auth.api';
import { 
  LoginCredentials, 
  RegisterCredentials, 
  AuthResponse 
} from '../types/auth.types';
import { authService } from '../services/auth.service';
import { userService } from '../services/user.service';
import { useAuthContext } from '../context/AuthContext';

export const useLogin = () => {
  const { signIn } = useAuthContext();
  const {
    execute,
    isLoading,
    error,
    reset
  } = useApi<AuthResponse>(authApi.login.bind(authApi), {
    onSuccess: async (response) => {
      await signIn(response.accessToken, response.user);
    },
  });

  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await execute(credentials);
      return response;
    } catch (error) {
      // Let the caller handle the error
      throw error;
    }
  };

  return {
    login,
    isLoading,
    error,
    reset,
  };
};

export const useRegister = () => {
  const {
    execute,
    isLoading,
    error,
    reset
  } = useApi<AuthResponse>(authApi.register.bind(authApi), {
    onSuccess: async (response) => {
      // Store token and user data
      await authService.saveToken(response.accessToken);
      await userService.saveUser(response.user);
    },
  });

  const register = async (userData: RegisterCredentials) => {
    try {
      const response = await execute(userData);
      return response;
    } catch (error) {
      throw error;
    }
  };

  return {
    register,
    isLoading,
    error,
    reset,
  };
};

export const useLogout = () => {
  const { signOut } = useAuthContext();
  const {
    execute: executeLogout,
    isLoading,
    error,
  } = useApi(authApi.logout.bind(authApi), {
    onSuccess: async () => {
      await signOut();
    },
  });

  const logout = async () => {
    try {
      await executeLogout();
    } catch (error) {
      // Even if the API call fails, we still want to clear local data
      await authService.removeToken();
      await userService.removeUser();
      throw error;
    }
  };

  return {
    logout,
    isLoading,
    error,
  };
}; 