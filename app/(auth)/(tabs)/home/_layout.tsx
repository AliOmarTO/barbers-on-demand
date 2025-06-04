import { Stack } from 'expo-router';

export default function HomeStack() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* <Stack.Screen name="index" options={{ title: 'Home' }} />
      <Stack.Screen name="select-time" options={{ title: 'Select Time' }} />
      <Stack.Screen name="confirm" options={{ title: 'Confirm Booking' }} /> */}
    </Stack>
  );
}
