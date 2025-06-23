import { auth } from '@/firebaseConfig';
import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { onAuthStateChanged, User } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { useAtom } from 'jotai';
import { registeredUsersAtom, userAtom, wasJustSignedUpAtom } from '@/store/userAtom';

export default function RootLayout() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const segments = useSegments();
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const [jotaiUser, setJotaiUser] = useAtom(userAtom);
  const [registeredUsers, setRegisteredUsers] = useAtom(registeredUsersAtom);
  const [wasJustSignedUp, setWasJustSignedUp] = useAtom(wasJustSignedUpAtom);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        console.log('User signed in pew peww:', firebaseUser);
        console.log('User ID:', registeredUsers);
        setUser(firebaseUser);
      } else {
        console.log('User signed out');
        setUser(null);
      }

      if (initializing) setInitializing(false);
    });

    return unsubscribe; // Clean up subscription on unmount
  }, []);

  // redirects user based on auth state
  useEffect(() => {
    if (initializing) return;

    // Check if the first segment is '(auth)' to determine if in auth group(protected routes)
    const inAuthGroup = segments[0] === '(auth)';

    // // if user is a first time user, redirect to onboarding
    // if (user && !inAuthGroup && !jotaiUser?.completedOnboarding) {
    //   console.log('Redirecting to onboarding');
    //   router.replace('/(onboarding)/welcome');
    // }
    // if user is not a first time user, redirect to home

    if (wasJustSignedUp) {
      // If the user just signed up, redirect to onboarding flow
      console.log('Redirecting to onboarding flow');
      router.push('/(onboarding)/common/welcome');
      setWasJustSignedUp(false); // Reset the flag
    } else if (user && !inAuthGroup) {
      console.log('Redirecting to home');
      //router.replace('/(auth)/(tabs)/home');
      if (jotaiUser?.type == 'barber') {
        console.log('Redirecting to barber profile');
        router.replace('/(auth)/barber/(tabs)/home');
      } else {
        console.log('Redirecting to user profile');
        router.replace('/(auth)/(tabs)/home');
      }
    } else if (!user && inAuthGroup) {
      console.log('Redirecting to login screen');
      router.replace('/');
    }
  }, [user, initializing]);

  if (initializing)
    return (
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          flex: 1,
        }}
      >
        <ActivityIndicator size="large" />
      </View>
    );

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={colorScheme === 'dark' ? DefaultTheme : DefaultTheme}>
        <Stack screenOptions={{ headerShown: false }} />
        <StatusBar style="auto" />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
