// WelcomeScreen.tsx
// Intro screen that welcomes the user and encourages them to start building a meal plan.
// Includes a call-to-action button and a skip option that routes directly to the Recipes tab.

import { useRouter } from 'expo-router';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useWindowDimensions } from 'react-native';

type Props = {
  onBuildPress: () => void;
};

export default function WelcomeScreen({ onBuildPress }: Props) {
  const router = useRouter();
  const { width, height } = useWindowDimensions();

  return (
    <View style={[styles.container, { paddingHorizontal: width * 0.08 }]}>
      <Text style={[styles.title, { fontSize: width * 0.07 }]}>
        Your personalized{'\n'}meal plan
      </Text>
      <Text style={[styles.subtitle, { fontSize: width * 0.045 }]}>
        Plan your meals for the entire week in minutes. Build your first meal plan to get started!
      </Text>

      <TouchableOpacity style={styles.button} onPress={onBuildPress}>
        <Text style={styles.buttonText}>Build Meal Plan</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.replace('/(tabs)/recipes')} style={{ marginTop: 20 }}>
        <Text style={{ color: '#00C851', fontWeight: 'bold' }}>Skip to Recipes</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#C1F7B4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    color: '#222',
  },
  subtitle: {
    textAlign: 'center',
    color: '#444',
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#00C851',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
