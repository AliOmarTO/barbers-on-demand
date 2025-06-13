import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BarberOnboardingData } from '@/types';
import { useRouter } from 'expo-router';
import { useAtom } from 'jotai';
import { BarberOnboardingAtom } from '@/store/userAtom';

export default function ReviewScreen() {
  const router = useRouter();

  const [onboardingData, setOnboardingData] = useAtom(BarberOnboardingAtom);
  const handleSubmit = async () => {
    try {
      // Here you would typically send the data to your backend
      console.log('Submitting barber onboarding data:', onboardingData);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      Alert.alert(
        'Success!',
        'Your profile has been created successfully. You can now start accepting bookings!',
        [
          {
            text: 'Get Started',
            onPress: () => {
              // Navigate to main app or barber dashboard
              router.push('/');
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  };

  const getBusinessTypeText = () => {
    switch (onboardingData.businessType) {
      case 'mobile':
        return 'Mobile Services';
      case 'shop':
        return 'In-Shop Services';
      case 'both':
        return 'Both Mobile & In-Shop';
      default:
        return 'Not specified';
    }
  };

  const getAvailableDays = () => {
    return Object.entries(onboardingData.availability)
      .filter(([_, dayData]) => dayData.isAvailable)
      .map(([day, dayData]) => ({
        day: day.charAt(0).toUpperCase() + day.slice(1),
        hours: `${dayData.startTime} - ${dayData.endTime}`,
      }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Review your profile</Text>
            <Text style={styles.subtitle}>
              Make sure everything looks good before we create your barber profile
            </Text>
          </View>

          <View style={styles.sections}>
            {/* Personal Information */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Ionicons name="person-outline" size={20} color="#6366f1" />
                <Text style={styles.sectionTitle}>Personal Information</Text>
                <TouchableOpacity onPress={() => navigation.navigate('PersonalInfo')}>
                  <Text style={styles.editButton}>Edit</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.sectionContent}>
                {onboardingData.firstName} {onboardingData.lastName}
              </Text>
            </View>

            {/* Address */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Ionicons name="location-outline" size={20} color="#6366f1" />
                <Text style={styles.sectionTitle}>Business Address</Text>
                <TouchableOpacity onPress={() => navigation.navigate('Address')}>
                  <Text style={styles.editButton}>Edit</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.sectionContent}>
                {onboardingData.address.street}
                {'\n'}
                {onboardingData.address.city}, {onboardingData.address.province}{' '}
                {onboardingData.address.postalCode}
              </Text>
            </View>

            {/* Business Type */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Ionicons name="business-outline" size={20} color="#6366f1" />
                <Text style={styles.sectionTitle}>Service Type</Text>
                <TouchableOpacity onPress={() => navigation.navigate('BusinessType')}>
                  <Text style={styles.editButton}>Edit</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.sectionContent}>{getBusinessTypeText()}</Text>
            </View>

            {/* Availability */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Ionicons name="time-outline" size={20} color="#6366f1" />
                <Text style={styles.sectionTitle}>Availability</Text>
                <TouchableOpacity onPress={() => navigation.navigate('Availability')}>
                  <Text style={styles.editButton}>Edit</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.availabilityList}>
                {getAvailableDays().map((item, index) => (
                  <View key={index} style={styles.availabilityItem}>
                    <Text style={styles.dayText}>{item.day}</Text>
                    <Text style={styles.hoursText}>{item.hours}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Photos */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Ionicons name="images-outline" size={20} color="#6366f1" />
                <Text style={styles.sectionTitle}>Business Photos</Text>
                <TouchableOpacity onPress={() => navigation.navigate('Photos')}>
                  <Text style={styles.editButton}>Edit</Text>
                </TouchableOpacity>
              </View>
              {onboardingData.photos.length > 0 ? (
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View style={styles.photosContainer}>
                    {onboardingData.photos.map((photo, index) => (
                      <Image key={index} source={{ uri: photo }} style={styles.reviewPhoto} />
                    ))}
                  </View>
                </ScrollView>
              ) : (
                <Text style={styles.noPhotosText}>No photos added</Text>
              )}
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Create My Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 100,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    lineHeight: 24,
  },
  sections: {
    gap: 24,
  },
  section: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginLeft: 8,
    flex: 1,
  },
  editButton: {
    fontSize: 14,
    color: '#6366f1',
    fontWeight: '500',
  },
  sectionContent: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
  },
  availabilityList: {
    gap: 8,
  },
  availabilityItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dayText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  hoursText: {
    fontSize: 14,
    color: '#6b7280',
  },
  photosContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  reviewPhoto: {
    width: 80,
    height: 60,
    borderRadius: 8,
  },
  noPhotosText: {
    fontSize: 14,
    color: '#9ca3af',
    fontStyle: 'italic',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    paddingBottom: 32,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  submitButton: {
    backgroundColor: '#cc001e',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
