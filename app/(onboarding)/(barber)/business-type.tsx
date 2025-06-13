import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BarberOnboardingData } from '@/types';
import { useAtom } from 'jotai';
import { BarberOnboardingAtom } from '@/store/userAtom';
import { useRouter } from 'expo-router';

interface Props {
  navigation: any;
  data: BarberOnboardingData;
  setData: (data: BarberOnboardingData) => void;
}

type BusinessType = 'mobile' | 'shop' | 'both';

export default function BusinessTypeScreen() {
  const router = useRouter();
  const [onboardingData, setOnboardingData] = useAtom(BarberOnboardingAtom);
  const [selectedType, setSelectedType] = useState<BusinessType>('shop');

  const businessTypes = [
    {
      type: 'shop' as BusinessType,
      title: 'In-Shop Services',
      description: 'Clients come to your barbershop location',
      icon: 'storefront-outline',
    },
    {
      type: 'mobile' as BusinessType,
      title: 'Mobile Services',
      description: "You travel to clients' locations",
      icon: 'car-outline',
    },
    {
      type: 'both' as BusinessType,
      title: 'Both Options',
      description: 'Offer both in-shop and mobile services',
      icon: 'options-outline',
    },
  ];

  const handleNext = () => {
    setOnboardingData({
      ...onboardingData,
      businessType: selectedType,
    });

    router.push('Availability');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>How do you serve clients?</Text>
          <Text style={styles.subtitle}>Choose how you'd like to provide your services</Text>
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
      </View>

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
