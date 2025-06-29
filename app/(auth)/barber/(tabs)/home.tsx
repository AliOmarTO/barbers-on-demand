import React, { useState, useEffect, Suspense } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  RefreshControl,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAtom } from 'jotai';
import { barberAtom } from '@/store/createdBarberAtom';
import { Booking } from '@/models/Booking';
import { useRouter } from 'expo-router';

const currentDate = new Date();
const currentYear = currentDate.getFullYear();
const currentMonth = currentDate.getMonth();
const currentDay = currentDate.getDate();

// Mock booking data - in real app this would come from your backend
interface Booking {
  id: string;
  clientName: string;
  clientPhone: string;
  serviceName: string;
  startTime: Date;
  endTime: Date;
  price: number;
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled';
  isFirstTime: boolean;
  notes?: string;
}

// const mockBookings: Booking[] = [
//   {
//     id: '1',
//     clientName: 'John Smith',
//     clientPhone: '(555) 123-4567',
//     serviceName: 'Haircut & Beard Trim',
//     startTime: new Date(currentYear, currentMonth, currentDay, 9, 0), // Current year/month, 17th day, 9:00 AM
//     endTime: new Date(currentYear, currentMonth, currentDay, 10, 0),
//     price: 45,
//     status: 'confirmed',
//     isFirstTime: false,
//   },
//   {
//     id: '2',
//     clientName: 'Mike Johnson',
//     clientPhone: '(555) 987-6543',
//     serviceName: 'Premium Haircut',
//     startTime: new Date(currentYear, currentMonth, currentDay, 11, 30), // Current year/month, 17th day, 11:30 AM
//     endTime: new Date(currentYear, currentMonth, currentDay, 12, 30),
//     price: 35,
//     status: 'confirmed',
//     isFirstTime: true,
//     notes: 'First time client - wants a modern fade',
//   },
//   {
//     id: '3',
//     clientName: 'David Wilson',
//     clientPhone: '(555) 456-7890',
//     serviceName: 'Beard Styling',
//     startTime: new Date(currentYear, currentMonth, currentDay, 14, 0), // Current year/month, 17th day, 2:00 PM
//     endTime: new Date(currentYear, currentMonth, currentDay, 14, 45),
//     price: 25,
//     status: 'pending',
//     isFirstTime: false,
//   },
//   {
//     id: '4',
//     clientName: 'Alex Brown',
//     clientPhone: '(555) 321-0987',
//     serviceName: 'Full Service Package',
//     startTime: new Date(currentYear, currentMonth, currentDay, 10, 0), // Current year/month, 18th day, 10:00 AM
//     endTime: new Date(currentYear, currentMonth, currentDay, 11, 30),
//     price: 65,
//     status: 'confirmed',
//     isFirstTime: false,
//   },
//   {
//     id: '5',
//     clientName: 'Chris Davis',
//     clientPhone: '(555) 654-3210',
//     serviceName: 'Haircut',
//     startTime: new Date(currentYear, currentMonth, currentDay, 15, 30), // Current year/month, 19th day, 3:30 PM
//     endTime: new Date(currentYear, currentMonth, currentDay, 16, 30),
//     price: 30,
//     status: 'confirmed',
//     isFirstTime: true,
//   },
// ];
const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export default function BarberHomeScreen() {
  const [barber] = useAtom(barberAtom);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  //const [bookings] = useState<Booking[]>(mockBookings);
  const [refreshing, setRefreshing] = useState(false);
  const [viewMode, setViewMode] = useState<'calendar' | 'agenda'>('calendar');

  const router = useRouter();

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate API call to refresh bookings
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const getBookingsForDate = (date: Date) => {
    return barber?.bookings?.filter(
      (booking) => booking.startTime.toDateString() === date.toDateString()
    );
  };

  const getTodaysBookings = () => {
    const today = new Date();
    return getBookingsForDate(today).sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
  };

  const getUpcomingBookings = () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return barber.bookings
      .filter((booking) => booking.startTime >= tomorrow)
      .sort((a, b) => a.startTime.getTime() - b.startTime.getTime())
      .slice(0, 3);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'checkmark-circle';
      case 'pending':
        return 'time';
      case 'completed':
        return 'checkmark-done-circle';
      case 'cancelled':
        return 'close-circle';
      default:
        return 'help-circle';
    }
  };

  const handleBookingPress = (booking: Booking) => {
    // Alert.alert(
    //   booking.clientName,
    //   `Service: ${booking.serviceName}\nTime: ${formatTime(booking.startTime)} - ${formatTime(
    //     booking.endTime
    //   )}\nPrice: $${booking.price}\nStatus: ${
    //     booking.status.charAt(0).toUpperCase() + booking.status.slice(1)
    //   }${booking.notes ? `\n\nNotes: ${booking.notes}` : ''}`,
    //   [
    //     { text: 'Call Client', onPress: () => console.log('Call client') },
    //     { text: 'View Details', onPress: () => console.log('View details') },
    //     { text: 'Close', style: 'cancel' },
    //   ]
    // );

    // go to booking details screen
    router.push({
      pathname: '/barber/booking-details/details',
      params: { bookingId: booking.id },
    });
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newMonth = new Date(currentMonth);
    if (direction === 'prev') {
      newMonth.setMonth(newMonth.getMonth() - 1);
    } else {
      newMonth.setMonth(newMonth.getMonth() + 1);
    }
    setCurrentMonth(newMonth);
  };

  const renderCalendarView = () => {
    const daysInMonth = getDaysInMonth(currentMonth);

    return (
      <View className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm">
        {/* Calendar Header */}
        <View className="flex-row items-center justify-between mb-4">
          <TouchableOpacity
            onPress={() => navigateMonth('prev')}
            className="w-10 h-10 items-center justify-center rounded-full bg-gray-100"
          >
            <Ionicons name="chevron-back" size={20} color="#6b7280" />
          </TouchableOpacity>

          <Text className="text-xl font-bold text-gray-900">
            {months[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </Text>

          <TouchableOpacity
            onPress={() => navigateMonth('next')}
            className="w-10 h-10 items-center justify-center rounded-full bg-gray-100"
          >
            <Ionicons name="chevron-forward" size={20} color="#6b7280" />
          </TouchableOpacity>
        </View>

        {/* Days of Week Header */}
        <View className="flex-row mb-2">
          {days.map((day) => (
            <View key={day} className="flex-1 items-center py-2">
              <Text className="text-sm font-semibold text-gray-600">{day}</Text>
            </View>
          ))}
        </View>

        {/* Calendar Grid */}
        <View className="flex-row flex-wrap">
          {daysInMonth.map((day, index) => {
            if (!day) {
              return <View key={index} className="w-[14.28%] aspect-square" />;
            }

            const dayBookings = getBookingsForDate(day);
            const isToday = day.toDateString() === new Date().toDateString();
            const isSelected = day.toDateString() === selectedDate.toDateString();

            return (
              <TouchableOpacity
                key={index}
                className="w-[14.28%] aspect-square p-1"
                onPress={() => setSelectedDate(day)}
              >
                <View
                  className={`flex-1 items-center justify-center rounded-lg ${
                    isSelected ? 'bg-red-600' : isToday ? 'bg-red-100' : 'bg-transparent'
                  }`}
                >
                  <Text
                    className={`text-sm font-semibold ${
                      isSelected ? 'text-white' : isToday ? 'text-red-600' : 'text-gray-900'
                    }`}
                  >
                    {day.getDate()}
                  </Text>
                  {dayBookings.length > 0 && (
                    <View
                      className={`w-2 h-2 rounded-full mt-1 ${
                        isSelected ? 'bg-white' : 'bg-red-600'
                      }`}
                    />
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  };

  const renderBookingCard = (booking: Booking) => (
    <TouchableOpacity
      key={booking.id}
      className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm mb-3"
      onPress={() => handleBookingPress(booking)}
    >
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center">
          <View className="w-12 h-12 bg-red-100 rounded-full items-center justify-center mr-3">
            <Text className="text-lg font-bold text-red-600">
              {booking.clientName
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </Text>
          </View>
          <View>
            <View className="flex-row items-center">
              <Text className="text-lg font-bold text-gray-900">{booking.clientName}</Text>
              {booking.isFirstTime && (
                <View className="ml-2 bg-blue-100 px-2 py-1 rounded-full">
                  <Text className="text-xs font-bold text-blue-600">NEW</Text>
                </View>
              )}
            </View>
            <Text className="text-sm text-gray-600">{booking.serviceName}</Text>
          </View>
        </View>

        <View className={`px-3 py-1 rounded-full ${getStatusColor(booking.status)}`}>
          <View className="flex-row items-center">
            <Ionicons name={getStatusIcon(booking.status)} size={12} color="currentColor" />
            <Text className="text-xs font-bold ml-1 capitalize">{booking.status}</Text>
          </View>
        </View>
      </View>

      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center">
          <Ionicons name="time" size={16} color="#6b7280" />
          <Text className="text-sm text-gray-600 ml-1">
            {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
          </Text>
        </View>

        <View className="flex-row items-center">
          <Ionicons name="cash" size={16} color="#16a34a" />
          <Text className="text-sm font-bold text-green-600 ml-1">${booking.price}</Text>
        </View>
      </View>

      {booking.notes && (
        <View className="mt-3 p-3 bg-gray-50 rounded-xl">
          <Text className="text-sm text-gray-700">{booking.notes}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const todaysBookings = getTodaysBookings();
  const upcomingBookings = getUpcomingBookings();
  const selectedDateBookings = getBookingsForDate(selectedDate);

  return (
    <Suspense fallback={<Text>Loading...</Text>}>
      <SafeAreaView className="flex-1 bg-gray-50">
        {/* Header */}
        <View className="px-6 pt-4 pb-2">
          <View className="flex-row items-center justify-between mb-4">
            <View>
              <Text className="text-2xl font-bold text-gray-900">Welcome back,</Text>
              <Text className="text-2xl font-bold text-red-600">{barber.firstName}</Text>
            </View>

            <View className="flex-row items-center ">
              <TouchableOpacity className="w-12 h-12 mx-3 bg-white rounded-full items-center justify-center border border-gray-200 shadow-sm">
                <Ionicons name="notifications" size={24} color="#6b7280" />
                <View className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 rounded-full items-center justify-center">
                  <Text className="text-xs font-bold text-white">3</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* Quick Stats */}
          <View className="flex-row mb-4">
            <View className="flex-1 mr-4 bg-white rounded-2xl p-4 border border-gray-200 shadow-sm">
              <View className="flex-row items-center justify-between">
                <View>
                  <Text className="text-2xl font-bold text-gray-900">{todaysBookings.length}</Text>
                  <Text className="text-sm text-gray-600">Today&apos;s Bookings</Text>
                </View>
                <View className="w-12 h-12 bg-red-100 rounded-full items-center justify-center">
                  <Ionicons name="calendar" size={24} color="#dc2626" />
                </View>
              </View>
            </View>

            <View className="flex-1 bg-white rounded-2xl p-4 border border-gray-200 shadow-sm">
              <View className="flex-row items-center justify-between">
                <View>
                  <Text className="text-2xl font-bold text-gray-900">
                    ${todaysBookings.reduce((sum, booking) => sum + booking.price, 0)}
                  </Text>
                  <Text className="text-sm text-gray-600">Today's Revenue</Text>
                </View>
                <View className="w-12 h-12 bg-green-100 rounded-full items-center justify-center">
                  <Ionicons name="cash" size={24} color="#16a34a" />
                </View>
              </View>
            </View>
          </View>

          {/* View Toggle */}
          {/* <View className="flex-row bg-gray-200 rounded-2xl p-1">
          <TouchableOpacity
            className={`flex-1 py-3 rounded-xl items-center ${
              viewMode === 'calendar' ? 'bg-white shadow-sm' : ''
            }`}
            onPress={() => setViewMode('calendar')}
          >
            <Text
              className={`font-semibold ${
                viewMode === 'calendar' ? 'text-red-600' : 'text-gray-600'
              }`}
            >
              Calendar
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className={`flex-1 py-3 rounded-xl items-center ${
              viewMode === 'agenda' ? 'bg-white shadow-sm' : ''
            }`}
            onPress={() => setViewMode('agenda')}
          >
            <Text
              className={`font-semibold ${
                viewMode === 'agenda' ? 'text-red-600' : 'text-gray-600'
              }`}
            >
              Agenda
            </Text>
          </TouchableOpacity>
        </View> */}
        </View>

        <ScrollView
          className="flex-1 px-6"
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          {viewMode === 'calendar' ? (
            <View className="pb-8">
              {renderCalendarView()}

              {/* Selected Date Bookings */}
              {selectedDateBookings.length > 0 && (
                <View className="mt-6">
                  <Text className="text-xl font-bold text-gray-900 mb-4">
                    {selectedDate.toDateString() === new Date().toDateString()
                      ? "Today's Appointments"
                      : `Appointments for ${selectedDate.toLocaleDateString()}`}
                  </Text>
                  {selectedDateBookings.map(renderBookingCard)}
                </View>
              )}
            </View>
          ) : (
            <View className="pb-8">
              {/* Today's Bookings */}
              {todaysBookings.length > 0 && (
                <View className="mb-6">
                  <Text className="text-xl font-bold text-gray-900 mb-4">Today's Appointments</Text>
                  {todaysBookings.map(renderBookingCard)}
                </View>
              )}

              {/* Upcoming Bookings */}
              {upcomingBookings.length > 0 && (
                <View className="mb-6">
                  <Text className="text-xl font-bold text-gray-900 mb-4">
                    Upcoming Appointments
                  </Text>
                  {upcomingBookings.map(renderBookingCard)}
                </View>
              )}

              {/* Empty State */}
              {todaysBookings.length === 0 && upcomingBookings.length === 0 && (
                <View className="items-center py-16">
                  <View className="w-20 h-20 bg-gray-200 rounded-full items-center justify-center mb-4">
                    <Ionicons name="calendar-outline" size={40} color="#9ca3af" />
                  </View>
                  <Text className="text-xl font-semibold text-gray-900 mb-2">
                    No appointments yet
                  </Text>
                  <Text className="text-sm text-gray-600 text-center leading-5 mb-6 max-w-xs">
                    Your bookings will appear here. Share your profile to start getting clients!
                  </Text>
                  <TouchableOpacity className="bg-red-600 px-6 py-3 rounded-xl flex-row items-center shadow-lg">
                    <Ionicons name="share" size={20} color="#ffffff" />
                    <Text className="text-white font-semibold ml-2">Share Profile</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}
        </ScrollView>

        {/* Quick Actions FAB */}
        {/* <View className="absolute bottom-12 right-12">
        <TouchableOpacity
          className="w-16 h-16 bg-red-600 rounded-full items-center justify-center shadow-2xl"
          onPress={() => {
            Alert.alert('Quick Actions', 'What would you like to do?', [
              { text: 'Block Time', onPress: () => console.log('Block time') },
              { text: 'Add Availability', onPress: () => console.log('Add availability') },
              { text: 'Add Booking', onPress: () => console.log('Add booking') },
              { text: 'Cancel', style: 'cancel' },
            ]);
          }}
        >
          <Ionicons name="add" size={32} color="#ffffff" />
        </TouchableOpacity>
      </View> */}
      </SafeAreaView>
    </Suspense>
  );
}
