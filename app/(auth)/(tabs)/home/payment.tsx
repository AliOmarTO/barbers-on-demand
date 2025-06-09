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
import { useSetAtom, useAtom } from 'jotai';
import { confirmedBookingsAtom, selectedBarberAtom } from '@/store/barberAtom';
import uuid from 'react-native-uuid';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
  ArrowLeft,
  Calendar,
  Clock,
  CreditCard,
  FileText,
  Home,
  Store,
  X,
} from 'lucide-react-native';
import { useState } from 'react';
import { Booking } from '@/types';

export default function PaymentScreen() {
  const router = useRouter();
  const [notes, setNotes] = useState('');
  const [barber] = useAtom(selectedBarberAtom);
  const { time, date, location } = useLocalSearchParams();
  const setBookings = useSetAtom(confirmedBookingsAtom);

  if (!barber || !time || !date) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white">
        <Text className="text-gray-500">Missing appointment information.</Text>
      </SafeAreaView>
    );
  }

  const handleConfirm = () => {
    // add the booking to the confirmed bookings atom
    const newBooking: Booking = {
      id: uuid.v4(), // Generate a unique ID for the booking
      barber: barber,
      serviceType: location,
      paymentMethod: 'VISA', // Assuming a default payment method
      notes: notes,
      date: date as string,
      time: time as string,
      location: barber.address,
    };
    setBookings((prev) => [...prev, newBooking]);
    Alert.alert('Confirmed', 'Your appointment has been booked!');
    router.replace('/(auth)/(tabs)/appointments');
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-100">
        <TouchableOpacity
          onPress={() => {
            router.back();
          }}
          className="p-2"
        >
          <ArrowLeft size={24} color="#000" />
        </TouchableOpacity>
        <Text className="text-xl font-semibold">Review and confirm</Text>
        <TouchableOpacity
          onPress={() => {
            router.dismissAll();
          }}
          className="p-2"
        >
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

          <View className="flex-row justify-between items-start px-4 py-4 gap-4">
            {/* Service Type */}
            <View className="flex-row items-center flex-1 p-3 bg-gray-50 rounded-xl">
              <View className="p-2 rounded-full bg-red-100 mr-3">
                {location === 'shop' ? (
                  <Store size={20} color="#EF4444" />
                ) : (
                  <Home size={20} color="#EF4444" />
                )}
              </View>
              <View>
                <Text className="text-s text-gray-500 mb-1">Service Type</Text>
                <Text className="text-sm font-semibold">
                  {location === 'shop' ? 'In Shop' : 'House Call'}
                </Text>
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
          </View>

          {/* Service Details */}
          {/* <View className="px-4 py-4 border-t border-gray-100">
            <View className="flex-row justify-between items-start mb-2">
              <View className="flex-1">
                <Text className="text-lg font-medium">Haircut</Text>
                <Text className="text-gray-600">30 mins</Text>
              </View>
              <Text className="text-lg font-semibold">{barber.price}</Text>
            </View>
          </View> */}

          {/* Total */}
          <View className="px-4 py-4 border-t border-gray-100">
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-xl font-semibold">Total</Text>
              <Text className="text-xl font-semibold">${barber.price}</Text>
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
              <Text className="text-xl font-semibold">${barber.price}</Text>
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
