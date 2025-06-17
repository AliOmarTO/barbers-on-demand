import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  TextInput,
  Alert,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAtom } from 'jotai';
import { barberServicesAtom } from '@/store/createdBarberAtom';
import { Service } from '@/models/Barber';
import { useRouter } from 'expo-router';

interface Props {
  navigation: any;
}

interface ServiceFormData {
  name: string;
  description: string;
  duration: string;
  price: string;
  mobilePrice: string;
}

const POPULAR_SERVICES = [
  {
    name: 'Haircut',
    description: "Classic men's haircut with styling",
    duration: '30',
    icon: 'cut-outline',
  },
  {
    name: 'Beard Trim',
    description: 'Professional beard trimming and shaping',
    duration: '15',
    icon: 'man-outline',
  },
  {
    name: 'Mustache Trim',
    description: 'Precision mustache grooming',
    duration: '10',
    icon: 'man-outline',
  },
  {
    name: 'Shampoo & Style',
    description: 'Hair wash and styling',
    duration: '25',
    icon: 'water-outline',
  },
  {
    name: 'Hot Towel Shave',
    description: 'Traditional straight razor shave',
    duration: '40',
    icon: 'cut-outline',
  },
  {
    name: 'Eyebrow Trim',
    description: 'Eyebrow grooming and shaping',
    duration: '15',
    icon: 'eye-outline',
  },
];

export default function ServicesOfferedScreen() {
  const router = useRouter();
  const [services, setServices] = useAtom(barberServicesAtom);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [formData, setFormData] = useState<ServiceFormData>({
    name: '',
    description: '',
    duration: '',
    price: '',
    mobilePrice: '',
  });

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      duration: '',
      price: '',
      mobilePrice: '',
    });
    setEditingService(null);
  };

  const openAddModal = (popularService?: (typeof POPULAR_SERVICES)[0]) => {
    if (popularService) {
      setFormData({
        name: popularService.name,
        description: popularService.description,
        duration: popularService.duration,
        price: '',
        mobilePrice: '',
      });
    } else {
      resetForm();
    }
    setShowAddModal(true);
  };

  const openEditModal = (service: Service) => {
    setFormData({
      name: service.name,
      description: service.description,
      duration: service.duration.toString(),
      price: service.price.toString(),
      mobilePrice: service.mobilePrice?.toString() || '',
    });
    setEditingService(service);
    setShowAddModal(true);
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      Alert.alert('Error', 'Please enter a service name');
      return false;
    }
    if (!formData.description.trim()) {
      Alert.alert('Error', 'Please enter a service description');
      return false;
    }
    if (!formData.duration || parseInt(formData.duration) <= 0) {
      Alert.alert('Error', 'Please enter a valid duration in minutes');
      return false;
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      Alert.alert('Error', 'Please enter a valid price');
      return false;
    }
    if (formData.mobilePrice && parseFloat(formData.mobilePrice) < 0) {
      Alert.alert('Error', 'Mobile price cannot be negative');
      return false;
    }
    return true;
  };

  const handleSaveService = () => {
    if (!validateForm()) return;

    const serviceData: Omit<Service, 'id'> = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      duration: parseInt(formData.duration),
      price: parseFloat(formData.price),
      mobilePrice: formData.mobilePrice ? parseFloat(formData.mobilePrice) : undefined,
    };

    if (editingService) {
      // Update existing service
      const updatedServices = services.map((service) =>
        service.id === editingService.id ? { ...serviceData, id: editingService.id } : service
      );
      setServices(updatedServices);
    } else {
      // Add new service
      const newService: Service = {
        ...serviceData,
        id: Date.now().toString(), // Simple ID generation
      };
      setServices([...services, newService]);
    }

    setShowAddModal(false);
    resetForm();
  };

  const handleDeleteService = (serviceId: string) => {
    Alert.alert('Delete Service', 'Are you sure you want to delete this service?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          setServices(services.filter((service) => service.id !== serviceId));
        },
      },
    ]);
  };

  const handleNext = () => {
    if (services.length === 0) {
      Alert.alert('Error', 'Please add at least one service before continuing');
      return;
    }
    router.push('/(onboarding)/(barber)/availability');
  };

  

  const formatPrice = (price: number) => {
    return `$${price.toFixed(2)}`;
  };

  const formatDuration = (minutes: number) => {
    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
    }
    return `${minutes}m`;
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Skip button */}
        <View className="flex-row justify-end mb-3 mr-8">
          <TouchableOpacity>
            <Text className="text-lg font-medium" style={{ color: '#cc001e' }}>
              Skip
            </Text>
          </TouchableOpacity>
        </View>
        <View className="px-6 pt-3 pb-32">
          {/* Popular Services */}
          <View className="mb-8">
            <Text className="text-4xl font-bold text-gray-900 mb-4">Popular Services</Text>
            <Text className="text-md text-gray-600 mb-4">
              Tap to quickly add common barbering services
            </Text>

            <View className="flex-row flex-wrap gap-3">
              {POPULAR_SERVICES.map((service, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => openAddModal(service)}
                  className="bg-white border-2 border-gray-200 rounded-xl px-4 py-3 flex-row items-center active:border-red-600 active:bg-red-50"
                  activeOpacity={0.7}
                >
                  <Ionicons name={service.icon as any} size={18} color="#6b7280" />
                  <Text className="text-sm font-medium text-gray-700 ml-2">{service.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Current Services */}
          {services.length > 0 && (
            <View className="mb-8">
              <Text className="text-xl font-bold text-gray-900 mb-4">Your Services</Text>
              <View className="space-y-3">
                {services.map((service) => (
                  <View
                    key={service.id}
                    className="bg-white rounded-2xl p-5 mb-4 border border-gray-400"
                  >
                    <View className="flex-row items-start justify-between">
                      <View className="flex-1 mr-4">
                        <Text className="text-lg font-bold text-gray-900 mb-1">{service.name}</Text>
                        <Text className="text-sm text-gray-600 mb-3 leading-5">
                          {service.description}
                        </Text>

                        <View className="flex-row items-center space-x-4">
                          <View className="flex-row items-center">
                            <Ionicons name="time-outline" size={16} color="#6b7280" />
                            <Text className="text-sm text-gray-600 ml-1">
                              {formatDuration(service.duration)}
                            </Text>
                          </View>
                          <View className="flex-row items-center">
                            <Ionicons name="pricetag-outline" size={16} color="#6b7280" />
                            <Text className="text-sm font-semibold text-gray-900 ml-1">
                              {formatPrice(service.price)}
                            </Text>
                          </View>
                          {service.mobilePrice && (
                            <View className="flex-row items-center">
                              <Ionicons name="car-outline" size={16} color="#6b7280" />
                              <Text className="text-sm font-semibold text-red-600 ml-1">
                                +{formatPrice(service.mobilePrice)}
                              </Text>
                            </View>
                          )}
                        </View>
                      </View>

                      <View className="flex-row space-x-2">
                        <TouchableOpacity
                          onPress={() => openEditModal(service)}
                          className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center"
                        >
                          <Ionicons name="pencil" size={16} color="#6b7280" />
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => handleDeleteService(service.id)}
                          className="w-10 h-10 bg-red-50 rounded-full items-center justify-center"
                        >
                          <Ionicons name="trash-outline" size={16} color="#dc2626" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Add Custom Service */}
          <TouchableOpacity
            onPress={() => openAddModal()}
            className="bg-red-600 rounded-2xl p-4 mx-10 flex-row items-center justify-center shadow-lg active:bg-red-700"
            activeOpacity={0.9}
          >
            <Ionicons name="add-circle-outline" size={20} color="#ffffff" />
            <Text className="text-white text-md font-bold ml-3">Add Custom Service</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Continue Button */}
      <View className="absolute bottom-0 left-0 right-0 px-6 py-6 bg-white border-t border-gray-200 shadow-2xl">
        <TouchableOpacity
          className={`rounded-2xl py-4 px-6 flex-row items-center justify-center shadow-lg ${
            services.length > 0 ? 'bg-red-600 active:bg-red-700' : 'bg-gray-300'
          }`}
          onPress={handleNext}
          disabled={services.length === 0}
          activeOpacity={0.9}
        >
          <Text
            className={`text-lg font-bold tracking-wide mr-2 ${
              services.length > 0 ? 'text-white' : 'text-gray-500'
            }`}
          >
            Continue ({services.length} service{services.length !== 1 ? 's' : ''})
          </Text>
          <Ionicons
            name="arrow-forward"
            size={22}
            color={services.length > 0 ? '#ffffff' : '#6b7280'}
          />
        </TouchableOpacity>
      </View>

      {/* Add/Edit Service Modal */}
      <Modal visible={showAddModal} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView className="flex-1 bg-white">
          <View className="flex-1">
            {/* Modal Header */}
            <View className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <View className="flex-row items-center justify-between">
                <TouchableOpacity
                  onPress={() => {
                    setShowAddModal(false);
                    resetForm();
                  }}
                  className="w-10 h-10 bg-gray-200 rounded-full items-center justify-center"
                >
                  <Ionicons name="close" size={20} color="#6b7280" />
                </TouchableOpacity>

                <Text className="text-lg font-bold text-gray-900">
                  {editingService ? 'Edit Service' : 'Add Service'}
                </Text>

                <TouchableOpacity
                  onPress={handleSaveService}
                  className="bg-red-600 px-4 py-2 rounded-lg"
                >
                  <Text className="text-white font-semibold">Save</Text>
                </TouchableOpacity>
              </View>
            </View>

            <ScrollView className="flex-1 px-6 py-6">
              <View className="space-y-6">
                {/* Service Name */}
                <View>
                  <Text className="text-base font-semibold text-gray-900 mb-2">
                    Service Name <Text className="text-red-600">*</Text>
                  </Text>
                  <TextInput
                    className="border-2 border-gray-200 rounded-xl px-4 py-4 text-base bg-gray-50 focus:border-red-600 focus:bg-white"
                    value={formData.name}
                    onChangeText={(text) => setFormData((prev) => ({ ...prev, name: text }))}
                    placeholder="e.g., Classic Haircut"
                    autoCapitalize="words"
                  />
                </View>

                {/* Description */}
                <View>
                  <Text className="text-base font-semibold text-gray-900 mb-2">
                    Description <Text className="text-red-600">*</Text>
                  </Text>
                  <TextInput
                    className="border-2 border-gray-200 rounded-xl px-4 py-4 text-base bg-gray-50 min-h-[100px] focus:border-red-600 focus:bg-white"
                    value={formData.description}
                    onChangeText={(text) => setFormData((prev) => ({ ...prev, description: text }))}
                    placeholder="Describe what's included in this service..."
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                  />
                </View>

                {/* Duration and Price Row */}
                <View className="flex-row space-x-4">
                  <View className="flex-1">
                    <Text className="text-base font-semibold text-gray-900 mb-2">
                      Duration <Text className="text-red-600">*</Text>
                    </Text>
                    <View className="relative">
                      <TextInput
                        className="border-2 border-gray-200 rounded-xl px-4 py-4 text-base bg-gray-50 pr-16 focus:border-red-600 focus:bg-white"
                        value={formData.duration}
                        onChangeText={(text) =>
                          setFormData((prev) => ({
                            ...prev,
                            duration: text.replace(/[^0-9]/g, ''),
                          }))
                        }
                        placeholder="30"
                        keyboardType="numeric"
                      />
                      <View className="absolute right-4 top-4">
                        <Text className="text-gray-500 font-medium">min</Text>
                      </View>
                    </View>
                  </View>

                  <View className="flex-1">
                    <Text className="text-base font-semibold text-gray-900 mb-2">
                      Price <Text className="text-red-600">*</Text>
                    </Text>
                    <View className="relative">
                      <View className="absolute left-4 top-4 z-10">
                        <Text className="text-lg font-semibold text-gray-700">$</Text>
                      </View>
                      <TextInput
                        className="border-2 border-gray-200 rounded-xl pl-8 pr-4 py-4 text-base bg-gray-50 focus:border-red-600 focus:bg-white"
                        value={formData.price}
                        onChangeText={(text) =>
                          setFormData((prev) => ({ ...prev, price: text.replace(/[^0-9.]/g, '') }))
                        }
                        placeholder="25.00"
                        keyboardType="numeric"
                      />
                    </View>
                  </View>
                </View>

                {/* Mobile Price */}
                <View>
                  <Text className="text-base font-semibold text-gray-900 my-2">
                    Mobile Service Surcharge
                    <Text className="text-sm font-normal text-gray-500 ml-2">(Optional)</Text>
                  </Text>
                  <Text className="text-sm text-gray-600 mb-3">
                    Additional fee for mobile services (leave empty if same price)
                  </Text>
                  <View className="relative">
                    <View className="absolute left-4 top-4 z-10">
                      <Text className="text-lg font-semibold text-gray-700">$</Text>
                    </View>
                    <TextInput
                      className="border-2 border-gray-200 rounded-xl pl-8 pr-4 py-4 text-base bg-gray-50 focus:border-red-600 focus:bg-white"
                      value={formData.mobilePrice}
                      onChangeText={(text) =>
                        setFormData((prev) => ({
                          ...prev,
                          mobilePrice: text.replace(/[^0-9.]/g, ''),
                        }))
                      }
                      placeholder="5.00"
                      keyboardType="numeric"
                    />
                  </View>
                </View>
              </View>
            </ScrollView>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}
