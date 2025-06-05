import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, StatusBar, ScrollView } from 'react-native';
import { ArrowLeft, X, Home, Store, MapPin, Clock } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function ServiceLocationScreen() {
  const [selectedOption, setSelectedOption] = useState<'house' | 'shop' | null>(null);
  const router = useRouter();

  const handleContinue = () => {
    if (selectedOption) {
      // Navigate to next screen or handle selection
      console.log('Selected:', selectedOption);
      router.push({
        pathname: '/(auth)/(tabs)/home/select-time',
        params: { location: selectedOption },
      });
    }
  };

  const handleClose = () => {
    router.dismissAll();
  };

  const handleBack = () => {
    // Navigate back to the previous screen
    router.back();
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-100">
        <TouchableOpacity onPress={handleBack} className="p-2">
          <ArrowLeft size={24} color="#000" />
        </TouchableOpacity>
        <Text className="text-xl font-semibold">Service Location</Text>
        <TouchableOpacity onPress={handleClose} className="p-2">
          <X size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-4 py-8">
        {/* Title */}
        <View className="mb-8">
          <Text className="text-2xl font-bold text-center mb-2">
            Where would you like your service?
          </Text>
          <Text className="text-gray-600 text-center text-base leading-6">
            Choose between visiting our shop or having our barber come to you
          </Text>
        </View>

        {/* Options */}
        <View className="space-y-8  mb-8">
          {/* In Shop Option */}
          <TouchableOpacity
            onPress={() => setSelectedOption('shop')}
            className={`p-6 mb-9 rounded-xl border-2 ${
              selectedOption === 'shop' ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-white'
            }`}
          >
            <View className="flex-row items-start">
              <View
                className={`p-3 rounded-full mr-4 ${
                  selectedOption === 'shop' ? 'bg-red-100' : 'bg-gray-100'
                }`}
              >
                <Store size={24} color={selectedOption === 'shop' ? '#EF4444' : '#666'} />
              </View>
              <View className="flex-1">
                <Text className="text-xl font-semibold mb-2">In Shop</Text>
                <Text className="text-gray-600 mb-3 leading-6">
                  Visit the barbershop for your appointment.
                </Text>
                <View className="flex-row items-center mb-2">
                  <MapPin size={16} color="#666" />
                  <Text className="text-gray-600 ml-2">1687 Saint Clair Avenue West</Text>
                </View>
                <View className="flex-row items-center">
                  <Clock size={16} color="#666" />
                  <Text className="text-gray-600 ml-2">Standard pricing applies</Text>
                </View>
              </View>
            </View>
            {selectedOption === 'shop' && (
              <View className="absolute top-4 right-4">
                <View className="w-6 h-6 bg-red-500 rounded-full items-center justify-center">
                  <Text className="text-white text-xs font-bold">✓</Text>
                </View>
              </View>
            )}
          </TouchableOpacity>

          {/* House Call Option */}
          <TouchableOpacity
            onPress={() => setSelectedOption('house')}
            className={`p-6 rounded-xl border-2 ${
              selectedOption === 'house' ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-white'
            }`}
          >
            <View className="flex-row items-start">
              <View
                className={`p-3 rounded-full mr-4 ${
                  selectedOption === 'house' ? 'bg-red-100' : 'bg-gray-100'
                }`}
              >
                <Home size={24} color={selectedOption === 'house' ? '#EF4444' : '#666'} />
              </View>
              <View className="flex-1">
                <Text className="text-xl font-semibold mb-2">House Call</Text>
                <Text className="text-gray-600 mb-3 leading-6">
                  Have the professional barber come to your location. Perfect for convenience and
                  comfort.
                </Text>
                <View className="flex-row items-center mb-2">
                  <MapPin size={16} color="#666" />
                  <Text className="text-gray-600 ml-2">Service at your address</Text>
                </View>
                <View className="flex-row items-center">
                  <Clock size={16} color="#666" />
                  <Text className="text-gray-600 ml-2">Additional fee may apply</Text>
                </View>
              </View>
            </View>
            {selectedOption === 'house' && (
              <View className="absolute top-4 right-4">
                <View className="w-6 h-6 bg-red-500 rounded-full items-center justify-center">
                  <Text className="text-white text-xs font-bold">✓</Text>
                </View>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Continue Button */}
      <View className="px-4 py-4 border-t border-gray-100 bg-white">
        <TouchableOpacity
          onPress={handleContinue}
          disabled={!selectedOption}
          className={`py-4 rounded-lg ${selectedOption ? 'bg-red-600' : 'bg-gray-300'}`}
        >
          <Text
            className={`text-center text-lg font-semibold ${
              selectedOption ? 'text-white' : 'text-gray-500'
            }`}
          >
            Continue
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
