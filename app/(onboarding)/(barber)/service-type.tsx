import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  TextInput,
  Switch,
  StyleSheet,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BarberOnboardingData } from '@/types';
import { useAtom } from 'jotai';
import { BarberOnboardingAtom } from '@/store/userAtom';
import { useRouter } from 'expo-router';
import {
  barberServiceTypeAtom,
  barberMobileServiceAtom,
  barberShopAtom,
} from '@/store/createdBarberAtom';
import { ServiceType } from '@/models/Barber';
import { Scroll } from 'lucide-react-native';

type BusinessType = 'mobile' | 'shop' | 'both';

export default function BusinessTypeScreen() {
  const router = useRouter();
  const [serviceType, setServiceType] = useAtom(barberServiceTypeAtom);
  const [mobileServiceInfo, setMobileServiceInfo] = useAtom(barberMobileServiceAtom);
  const [shopInfo, setShopInfo] = useAtom(barberShopAtom);
  const [onboardingData, setOnboardingData] = useAtom(BarberOnboardingAtom);

  const [selectedType, setSelectedType] = useState<ServiceType>(serviceType);

  const businessTypes = [
    {
      type: ServiceType.SHOP,
      title: 'In Shop Services',
      description: 'Clients visit your barbershop',
      icon: 'storefront-outline',
    },
    {
      type: ServiceType.MOBILE_ONLY,
      title: 'Mobile Services',
      description: "You travel to clients' locations",
      icon: 'car-outline',
    },
    {
      type: ServiceType.BOTH,
      title: 'Both Options',
      description: 'Offer both in-shop and mobile services',
      icon: 'options-outline',
    },
  ];

  // Mobile service fields
  const [serviceRadius, setServiceRadius] = useState(
    mobileServiceInfo?.serviceRadius?.toString() || '10'
  );

  // Home studio fields
  const [shopAddress, setShopAddress] = useState({
    street: shopInfo?.address?.address || '',
    city: shopInfo?.address?.city || '',
    state: shopInfo?.address?.state || '',
    zipCode: shopInfo?.address?.zipCode || '',
  });
  const [directions, setDirections] = useState('');

  const handleNext = () => {
    // Update service type
    setServiceType(selectedType);

    // Update mobile service info if applicable
    if (selectedType === ServiceType.MOBILE_ONLY || selectedType === ServiceType.BOTH) {
      setMobileServiceInfo({
        serviceRadius: parseFloat(serviceRadius),
      });
    }

    // Update home studio info if applicable
    if (selectedType === ServiceType.SHOP || selectedType === ServiceType.BOTH) {
      setShopInfo({
        address: {
          latitude: 0, // Would be set via geocoding
          longitude: 0, // Would be set via geocoding
          address: shopAddress.street,
          city: shopAddress.city,
          state: shopAddress.state,
          zipCode: shopAddress.zipCode,
        },
        photos: [],
      });
    }

    router.push('/(onboarding)/(barber)/services-offered');
  };

  // renders mobile service fields if the selected type is mobile or both
  const renderMobileServiceFields = () => {
    if (selectedType !== ServiceType.MOBILE_ONLY && selectedType !== ServiceType.BOTH) {
      return null;
    }

    return (
      <View className="mt-6 p-4 bg-gray-50 rounded-xl border border-cyan-50">
        <View className="flex-row items-center mb-4">
          <Ionicons name="car" size={25} color="#cc001e" />
          <Text className="text-lg font-semibold text-brand ml-2">Mobile Service Details</Text>
        </View>

        <View>
          <Text className="text-sm font-medium text-gray-700 mb-2">
            Service Radius <Text className="text-red-600">*</Text>
          </Text>
          <Text className="text-xs text-gray-500 mb-2">How far will you travel? (in km)</Text>
          <TextInput
            className="border-2 border-gray-200 rounded-lg px-4 py-3 text-base bg-white"
            value={serviceRadius}
            onChangeText={setServiceRadius}
            placeholder="10"
            keyboardType="numeric"
          />
        </View>
      </View>
    );
  };

  // renders home studio fields if the selected type is shop or both
  const renderShopInfoFields = () => {
    if (selectedType !== ServiceType.SHOP && selectedType !== ServiceType.BOTH) {
      return null;
    }

    return (
      <View className="mt-6 p-5 rounded-2xl bg-gray-50 border border-cyan-50 shadow-sm">
        {/* Section Header */}
        <View className="flex-row items-center mb-5">
          <Ionicons name="home" size={22} color="#cc001e" />
          <Text className="ml-2 text-xl font-semibold" style={{ color: '#cc001e' }}>
            Shop Details
          </Text>
        </View>

        <View className="space-y-6">
          {/* Street Address */}
          <View>
            <Text className="text-sm font-medium text-gray-700 mb-1">
              Street Address <Text className="text-red-600">*</Text>
            </Text>
            <TextInput
              className="border border-gray-300 rounded-xl px-4 py-3 bg-white text-base"
              value={shopAddress.street}
              onChangeText={(text) => setShopAddress((prev) => ({ ...prev, street: text }))}
              placeholder="123 Main St"
            />
          </View>

          {/* City */}
          <View>
            <Text className="text-sm font-medium text-gray-700 mb-1">
              City <Text className="text-red-600">*</Text>
            </Text>
            <TextInput
              className="border border-gray-300 rounded-xl px-4 py-3 bg-white text-base"
              value={shopAddress.city}
              onChangeText={(text) => setShopAddress((prev) => ({ ...prev, city: text }))}
              placeholder="Toronto"
            />
          </View>

          {/* State */}
          <View>
            <Text className="text-sm font-medium text-gray-700 mb-1">
              State <Text className="text-red-600">*</Text>
            </Text>
            <TextInput
              className="w-24 border border-gray-300 rounded-xl px-4 py-3 bg-white text-base text-center"
              value={shopAddress.state}
              onChangeText={(text) =>
                setShopAddress((prev) => ({ ...prev, state: text.toUpperCase() }))
              }
              placeholder="ON"
              maxLength={2}
            />
          </View>

          {/* ZIP Code */}
          <View>
            <Text className="text-sm font-medium text-gray-700 mb-1">
              ZIP Code <Text className="text-red-600">*</Text>
            </Text>
            <TextInput
              className="border border-gray-300 rounded-xl px-4 py-3 bg-white text-base"
              value={shopAddress.zipCode}
              onChangeText={(text) => setShopAddress((prev) => ({ ...prev, zipCode: text }))}
              placeholder="M4B1B3"
              keyboardType="default"
              maxLength={7}
            />
          </View>

          {/* Special Directions */}
          <View>
            <Text className="text-sm font-medium text-gray-700 mb-1">
              Special Directions <Text className="text-gray-400">(Optional)</Text>
            </Text>
            <TextInput
              className="border border-gray-300 rounded-xl px-4 py-3 bg-white text-base"
              value={directions}
              onChangeText={setDirections}
              placeholder="e.g., Use side entrance, Ring doorbell twice"
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>How do you serve clients?</Text>
          <Text style={styles.subtitle}>Choose how you&apos;d like to provide your services</Text>
        </View>

        <View style={styles.options}>
          {businessTypes.map((option) => (
            <TouchableOpacity
              key={option.type}
              style={[styles.optionCard, selectedType === option.type && styles.selectedCard]}
              onPress={() => setSelectedType(option.type)}
            >
              <View style={styles.optionContent}>
                <View
                  style={[
                    styles.iconContainer,
                    selectedType === option.type && styles.selectedIconContainer,
                  ]}
                >
                  <Ionicons
                    name={option.icon as any}
                    size={32}
                    color={selectedType === option.type ? '#cc001e' : '#6b7280'}
                  />
                </View>
                <View style={styles.textContainer}>
                  <Text
                    style={[
                      styles.optionTitle,
                      selectedType === option.type && styles.selectedText,
                    ]}
                  >
                    {option.title}
                  </Text>
                  <Text style={styles.optionDescription}>{option.description}</Text>
                </View>
              </View>
              {selectedType === option.type && (
                <View style={styles.checkmark}>
                  <Ionicons name="checkmark-circle" size={24} color="#cc001e" />
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {renderShopInfoFields()}
        {renderMobileServiceFields()}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>Next</Text>
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
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  header: {
    marginBottom: 40,
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
  options: {
    flex: 1,
  },
  optionCard: {
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  selectedCard: {
    borderColor: '#cc001e',
    backgroundColor: '#f8faff',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  selectedIconContainer: {
    backgroundColor: '#f3f4f6',
  },
  textContainer: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  selectedText: {
    color: '#cc001e',
  },
  optionDescription: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  checkmark: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  nextButton: {
    backgroundColor: '#cc001e',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
