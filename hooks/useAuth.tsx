import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
        const authState = await AsyncStorage.getItem('auth');
        setIsSignedIn(authState === 'true');
      } catch (error) {
        console.error('Failed to load auth state:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAuthState();
  }, []);

  const signIn = async (credentials: { email: string; password: string }) => {
    // Mock authentication - in a real app, you'd make an API call here
    if (credentials.email && credentials.password) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simple validation - accept any non-empty email/password
      setIsSignedIn(true);
      await AsyncStorage.setItem('auth', 'true');
      return true;
    }
    return false;
  };

  const signOut = async () => {
    setIsSignedIn(false);
    await AsyncStorage.removeItem('auth');
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