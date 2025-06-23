import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAtom } from 'jotai';
import { barberAtom } from '@/store/createdBarberAtom';
import { ServiceType, VerificationStatus } from '@/models/Barber';
import { useRouter } from 'expo-router';

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function ReviewScreen() {
  const router = useRouter();
  const [barber] = useAtom(barberAtom);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);

      console.log('Submitting barber data:', barber.toJSON());

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      router.push('/(auth)/barber/(tabs)/home');
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getServiceTypeText = () => {
    switch (barber.serviceType) {
      case ServiceType.MOBILE_ONLY:
        return 'Mobile Services Only';
      case ServiceType.SHOP:
        return 'In-Shop Services Only';
      case ServiceType.BOTH:
        return 'Both Mobile & In-Shop';
      default:
        return 'Not specified';
    }
  };

  const getAvailableDays = () => {
    return barber.weeklyAvailability
      .filter((day) => day.isAvailable)
      .map((day) => ({
        day: days[day.dayOfWeek],
        hours: `${day.startTime} - ${day.endTime}`,
      }));
  };

  const formatPhoneNumber = (phone: string) => {
    if (!phone) return 'Not provided';
    // Format as (XXX) XXX-XXXX
    const cleaned = phone.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return phone;
  };

  const getCompletionPercentage = () => {
    let completed = 0;
    let total = 10;

    if (barber.firstName && barber.lastName) completed++;
    if (barber.email) completed++;
    if (barber.phone) completed++;
    if (barber.serviceType) completed++;
    if (barber.services.length > 0) completed++;
    if (barber.weeklyAvailability.some((day) => day.isAvailable)) completed++;
    if (barber.profile.portfolioImages.length > 0) completed++;
    if (barber.profile.bio) completed++;
    if (barber.businessInfo.businessName) completed++;
    if (barber.ShopInfo?.address || barber.mobileServiceInfo) completed++;

    return Math.round((completed / total) * 100);
  };

  const getVerificationStatusText = () => {
    switch (barber.verificationStatus) {
      case VerificationStatus.VERIFIED:
        return 'Verified';
      case VerificationStatus.PENDING:
        return 'Pending';
      case VerificationStatus.REJECTED:
        return 'Rejected';
      default:
        return 'Not started';
    }
  };

  const getVerificationColor = () => {
    switch (barber.verificationStatus) {
      case VerificationStatus.VERIFIED:
        return 'text-green-600';
      case VerificationStatus.PENDING:
        return 'text-yellow-600';
      case VerificationStatus.REJECTED:
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-6 pt-8 pb-32">
          {/* Header */}
          <View className="mb-8">
            <Text className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">
              Review your profile
            </Text>
            <Text className="text-base text-gray-600 leading-6">
              Make sure everything looks good before we create your barber profile
            </Text>

            {/* Completion Progress */}
            <View className="mt-6 bg-white rounded-2xl p-4 border border-gray-200">
              <View className="flex-row items-center justify-between mb-3">
                <Text className="text-lg font-semibold text-gray-900">Profile Completion</Text>
                <Text className="text-lg font-bold text-red-600">{getCompletionPercentage()}%</Text>
              </View>
              <View className="w-full bg-gray-200 rounded-full h-3">
                <View
                  className="bg-red-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${getCompletionPercentage()}%` }}
                />
              </View>
            </View>
          </View>

          <View>
            {/* Profile Summary Stats */}
            <View className=" bg-white mb-4 rounded-2xl p-5 border border-red-200">
              <Text className="text-lg font-bold text-red-900 mb-4">Profile Summary</Text>
              <View className="flex-row flex-wrap gap-4">
                <View className="bg-white rounded-xl p-3 items-center flex-1 min-w-[45%]">
                  <Text className="text-2xl font-bold text-red-600">
                    {getCompletionPercentage()}%
                  </Text>
                  <Text className="text-sm text-gray-600 text-center">Complete</Text>
                </View>
                <View className="bg-white rounded-xl p-3 items-center flex-1 min-w-[45%]">
                  <Text className="text-2xl font-bold text-red-600">
                    {getAvailableDays().length}
                  </Text>
                  <Text className="text-sm text-gray-600 text-center">Available Days</Text>
                </View>
                <View className="bg-white rounded-xl p-3 items-center flex-1 min-w-[45%]">
                  <Text className="text-2xl font-bold text-red-600">{barber.services.length}</Text>
                  <Text className="text-sm text-gray-600 text-center">Services</Text>
                </View>
                <View className="bg-white rounded-xl p-3 items-center flex-1 min-w-[45%]">
                  <Text className="text-2xl font-bold text-red-600">
                    {barber.profile.portfolioImages.length}
                  </Text>
                  <Text className="text-sm text-gray-600 text-center">Photos</Text>
                </View>
              </View>

              {/* Readiness Status */}
              <View className="mt-4 p-4 bg-white rounded-xl">
                <View className="flex-row items-center justify-between">
                  <Text className="font-semibold text-gray-900">Ready to Accept Bookings</Text>
                  <View
                    className={`px-3 py-1 rounded-full ${
                      barber.canAcceptBookings ? 'bg-green-100' : 'bg-yellow-100'
                    }`}
                  >
                    <Text
                      className={`text-sm font-bold ${
                        barber.canAcceptBookings ? 'text-green-800' : 'text-yellow-800'
                      }`}
                    >
                      {barber.canAcceptBookings ? 'Yes' : 'Not Yet'}
                    </Text>
                  </View>
                </View>
                {!barber.canAcceptBookings && (
                  <Text className="text-sm text-gray-600 mt-2">
                    Complete verification and add payment info to start accepting bookings
                  </Text>
                )}
              </View>
            </View>

            {/* Personal Information */}
            <View className="bg-white rounded-2xl p-5 border mb-4 border-gray-200 ">
              <View className="flex-row items-center justify-between mb-4">
                <View className="flex-row items-center">
                  <View className="w-10 h-10 bg-red-100 rounded-full items-center justify-center mr-3">
                    <Ionicons name="person" size={20} color="#dc2626" />
                  </View>
                  <Text className="text-lg font-bold text-gray-900">Personal Information</Text>
                </View>
                <TouchableOpacity>
                  <Text className="text-red-600 font-semibold">Edit</Text>
                </TouchableOpacity>
              </View>

              <View className="space-y-3">
                <View className="flex-row justify-between">
                  <Text className="text-gray-600">Full Name</Text>
                  <Text className="font-semibold text-gray-900">
                    {barber.fullName || 'Not provided'}
                  </Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-gray-600">Email</Text>
                  <Text className="font-semibold text-gray-900">
                    {barber.email || 'Not provided'}
                  </Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-gray-600">Phone</Text>
                  <Text className="font-semibold text-gray-900">
                    {formatPhoneNumber(barber.phone)}
                  </Text>
                </View>
                {barber.dateOfBirth && (
                  <View className="flex-row justify-between">
                    <Text className="text-gray-600">Date of Birth</Text>
                    <Text className="font-semibold text-gray-900">
                      {new Date(barber.dateOfBirth).toLocaleDateString()}
                    </Text>
                  </View>
                )}
                {barber.profile.bio && (
                  <View>
                    <Text className="text-gray-600 mb-1">Bio</Text>
                    <Text className="font-medium text-gray-900 leading-5">
                      {barber.profile.bio}
                    </Text>
                  </View>
                )}
                {barber.profile.yearsExperience > 0 && (
                  <View className="flex-row justify-between">
                    <Text className="text-gray-600">Experience</Text>
                    <Text className="font-semibold text-gray-900">
                      {barber.profile.yearsExperience} year
                      {barber.profile.yearsExperience !== 1 ? 's' : ''}
                    </Text>
                  </View>
                )}
              </View>
            </View>

            {/* Business Information */}
            <View className="bg-white rounded-2xl p-5 border mb-4 border-gray-200 ">
              <View className="flex-row items-center justify-between mb-4">
                <View className="flex-row items-center">
                  <View className="w-10 h-10 bg-blue-100 rounded-full items-center justify-center mr-3">
                    <Ionicons name="business" size={20} color="#2563eb" />
                  </View>
                  <Text className="text-lg font-bold text-gray-900">Business Details</Text>
                </View>
                <TouchableOpacity>
                  <Text className="text-red-600 font-semibold">Edit</Text>
                </TouchableOpacity>
              </View>

              <View className="space-y-3">
                <View className="flex-row justify-between">
                  <Text className="text-gray-600">Business Name</Text>
                  <Text className="font-semibold text-gray-900">
                    {barber.businessInfo.businessName || 'Not provided'}
                  </Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-gray-600">Service Type</Text>
                  <Text className="font-semibold text-gray-900">{getServiceTypeText()}</Text>
                </View>
                {barber.businessInfo.licenseNumber && (
                  <View className="flex-row justify-between">
                    <Text className="text-gray-600">License Number</Text>
                    <Text className="font-semibold text-gray-900">
                      {barber.businessInfo.licenseNumber}
                    </Text>
                  </View>
                )}
                <View className="flex-row justify-between">
                  <Text className="text-gray-600">Verification Status</Text>
                  <Text className={`font-semibold ${getVerificationColor()}`}>
                    {getVerificationStatusText()}
                  </Text>
                </View>
              </View>
            </View>

            {/* Location Information */}
            {(barber.ShopInfo?.address || barber.mobileServiceInfo) && (
              <View className="bg-white rounded-2xl p-5 border mb-4 border-gray-200 shadow-sm">
                <View className="flex-row items-center justify-between mb-4">
                  <View className="flex-row items-center">
                    <View className="w-10 h-10 bg-green-100 rounded-full items-center justify-center mr-3">
                      <Ionicons name="location" size={20} color="#16a34a" />
                    </View>
                    <Text className="text-lg font-bold text-gray-900">Location & Service Area</Text>
                  </View>
                  <TouchableOpacity>
                    <Text className="text-red-600 font-semibold">Edit</Text>
                  </TouchableOpacity>
                </View>

                {barber.ShopInfo?.address && (
                  <View className="bg-gray-50 rounded-xl p-4 mb-3">
                    <Text className="text-sm text-gray-600 mb-1">Shop Address</Text>
                    <Text className="font-semibold text-gray-900 leading-6">
                      {barber.ShopInfo.address.address}
                      {'\n'}
                      {barber.ShopInfo.address.city}, {barber.ShopInfo.address.state}{' '}
                      {barber.ShopInfo.address.zipCode}
                    </Text>
                  </View>
                )}

                {barber.mobileServiceInfo && (
                  <View className="bg-blue-50 rounded-xl p-4">
                    <Text className="text-sm text-blue-600 mb-1">Mobile Service</Text>
                    <Text className="font-semibold text-blue-900">
                      Service Radius: {barber.mobileServiceInfo.serviceRadius} miles
                    </Text>
                  </View>
                )}
              </View>
            )}

            {/* Services */}
            {barber.services.length > 0 && (
              <View className="bg-white rounded-2xl p-5 border mb-4 border-gray-200 shadow-sm">
                <View className="flex-row items-center justify-between mb-4">
                  <View className="flex-row items-center">
                    <View className="w-10 h-10 bg-purple-100 rounded-full items-center justify-center mr-3">
                      <Ionicons name="cut" size={20} color="#7c3aed" />
                    </View>
                    <Text className="text-lg font-bold text-gray-900">Services</Text>
                  </View>
                  <TouchableOpacity>
                    <Text className="text-red-600 font-semibold">Edit</Text>
                  </TouchableOpacity>
                </View>

                <View className="space-y-3">
                  {barber.services.map((service, index) => (
                    <View
                      key={service.id}
                      className="flex-row justify-between items-center py-3 border-b border-gray-100 last:border-b-0"
                    >
                      <View className="flex-1">
                        <Text className="font-semibold text-gray-900">{service.name}</Text>
                        {service.description && (
                          <Text className="text-sm text-gray-600 mt-1">{service.description}</Text>
                        )}
                        <View className="flex-row items-center mt-1">
                          <Text className="text-xs text-gray-500">{service.duration} min</Text>
                          {service.mobilePrice && service.mobilePrice > service.price && (
                            <Text className="text-xs text-blue-600 ml-2">
                              +${service.mobilePrice - service.price} mobile
                            </Text>
                          )}
                        </View>
                      </View>
                      <View className="items-end">
                        <Text className="font-bold text-red-600">${service.price}</Text>
                        {service.mobilePrice && service.mobilePrice !== service.price && (
                          <Text className="text-sm text-gray-500">
                            ${service.mobilePrice} mobile
                          </Text>
                        )}
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Specialties */}
            {barber.profile.specialties.length > 0 && (
              <View className="bg-white rounded-2xl p-5 mb-4 border border-gray-200 shadow-sm">
                <View className="flex-row items-center mb-4">
                  <View className="w-10 h-10 bg-yellow-100 rounded-full items-center justify-center mr-3">
                    <Ionicons name="star" size={20} color="#eab308" />
                  </View>
                  <Text className="text-lg font-bold text-gray-900">Specialties</Text>
                </View>

                <View className="flex-row flex-wrap gap-2">
                  {barber.profile.specialties.map((specialty, index) => (
                    <View key={index} className="bg-yellow-100 px-3 py-1 rounded-full">
                      <Text className="text-sm font-medium text-yellow-800">{specialty}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Availability */}
            <View className="bg-white rounded-2xl p-5 mb-4 border border-gray-200 shadow-sm">
              <View className="flex-row items-center justify-between mb-4">
                <View className="flex-row items-center">
                  <View className="w-10 h-10 bg-orange-100 rounded-full items-center justify-center mr-3">
                    <Ionicons name="time" size={20} color="#ea580c" />
                  </View>
                  <Text className="text-lg font-bold text-gray-900">Availability</Text>
                </View>
                <TouchableOpacity>
                  <Text className="text-red-600 font-semibold">Edit</Text>
                </TouchableOpacity>
              </View>

              {getAvailableDays().length > 0 ? (
                <View className="space-y-3">
                  {getAvailableDays().map((item, index) => (
                    <View
                      key={index}
                      className="flex-row justify-between items-center py-2 px-4 bg-gray-50 rounded-xl"
                    >
                      <Text className="font-semibold text-gray-900">{item.day}</Text>
                      <Text className="font-medium text-gray-700">{item.hours}</Text>
                    </View>
                  ))}
                </View>
              ) : (
                <Text className="text-gray-500 italic text-center py-4">No availability set</Text>
              )}
            </View>

            {/* Portfolio Photos */}
            <View className="bg-white rounded-2xl p-5 border mb-4 border-gray-200 shadow-sm">
              <View className="flex-row items-center justify-between mb-4">
                <View className="flex-row items-center">
                  <View className="w-10 h-10 bg-pink-100 rounded-full items-center justify-center mr-3">
                    <Ionicons name="images" size={20} color="#ec4899" />
                  </View>
                  <Text className="text-lg font-bold text-gray-900">Portfolio Photos</Text>
                </View>
                <TouchableOpacity>
                  <Text className="text-red-600 font-semibold">Edit</Text>
                </TouchableOpacity>
              </View>

              {barber.profile.portfolioImages.length > 0 ? (
                <View>
                  <View className="flex-row items-center justify-between mb-3">
                    <Text className="text-sm text-gray-600">
                      {barber.profile.portfolioImages.length} photo
                      {barber.profile.portfolioImages.length !== 1 ? 's' : ''} added
                    </Text>
                    <View className="bg-red-100 px-2 py-1 rounded-full">
                      <Text className="text-xs font-bold text-red-600">
                        {barber.profile.portfolioImages.length}/6
                      </Text>
                    </View>
                  </View>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View className="flex-row space-x-3">
                      {barber.profile.portfolioImages.map((photo, index) => (
                        <Image
                          key={index}
                          source={{ uri: photo }}
                          className="w-20 h-16 rounded-xl"
                          resizeMode="cover"
                        />
                      ))}
                    </View>
                  </ScrollView>
                </View>
              ) : (
                <View className="items-center py-6">
                  <Ionicons name="images-outline" size={32} color="#d1d5db" />
                  <Text className="text-gray-500 italic mt-2">No photos added yet</Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Submit Button */}
      <View className="absolute bottom-0 left-0 right-0 px-6 py-6 bg-white border-t border-gray-200 shadow-2xl">
        <TouchableOpacity
          className={`rounded-2xl py-4 px-6 flex-row items-center justify-center shadow-lg ${
            isSubmitting ? 'bg-gray-400' : 'bg-red-600 active:bg-red-700'
          }`}
          onPress={handleSubmit}
          disabled={isSubmitting}
          activeOpacity={0.9}
        >
          {isSubmitting ? (
            <>
              <ActivityIndicator size="small" color="#ffffff" />
              <Text className="text-white text-lg font-bold ml-2">Creating Profile...</Text>
            </>
          ) : (
            <>
              <Ionicons name="checkmark-circle" size={24} color="#ffffff" />
              <Text className="text-white text-lg font-bold ml-2 tracking-wide">
                Create My Barber Profile
              </Text>
            </>
          )}
        </TouchableOpacity>

        {getCompletionPercentage() < 100 && (
          <Text className="text-center text-sm text-gray-500 mt-3">
            Your profile is {getCompletionPercentage()}% complete. You can still create it and add
            more details later.
          </Text>
        )}
      </View>
    </SafeAreaView>
  );
}
