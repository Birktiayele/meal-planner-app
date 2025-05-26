// index.tsx (root-level)
// Entry point of the app that displays the WelcomeScreen.
// Navigates to the main tab layout when the user taps “Build Meal Plan.”

import { useRouter } from 'expo-router';
import WelcomeScreen from './screens/WelcomeScreen';

export default function Index() {
  const router = useRouter();

  return (
    <WelcomeScreen onBuildPress={() => router.replace('/(tabs)')} />
  );
}
