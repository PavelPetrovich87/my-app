import { Slot, useSegments, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { useAuth, AuthProvider } from '../hooks/useAuth';
import { View, ActivityIndicator } from 'react-native';

export default function RootLayout() {
  return (
    <AuthProvider>
      <ProtectedRoute />
    </AuthProvider>
  );
}

function ProtectedRoute() {
  const { isSignedIn, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!isSignedIn && !inAuthGroup) {
      router.replace('/login');
    } else if (isSignedIn && inAuthGroup) {
      router.replace('/(app)/(tabs)/welcome');
    }
  }, [isSignedIn, segments, isLoading]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <Slot />;
}