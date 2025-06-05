import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Image,
  Alert,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAtom } from 'jotai';
import { selectedBarberAtom } from '@/store/barberAtom';
import { ArrowLeft, Calendar, Clock, CreditCard, FileText, X } from 'lucide-react-native';
import { useState } from 'react';

export default function PaymentScreen() {
  const router = useRouter();
  const [notes, setNotes] = useState('');
  const [barber] = useAtom(selectedBarberAtom);
  const { time, date } = useLocalSearchParams();

  if (!barber || !time || !date) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white">
        <Text className="text-gray-500">Missing appointment information.</Text>
      </SafeAreaView>
    );
  }

  const handleConfirm = () => {
    Alert.alert('Confirmed', 'Your appointment has been booked!');
    router.replace('/(auth)/(tabs)/appointments');
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-100">
        <TouchableOpacity className="p-2">
          <ArrowLeft size={24} color="#000" />
        </TouchableOpacity>
        <Text className="text-xl font-semibold">Review and confirm</Text>
        <TouchableOpacity className="p-2">
          <X size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView className="flex-1">
          {/* Business Info */}
          <View className="px-4 py-6">
            <View className="flex-row">
              <Image source={{ uri: barber.avatar }} className="w-16 h-16 rounded-lg mr-4" />
              <View className="flex-1">
                <Text className="text-lg font-semibold mb-1">{barber.name}</Text>
                <View className="flex-row items-center mb-1">
                  <Text className="text-base font-medium">5.0</Text>
                  <View className="flex-row ml-1">
                    {[...Array(barber.rating)].map((_, i) => (
                      <Text key={i} className="text-yellow-400 text-sm">
                        ★
                      </Text>
                    ))}
                  </View>
                  <Text className="text-gray-600 ml-1">({barber.clients})</Text>
                </View>
                <Text className="text-gray-600 text-sm">1687 Saint Clair Avenue West</Text>
              </View>
            </View>
          </View>

          {/* Date and Time */}
          <View className="px-4 pb-6">
            <View className="flex-row items-center mb-3">
              <Calendar size={20} color="#666" />
              <Text className="text-gray-600 ml-3">{date}</Text>
            </View>
            <View className="flex-row items-center">
              <Clock size={20} color="#666" />
              <Text className="text-gray-600 ml-3">{time} </Text>
            </View>
          </View>

          {/* Service Details */}
          <View className="px-4 py-4 border-t border-gray-100">
            <View className="flex-row justify-between items-start mb-2">
              <View className="flex-1">
                <Text className="text-lg font-medium">Haircut and beard /fades</Text>
                <Text className="text-gray-600">30 mins</Text>
              </View>
              <Text className="text-lg font-semibold">$40</Text>
            </View>
          </View>

          {/* Total */}
          <View className="px-4 py-4 border-t border-gray-100">
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-xl font-semibold">Total</Text>
              <Text className="text-xl font-semibold">$40</Text>
            </View>
          </View>

          {/* Payment Method */}
          <View className="px-4 py-6 border-t border-gray-100">
            <Text className="text-xl font-semibold mb-4">Payment method</Text>
            <View className="flex-row items-center p-4 border border-gray-200 rounded-lg">
              <CreditCard size={24} color="#666" />
              <Text className="text-lg ml-3">VISA</Text>
            </View>
          </View>

          {/* Notes Section */}
          <View className="px-4 py-6 border-t border-gray-100">
            <View className="flex-row items-center mb-3">
              <FileText size={20} color="#666" />
              <Text className="text-xl font-semibold ml-2">Notes</Text>
            </View>
            <TextInput
              value={notes}
              onChangeText={setNotes}
              placeholder="Add any special instructions or preferences for your appointment..."
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-gray-700 text-base leading-6 min-h-[100px]"
              style={{
                fontFamily: 'System',
              }}
            />
            {notes.length > 0 && (
              <Text className="text-gray-500 text-sm mt-2 text-right">
                {notes.length}/500 characters
              </Text>
            )}
          </View>
        </ScrollView>

        {/* Bottom Section - Fixed at bottom */}
        <View className="px-4 py-4 border-t border-gray-100 bg-white">
          <View className="flex-row justify-between items-center mb-4">
            <View>
              <Text className="text-xl font-semibold">$40</Text>
              <Text className="text-gray-600">1 service • 30 mins</Text>
            </View>
            <TouchableOpacity className="bg-red-600 px-8 py-4 rounded-lg" onPress={handleConfirm}>
              <Text className="text-white text-lg font-semibold">Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
