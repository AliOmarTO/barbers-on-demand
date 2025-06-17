import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAtom } from 'jotai';
import { barberAvailabilityAtom } from '@/store/createdBarberAtom';
import { Availability } from '@/models/Barber';

const days = [
  { key: 0, label: 'Monday' },
  { key: 1, label: 'Tuesday' },
  { key: 2, label: 'Wednesday' },
  { key: 3, label: 'Thursday' },
  { key: 4, label: 'Friday' },
  { key: 5, label: 'Saturday' },
  { key: 6, label: 'Sunday' },
];

const timeSlots = [
  '08:00',
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00',
  '19:00',
  '20:00',
];

export default function AvailabilityScreen() {
  const router = useRouter();

  const [weeklyAvailability, setWeeklyAvailability] = useAtom(barberAvailabilityAtom);
  const [selectedTimeSelector, setSelectedTimeSelector] = useState<string | null>(null);

  // Convert Barber class availability array to a more convenient object format for the UI
  const [availabilityByDay, setAvailabilityByDay] = useState<{
    [key: number]: {
      isAvailable: boolean;
      startTime: string;
      endTime: string;
    };
  }>({});

  // Initialize availability from Barber class on component mount
  useEffect(() => {
    const availObj = days.reduce((acc, day) => {
      const dayAvail = weeklyAvailability.find((a) => a.dayOfWeek === day.key);
      acc[day.key] = {
        isAvailable: dayAvail ? dayAvail.isAvailable : false,
        startTime: dayAvail ? dayAvail.startTime : '09:00',
        endTime: dayAvail ? dayAvail.endTime : '17:00',
      };
      return acc;
    }, {} as any);

    setAvailabilityByDay(availObj);
  }, [weeklyAvailability]);

  const toggleDayAvailability = (dayOfWeek: number) => {
    setAvailabilityByDay((prev) => ({
      ...prev,
      [dayOfWeek]: {
        ...prev[dayOfWeek],
        isAvailable: !prev[dayOfWeek].isAvailable,
      },
    }));
  };

  const updateTime = (dayOfWeek: number, timeType: 'startTime' | 'endTime', time: string) => {
    setAvailabilityByDay((prev) => ({
      ...prev,
      [dayOfWeek]: {
        ...prev[dayOfWeek],
        [timeType]: time,
      },
    }));
    setSelectedTimeSelector(null);
  };

  const handleNext = () => {
    const hasAvailability = Object.values(availabilityByDay).some((day) => day.isAvailable);

    if (!hasAvailability) {
      alert('Please select at least one day of availability');
      return;
    }

    // Convert back to Barber class availability format
    const newAvailability: Availability[] = Object.entries(availabilityByDay).map(
      ([dayKey, value]) => ({
        dayOfWeek: parseInt(dayKey),
        startTime: value.startTime,
        endTime: value.endTime,
        isAvailable: value.isAvailable,
      })
    );

    // Update the atom
    setWeeklyAvailability(newAvailability);

    // Navigate to next screen
    router.push('/(onboarding)/(barber)/photos');
  };

  const handleSkip = () => {
    // Set default availability (e.g., Monday-Friday 9-5)
    const defaultAvailability: Availability[] = [
      { dayOfWeek: 1, startTime: '09:00', endTime: '17:00', isAvailable: false },
      { dayOfWeek: 2, startTime: '09:00', endTime: '17:00', isAvailable: false },
      { dayOfWeek: 3, startTime: '09:00', endTime: '17:00', isAvailable: false },
      { dayOfWeek: 4, startTime: '09:00', endTime: '17:00', isAvailable: false },
      { dayOfWeek: 5, startTime: '09:00', endTime: '17:00', isAvailable: false },
      { dayOfWeek: 0, startTime: '09:00', endTime: '17:00', isAvailable: false },
      { dayOfWeek: 6, startTime: '09:00', endTime: '17:00', isAvailable: false },
    ];

    setWeeklyAvailability(defaultAvailability);
    router.push('/(onboarding)/(barber)/photos');
  };

  const renderTimeSelector = (dayOfWeek: number, timeType: 'startTime' | 'endTime') => {
    if (selectedTimeSelector !== `${dayOfWeek}-${timeType}`) return null;

    return (
      <View className="mt-2">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {timeSlots.map((time) => (
            <TouchableOpacity
              key={time}
              className={`px-4 py-2 mr-2 rounded-lg border ${
                availabilityByDay[dayOfWeek][timeType] === time
                  ? 'bg-red-600 border-red-300'
                  : 'bg-gray-100 border-gray-200'
              }`}
              onPress={() => updateTime(dayOfWeek, timeType, time)}
            >
              <Text
                className={`text-sm ${
                  availabilityByDay[dayOfWeek][timeType] === time
                    ? 'text-white font-semibold'
                    : 'text-gray-600'
                }`}
              >
                {time}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Skip button */}
      <View className="flex-row justify-end mb-3 mr-8">
        <TouchableOpacity onPress={handleSkip}>
          <Text className="text-lg font-medium text-red-600">Skip</Text>
        </TouchableOpacity>
      </View>

      <View className="px-6 mb-8">
        <Text className="text-3xl font-bold text-gray-900 mb-2">Set your availability</Text>
        <Text className="text-base text-gray-600">
          Let clients know when you're available for appointments
        </Text>
      </View>

      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
        <View className="pb-32">
          {days.map(({ key, label }) => (
            <View
              key={key}
              className={`border rounded-xl p-4 mb-4 ${
                availabilityByDay[key]?.isAvailable ? 'border-red-200 bg-red-50' : 'border-gray-200'
              }`}
            >
              <View className="flex-row justify-between items-center">
                <Text className="text-lg font-semibold text-gray-900">{label}</Text>
                <Switch
                  value={availabilityByDay[key]?.isAvailable || false}
                  onValueChange={() => toggleDayAvailability(key)}
                  trackColor={{ false: '#e5e7eb', true: '#FFD6D1' }}
                  thumbColor={availabilityByDay[key]?.isAvailable ? '#cc001e' : '#f3f4f6'}
                />
              </View>

              {availabilityByDay[key]?.isAvailable && (
                <View className="mt-4 space-y-3">
                  <TouchableOpacity
                    className="flex-row justify-between items-center px-4 py-3 mb-4 bg-white rounded-lg border border-gray-200"
                    onPress={() =>
                      setSelectedTimeSelector(
                        selectedTimeSelector === `${key}-startTime` ? null : `${key}-startTime`
                      )
                    }
                  >
                    <Text className="text-sm text-gray-500">Start Time</Text>
                    <View className="flex-row items-center">
                      <Text className="text-base font-semibold text-gray-900 mr-2">
                        {availabilityByDay[key]?.startTime}
                      </Text>
                      <Ionicons
                        name={
                          selectedTimeSelector === `${key}-startTime`
                            ? 'chevron-up'
                            : 'chevron-down'
                        }
                        size={16}
                        color="#6b7280"
                      />
                    </View>
                  </TouchableOpacity>

                  {renderTimeSelector(key, 'startTime')}

                  <TouchableOpacity
                    className="flex-row justify-between items-center px-4 py-3 bg-white rounded-lg border border-gray-200"
                    onPress={() =>
                      setSelectedTimeSelector(
                        selectedTimeSelector === `${key}-endTime` ? null : `${key}-endTime`
                      )
                    }
                  >
                    <Text className="text-sm text-gray-500">End Time</Text>
                    <View className="flex-row items-center">
                      <Text className="text-base font-semibold text-gray-900 mr-2">
                        {availabilityByDay[key]?.endTime}
                      </Text>
                      <Ionicons
                        name={
                          selectedTimeSelector === `${key}-endTime` ? 'chevron-up' : 'chevron-down'
                        }
                        size={16}
                        color="#6b7280"
                      />
                    </View>
                  </TouchableOpacity>

                  {renderTimeSelector(key, 'endTime')}
                </View>
              )}
            </View>
          ))}
        </View>
      </ScrollView>

      <View className="absolute bottom-0 left-0 right-0 px-6 py-6 bg-white border-t border-gray-200 shadow-2xl">
        <TouchableOpacity
          className="bg-red-600 rounded-xl py-4 px-6 items-center shadow-lg active:bg-red-700"
          onPress={handleNext}
          activeOpacity={0.9}
        >
          <Text className="text-white text-lg font-bold">Continue</Text>
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
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 100,
  },
  header: {
    marginBottom: 32,
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
  daysContainer: {
    gap: 16,
  },
  dayContainer: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 16,
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dayLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  timeContainer: {
    marginTop: 16,
    gap: 12,
  },
  timeButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  timeButtonLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  timeButtonValue: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  timeSelector: {
    marginTop: 8,
  },
  timeSlot: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  selectedTimeSlot: {
    backgroundColor: '#cc001e',
    borderColor: '#FFD6D1',
  },
  timeSlotText: {
    fontSize: 14,
    color: '#6b7280',
  },
  selectedTimeSlotText: {
    color: '#fff',
    fontWeight: '600',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    paddingBottom: 32,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
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
