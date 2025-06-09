'use client';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Image } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAtom } from 'jotai';
import { registeredUsersAtom, userAtom } from '@/store/userAtom';

export default function Complete() {
  const router = useRouter();
  const [jotaiUser, setJotaiUser] = useAtom(userAtom);
  const [jotaiUsers, setJotaiUsers] = useAtom(registeredUsersAtom);

  const handleGetStarted = () => {
    // Here you would typically save the user data and navigate to the main app
    // For now, we'll just navigate to a placeholder main screen
    setJotaiUser((prev) => ({ ...prev!, completedOnboarding: true }));
    setJotaiUsers((prev) => [...prev, jotaiUser!]); // Add the user to the registered users atom
    router.replace('/(tabs)/home');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.successIcon}>
          <Ionicons name="checkmark-circle" size={80} color="#10b981" />
        </View>

        <Text style={styles.title}>You're all set!</Text>
        <Text style={styles.subtitle}>Welcome to Barbers On Demand, {jotaiUser?.firstName}</Text>

        <View style={styles.summaryCard}>
          <View style={styles.profileSection}>
            {jotaiUser?.profileImage ? (
              <Image
                source={{ uri: jotaiUser?.profileImage as string }}
                style={styles.profileImage}
              />
            ) : (
              <View style={styles.placeholderImage}>
                <Ionicons name="person" size={32} color="#94a3b8" />
              </View>
            )}
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{jotaiUser?.firstName}</Text>
              <Text style={styles.profileType}>
                {jotaiUser?.type === 'barber' ? 'Barber' : 'Client'}
              </Text>
            </View>
          </View>

          <View style={styles.addressSection}>
            <Ionicons name="location-outline" size={20} color="#64748b" />
            <Text style={styles.addressText}>{jotaiUser?.address}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.getStartedButton} onPress={handleGetStarted}>
          <Text style={styles.getStartedButtonText}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  successIcon: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 32,
  },
  summaryCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    width: '100%',
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  placeholderImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#e2e8f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
  },
  profileType: {
    fontSize: 14,
    color: '#64748b',
    textTransform: 'capitalize',
  },
  addressSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  addressText: {
    fontSize: 14,
    color: '#64748b',
    marginLeft: 8,
    flex: 1,
  },
  nextSteps: {
    width: '100%',
    marginBottom: 32,
  },
  nextStepsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 16,
    textAlign: 'center',
  },
  stepsList: {
    gap: 12,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  stepText: {
    fontSize: 16,
    color: '#1e293b',
    marginLeft: 12,
  },
  getStartedButton: {
    backgroundColor: '#cc001e',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },
  getStartedButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
