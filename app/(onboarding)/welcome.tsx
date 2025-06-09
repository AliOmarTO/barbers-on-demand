'use client';

import { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ArrowLeft } from 'lucide-react-native';
import { useAtom } from 'jotai';
import { registeredUsersAtom, userAtom } from '@/store/userAtom';

export default function Welcome() {
  const [selectedType, setSelectedType] = useState<'barber' | 'client' | null>(null);
  const router = useRouter();
  const [jotaiUser, setJotaiUser] = useAtom(userAtom); // Assuming you have a user atom
  const [registeredUsers, setRegisteredUsers] = useAtom(registeredUsersAtom);

  console.log('jotaiUser:', jotaiUser);
  console.log('registeredUsers:', registeredUsers);

  const handleContinue = () => {
    if (selectedType) {
      // Update the user atom with the selected type either barber or client
      setJotaiUser((prev) => ({ ...prev!, type: selectedType }));

      router.push('/(onboarding)/profile');
    }
  };

  const handleBack = () => {
    // Navigate back to the previous screen
    router.navigate('/');
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <TouchableOpacity onPress={handleBack} className="p-2">
        <ArrowLeft size={24} color="#000" />
      </TouchableOpacity>
      <View className="flex-1 justify-center px-6">
        <View className="items-center mb-12">
          <Text className="text-2xl font-bold text-slate-800 mb-2">
            Welcome to Barbers On Demand
          </Text>
          <Text className="text-base text-slate-500 text-center">
            How will you be using the app?
          </Text>
        </View>

        <View className="gap-4 mb-12">
          <TouchableOpacity
            className={`bg-white p-6 rounded-2xl items-center border-2 shadow ${
              selectedType === 'client' ? 'bg-brand border-brand' : 'border-slate-200'
            }`}
            onPress={() => setSelectedType('client')}
          >
            <View className="mb-4">
              <Ionicons
                name="person"
                size={40}
                color={selectedType === 'client' ? '#fff' : '#cc001e'}
              />
            </View>
            <Text
              className={`text-lg font-semibold mb-2 ${
                selectedType === 'client' ? 'text-white' : 'text-slate-800'
              }`}
            >
              I'm a Client
            </Text>
            <Text
              className={`text-sm text-center ${
                selectedType === 'client' ? 'text-white' : 'text-slate-500'
              }`}
            >
              Book appointments with barbers
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className={`bg-white p-6 rounded-2xl items-center border-2 shadow ${
              selectedType === 'barber' ? 'bg-brand border-brand' : 'border-slate-200'
            }`}
            onPress={() => setSelectedType('barber')}
          >
            <View className="mb-4">
              <Ionicons
                name="cut"
                size={40}
                color={selectedType === 'barber' ? '#fff000' : '#cc001e'}
              />
            </View>
            <Text
              className={`text-lg font-semibold mb-2 ${
                selectedType === 'barber' ? 'text-white' : 'text-slate-800'
              }`}
            >
              I'm a Barber
            </Text>
            <Text
              className={`text-sm text-center ${
                selectedType === 'barber' ? 'text-white' : 'text-slate-500'
              }`}
            >
              Manage appointments and clients
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          className={`py-4 rounded-xl items-center ${selectedType ? 'bg-brand' : 'bg-slate-300'}`}
          onPress={handleContinue}
          disabled={!selectedType}
        >
          <Text
            className={`text-base font-semibold ${selectedType ? 'text-white' : 'text-slate-400'}`}
          >
            Continue
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
