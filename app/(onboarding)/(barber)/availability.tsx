import React, { useState } from 'react';
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
import { BarberOnboardingData } from '@/types';
import { useRouter } from 'expo-router';
import { useAtom } from 'jotai';
import { BarberOnboardingAtom } from '@/store/userAtom';

const days = [
  { key: 'monday', label: 'Monday' },
  { key: 'tuesday', label: 'Tuesday' },
  { key: 'wednesday', label: 'Wednesday' },
  { key: 'thursday', label: 'Thursday' },
  { key: 'friday', label: 'Friday' },
  { key: 'saturday', label: 'Saturday' },
  { key: 'sunday', label: 'Sunday' },
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

  const [onboardingData, setOnboardingData] = useAtom(BarberOnboardingAtom);
  const [availability, setAvailability] = useState(onboardingData.availability);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  const toggleDayAvailability = (day: string) => {
    setAvailability((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        isAvailable: !prev[day].isAvailable,
      },
    }));
  };

  const updateTime = (day: string, timeType: 'startTime' | 'endTime', time: string) => {
    setAvailability((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [timeType]: time,
      },
    }));
    setSelectedDay(null);
  };

  const handleNext = () => {
    const hasAvailability = Object.values(availability).some((day) => day.isAvailable);

    if (!hasAvailability) {
      alert('Please select at least one day of availability');
      return;
    }

    setData({
      ...data,
      availability,
    });

    navigation.navigate('Photos');
  };

  const renderTimeSelector = (day: string, timeType: 'startTime' | 'endTime') => {
    if (selectedDay !== `${day}-${timeType}`) return null;

    return (
      <View style={styles.timeSelector}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {timeSlots.map((time) => (
            <TouchableOpacity
              key={time}
              style={[
                styles.timeSlot,
                availability[day][timeType] === time && styles.selectedTimeSlot,
              ]}
              onPress={() => updateTime(day, timeType, time)}
            >
              <Text
                style={[
                  styles.timeSlotText,
                  availability[day][timeType] === time && styles.selectedTimeSlotText,
                ]}
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
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Set your availability</Text>
            <Text style={styles.subtitle}>
              Let clients know when you're available for appointments
            </Text>
          </View>

          <View style={styles.daysContainer}>
            {days.map(({ key, label }) => (
              <View key={key} style={styles.dayContainer}>
                <View style={styles.dayHeader}>
                  <Text style={styles.dayLabel}>{label}</Text>
                  <Switch
                    value={availability[key].isAvailable}
                    onValueChange={() => toggleDayAvailability(key)}
                    trackColor={{ false: '#e5e7eb', true: '#FFD6D1' }}
                    thumbColor={availability[key].isAvailable ? '#cc001e' : '#f3f4f6'}
                  />
                </View>

                {availability[key].isAvailable && (
                  <View style={styles.timeContainer}>
                    <TouchableOpacity
                      style={styles.timeButton}
                      onPress={() =>
                        setSelectedDay(
                          selectedDay === `${key}-startTime` ? null : `${key}-startTime`
                        )
                      }
                    >
                      <Text style={styles.timeButtonLabel}>Start Time</Text>
                      <View style={styles.timeButtonValue}>
                        <Text style={styles.timeText}>{availability[key].startTime}</Text>
                        <Ionicons name="chevron-down" size={16} color="#6b7280" />
                      </View>
                    </TouchableOpacity>

                    {renderTimeSelector(key, 'startTime')}

                    <TouchableOpacity
                      style={styles.timeButton}
                      onPress={() =>
                        setSelectedDay(selectedDay === `${key}-endTime` ? null : `${key}-endTime`)
                      }
                    >
                      <Text style={styles.timeButtonLabel}>End Time</Text>
                      <View style={styles.timeButtonValue}>
                        <Text style={styles.timeText}>{availability[key].endTime}</Text>
                        <Ionicons name="chevron-down" size={16} color="#6b7280" />
                      </View>
                    </TouchableOpacity>

                    {renderTimeSelector(key, 'endTime')}
                  </View>
                )}
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

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
