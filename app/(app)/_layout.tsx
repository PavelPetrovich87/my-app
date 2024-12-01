import { useAuth } from '../../hooks/useAuth';
import { Redirect, Stack } from 'expo-router';

export default function AppLayout() {
  const { isSignedIn } = useAuth();
  console.log('isSignedIn', isSignedIn)
  
  // If not signed in, redirect to login
  if (!isSignedIn) {
    return <Redirect href="/(auth)/login" />;
  }

  return <Stack />;
}
