import { View, TextInput, Button, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import { useState, useEffect } from 'react';
import { router } from 'expo-router';

export default function Login() {
  const { signIn } = useAuth();
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    console.log('Login page rendered');
  }, []);

  const handleLogin = async () => {
    setError('');
    setLoading(true);
    
    try {
      if (!credentials.email || !credentials.password) {
        throw new Error('Please fill in all fields');
      }
      
      if (await signIn(credentials)) {
        console.log('Login successful');
        router.replace('/(app)/(tabs)/tabOne');
      } else {
        setError('Invalid credentials');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput 
        style={styles.input}
        placeholder="Email"
        onChangeText={(text) => setCredentials(prev => ({ ...prev, email: text }))}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput 
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        onChangeText={(text) => setCredentials(prev => ({ ...prev, password: text }))}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <Button title="Login" onPress={handleLogin} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  error: {
    color: 'red',
    marginBottom: 16,
    textAlign: 'center',
  },
});