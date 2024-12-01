import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

// Define the shape of our authentication context
interface AuthContextType {
  isSignedIn: boolean;
  signIn: (credentials: { email: string; password: string }) => Promise<boolean>;
  signOut: () => void;
  isLoading: boolean;
}

// Create the context
const AuthContext = createContext<AuthContextType | null>(null);

// Props interface for the provider
interface AuthProviderProps {
  children: ReactNode;
}

// Provider component
export function AuthProvider({ children }: AuthProviderProps) {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing auth state when app loads
  useEffect(() => {
    const loadAuthState = async () => {
      try {
        // Use different storage methods based on platform
        const authState = Platform.OS === 'web'
          ? await AsyncStorage.getItem('auth')
          : await SecureStore.getItemAsync('auth');
        
        setIsSignedIn(authState ? JSON.parse(authState) : false);
        
      } catch (error) {
        console.error('Failed to load auth state:', error);
        setIsSignedIn(false);
      } finally {
        setIsLoading(false);
      }
    };

    loadAuthState();
  }, []);

  const signIn = async (credentials: { email: string; password: string }) => {
    if (credentials.email && credentials.password) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Signing in...', Platform.OS);
      // Store auth state using appropriate method, ensuring string values
      if (Platform.OS === 'web') {
        await AsyncStorage.setItem('auth', JSON.stringify(true));
      } else {
        await SecureStore.setItemAsync('auth', JSON.stringify(true));
      }
      
      setIsSignedIn(true);
      return true;
    }
    return false;
  };

  const signOut = async () => {
    setIsSignedIn(false);
    // Clear auth state using appropriate method
    if (Platform.OS === 'web') {
      await AsyncStorage.removeItem('auth');
    } else {
      await SecureStore.deleteItemAsync('auth');
    }
  };

  return (
    <AuthContext.Provider value={{ isSignedIn, signIn, signOut, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 