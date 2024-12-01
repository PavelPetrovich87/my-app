import { AuthProvider } from '../../src/context/AuthContext';
import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <AuthProvider>
      <Stack>
        <Stack.Screen 
          name="login" 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="register" 
          options={{ headerShown: false }} 
        />
      </Stack>
    </AuthProvider>
  );
} 