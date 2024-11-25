import { useAuth } from '../../hooks/useAuth';
import { Redirect, Stack } from 'expo-router';

export default function AppLayout() {
  const { isSignedIn } = useAuth();
  if (!isSignedIn) return <Redirect href="/(auth)/login" />;
  return <Stack />;
}
