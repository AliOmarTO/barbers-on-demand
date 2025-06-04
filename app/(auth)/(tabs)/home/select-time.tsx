import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { ArrowLeft, X, Calendar, ChevronDown } from 'lucide-react-native';
import { useRouter } from 'expo-router';

interface TimeSlot {
  time: string;
  isBooked: boolean;
}

export default function TimeSelector() {
  const [selectedDate, setSelectedDate] = useState(24);
  const [selectedTime, setSelectedTime] = useState('12:15 p.m.');
  const router = useRouter();

  const dates = [
    { date: 24, day: 'Thursday' },
    { date: 25, day: 'Friday' },
    { date: 26, day: 'Saturday' },
    { date: 27, day: 'Sunday' },
    { date: 28, day: 'Monday' },
  ];

  const timeSlots: TimeSlot[] = [
    { time: '9:00 AM', isBooked: false },
    { time: '9:30 AM', isBooked: true },
    { time: '10:00 AM', isBooked: true },
    { time: '10:30 AM', isBooked: true },
    { time: '11:00 AM', isBooked: false },
    { time: '11:30 AM', isBooked: false },
    { time: '12:00 PM', isBooked: true },
    { time: '12:30 PM', isBooked: false },
    { time: '1:00 PM', isBooked: true },
    { time: '1:30 PM', isBooked: false },
    { time: '2:00 PM', isBooked: false },
    { time: '2:30 PM', isBooked: true },
    { time: '3:00 PM', isBooked: false },
    { time: '3:30 PM', isBooked: false },
    { time: '4:00 PM', isBooked: true },
    { time: '4:30 PM', isBooked: false },
    { time: '5:00 PM', isBooked: true },
    { time: '5:30 PM', isBooked: false },
    { time: '6:00 PM', isBooked: false },
    { time: '6:30 PM', isBooked: false },
  ];

  const getSelectedDateName = () => {
    const selectedDateObj = dates.find((d) => d.date === selectedDate);
    return selectedDateObj ? selectedDateObj.day : 'Thursday';
  };

  const renderTimeSlot = (slot: TimeSlot) => {
    const isSelected = selectedTime === slot.time;
    const isAvailable = !slot.isBooked;

    return (
      <TouchableOpacity
        key={slot.time}
        onPress={() => isAvailable && setSelectedTime(slot.time)}
        disabled={slot.isBooked}
        className={`flex-1 mx-1 mb-3 py-4 rounded-lg items-center justify-center min-h-[60px] ${
          isSelected
            ? 'bg-red-600'
            : isAvailable
            ? 'bg-white border border-gray-200'
            : 'bg-gray-200'
        }`}
      >
        <Text
          className={`font-medium ${
            isSelected ? 'text-white' : isAvailable ? 'text-black' : 'text-gray-500'
          }`}
        >
          {slot.time}
        </Text>
        {slot.isBooked && <Text className="text-gray-500 text-xs mt-1">Booked</Text>}
      </TouchableOpacity>
    );
  };

  const renderTimeSlotRow = (startIndex: number) => {
    const slotsInRow = timeSlots.slice(startIndex, startIndex + 3);
    return (
      <View key={startIndex} className="flex-row">
        {slotsInRow.map(renderTimeSlot)}
        {/* Fill empty slots if row is not complete */}
        {Array.from({ length: 3 - slotsInRow.length }).map((_, index) => (
          <View key={`empty-${index}`} className="flex-1 mx-1" />
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="white" />

      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-4">
        <TouchableOpacity className="w-10 h-10 items-center justify-center">
          <ArrowLeft
            size={24}
            color="#000"
            onPress={() => {
              router.back();
            }}
          />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView className="px-4 flex-1">
        {/* Title */}
        <Text className="text-4xl font-bold text-black mb-6">Select time</Text>

        {/* User Selector and Calendar */}
        <View className="flex-row items-center justify-between mb-6">
          <TouchableOpacity className="flex-row items-center gap-3 bg-gray-100 rounded-full px-4 py-3">
            <View className="w-8 h-8 bg-purple-100 rounded-full items-center justify-center">
              <Text className="text-purple-600 font-semibold">J</Text>
            </View>
            <Text className="font-medium">Judy</Text>
            <ChevronDown size={16} color="#6B7280" />
          </TouchableOpacity>
          <TouchableOpacity className="w-12 h-12 border border-gray-300 rounded-full items-center justify-center">
            <Calendar size={20} color="#000" />
          </TouchableOpacity>
        </View>

        {/* Month/Year */}
        <Text className="text-2xl font-bold text-black mb-6">July 2025</Text>

        {/* Date Picker */}
        <View className="mb-6">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingRight: 16 }}
          >
            {dates.map((item, index) => (
              <View key={item.date} className="items-center mr-4">
                <TouchableOpacity
                  onPress={() => setSelectedDate(item.date)}
                  className={`w-16 h-16 rounded-full items-center justify-center ${
                    selectedDate === item.date ? 'bg-red-600' : 'bg-gray-100'
                  }`}
                >
                  <Text
                    className={`text-2xl font-bold ${
                      selectedDate === item.date ? 'text-white' : 'text-gray-400'
                    }`}
                  >
                    {item.date}
                  </Text>
                </TouchableOpacity>
                <Text
                  className={`text-sm mt-2 ${
                    selectedDate === item.date ? 'text-black font-medium' : 'text-gray-400'
                  }`}
                >
                  {item.day}
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Available Times Header */}
        <Text className="text-lg font-medium text-gray-800 mb-4">
          Available Times - {getSelectedDateName()}, July {selectedDate}
        </Text>

        {/* Time Slots Grid */}
        <View className="mb-6">
          {Array.from({ length: Math.ceil(timeSlots.length / 3) }).map((_, index) =>
            renderTimeSlotRow(index * 3)
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

//   <Button title="Next" onPress={() => router.push('/(auth)/(tabs)/home/confirm')} />
