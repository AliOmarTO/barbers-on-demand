import React from 'react';
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {
  Calendar,
  Clock,
  MapPin,
  Home,
  Store,
  CreditCard,
  FileText,
  Phone,
} from 'lucide-react-native';
import { useAtom } from 'jotai';
import { confirmedBookingsAtom } from '@/store/barberAtom'; // Adjust import path as needed
import { Booking } from '@/types'; // Adjust import path as needed
import { useRouter } from 'expo-router';

export default function AppointmentsScreen() {
  const [bookings, setBookings] = useAtom(confirmedBookingsAtom);
  const router = useRouter();
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleCancelBooking = (idToRemove: string) => {
    // Handle booking cancellation logic here

    // alert that the booking has been cancelled
    Alert.alert('Booking Cancelled', 'Your booking has been successfully cancelled.');

    // You might want to show a confirmation dialog or remove the booking from the list
    setBookings((prev) => prev.filter((booking) => booking.id !== idToRemove));
  };

  const getServiceTypeIcon = (serviceType: string) => {
    return serviceType === 'shop' ? (
      <Store size={16} color="#EF4444" />
    ) : (
      <Home size={16} color="#3B82F6" />
    );
  };

  const getServiceTypeText = (serviceType: string) => {
    return serviceType === 'shop' ? 'In Shop' : 'House Call';
  };

  const getServiceTypeColor = (serviceType: string) => {
    return serviceType === 'shop' ? 'bg-red-50 text-red-700' : 'bg-blue-50 text-blue-700';
  };

  const renderBookingCard = (booking: Booking) => (
    <View
      key={booking.id}
      className="bg-white rounded-xl p-4 mb-4 border border-gray-100 shadow-sm"
    >
      {/* Header with Barber Info */}
      <View className="flex-row items-center mb-4">
        <Image source={{ uri: booking.barber.avatar }} className="w-12 h-12 rounded-full mr-3" />
        <View className="flex-1">
          <Text className="text-lg font-semibold">{booking.barber.name}</Text>
          <View className="flex-row items-center">
            <Text className="text-sm text-gray-600">{booking.barber.rating}</Text>
            <Text className="text-yellow-400 ml-1">★</Text>
            <Text className="text-sm text-gray-600 ml-1">({booking.barber.reviews} reviews)</Text>
          </View>
        </View>
        <View
          className={`px-3 py-1 rounded-full flex-row items-center ${getServiceTypeColor(
            booking.serviceType
          )}`}
        >
          {getServiceTypeIcon(booking.serviceType)}
          <Text className="text-xs font-medium ml-1">
            {getServiceTypeText(booking.serviceType)}
          </Text>
        </View>
      </View>

      {/* Date and Time */}
      <View className="flex-row items-center mb-3">
        <Calendar size={16} color="#666" />
        <Text className="text-gray-700 ml-2 flex-1">{booking.date}</Text>
        <Clock size={16} color="#666" />
        <Text className="text-gray-700 ml-2">{booking.time}</Text>
      </View>

      {/* Location */}
      <View className="flex-row items-center mb-3">
        <MapPin size={16} color="#666" />
        <Text className="text-gray-700 ml-2 flex-1" numberOfLines={1}>
          {booking.location}
        </Text>
      </View>

      {/* Notes (if available) */}
      {booking.notes && (
        <View className="flex-row items-start mb-3">
          <FileText size={16} color="#666" className="mt-0.5" />
          <Text className="text-gray-700 ml-2 flex-1 text-sm leading-5">{booking.notes}</Text>
        </View>
      )}

      {/* Action Buttons */}
      <View className="flex-row space-x-3 mt-4 pt-4 border-t border-gray-100">
        <TouchableOpacity
          onPress={() => handleCancelBooking(booking.id)}
          className="flex-1 bg-gray-100 py-3 rounded-lg items-center"
        >
          <Text className="text-gray-700 font-medium">Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex-1 bg-red-600 py-3 rounded-lg items-center flex-row justify-center">
          <Phone size={16} color="white" />
          <Text className="text-white font-medium ml-2">Call Barber</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const upcomingBookings = bookings;
  const pastBookings = bookings.filter((booking) => new Date(booking.date) < new Date());

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View className="px-4 py-4  border-b border-gray-100">
        <Text className="text-2xl font-bold">My Appointments</Text>
        <Text className="text-gray-600 mt-1">
          {upcomingBookings.length} upcoming • {pastBookings.length} completed
        </Text>
      </View>

      <ScrollView className="flex-1 px-4 py-4">
        {bookings.length === 0 ? (
          /* Empty State */
          <View className="flex-1 items-center justify-center py-20">
            <View className="w-20 h-20 bg-gray-200 rounded-full items-center justify-center mb-4">
              <Calendar size={32} color="#9CA3AF" />
            </View>
            <Text className="text-xl font-semibold text-gray-800 mb-2">No appointments yet</Text>
            <Text className="text-gray-600 text-center leading-6">
              Book your first appointment to see it here
            </Text>
            <TouchableOpacity
              onPress={() => {
                router.push('/map'); // Adjust the route to your booking screen
              }}
              className="bg-red-600 px-6 py-3 rounded-lg mt-6"
            >
              <Text className="text-white font-semibold">Book Now</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {/* Upcoming Appointments */}
            {upcomingBookings.length > 0 && (
              <View className="mb-6">
                <Text className="text-lg font-semibold mb-4 text-gray-800">
                  Upcoming Appointments
                </Text>
                {upcomingBookings.map(renderBookingCard)}
              </View>
            )}

            {/* Past Appointments */}
            {pastBookings.length > 0 && (
              <View className="mb-6">
                <Text className="text-lg font-semibold mb-4 text-gray-800">Past Appointments</Text>
                {pastBookings.map(renderBookingCard)}
              </View>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
