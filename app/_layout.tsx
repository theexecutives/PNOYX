import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from '../contexts/AuthContext';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <StatusBar style="light" />
        <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="intro" />
          <Stack.Screen name="signin" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="account-settings" options={{ animation: 'slide_from_right' }} />
          <Stack.Screen name="notifications" options={{ animation: 'slide_from_right' }} />
          <Stack.Screen name="continue-watching" options={{ animation: 'slide_from_right' }} />
          <Stack.Screen name="help-center" options={{ animation: 'slide_from_right' }} />
          <Stack.Screen name="categories" options={{ animation: 'slide_from_right' }} />
          <Stack.Screen name="top-picks" options={{ animation: 'slide_from_right' }} />
          <Stack.Screen name="purchase-history" options={{ animation: 'slide_from_right' }} />
          <Stack.Screen name="trending" options={{ animation: 'slide_from_right' }} />
          <Stack.Screen name="devices" options={{ animation: 'slide_from_right' }} />
        </Stack>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
