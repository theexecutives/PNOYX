import { Redirect } from 'expo-router';
import { useAuth } from '../hooks/useAuth';
import { View, ActivityIndicator } from 'react-native';

export default function Entry() {
  const { loading, session } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#080808', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator color="#FFD700" size="large" />
      </View>
    );
  }

  if (session) {
    return <Redirect href="/(tabs)" />;
  }

  return <Redirect href="/intro" />;
  // After intro completes it routes to /signin; after Google auth succeeds
  // AuthContext updates session → this entry re-evaluates → redirects to tabs
}
