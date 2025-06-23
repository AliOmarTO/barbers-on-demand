import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, StatusBar } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAtom } from 'jotai';
import { barberAtom } from '@/store/createdBarberAtom';

export default function AppointmentBookingScreen() {
  const router = useRouter();
  const [barber, setBarber] = useAtom(barberAtom);
  const { bookingId } = useLocalSearchParams();
  const selectedBooking = barber?.bookings?.find((booking) => booking.id === bookingId);

  const handleClose = () => {
    router.navigate('/barber/home');
  };

  const handleCheckout = () => {
    setBarber((prev) => ({
      ...prev,
      bookings: prev.bookings.map((booking) =>
        booking.id === bookingId ? { ...booking, status: 'completed' } : booking
      ),
    }));
    router.navigate('/barber/booking-details/completed');
  };

  const formatTime = (date: Date | undefined) => {
    if (!date) return '--';
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formatDate = (date: Date | undefined) => {
    if (!date) return '--';
    return date.toLocaleDateString('en-US', {
      weekday: 'short', // 'Mon'
      day: '2-digit', // '23'
      month: 'short', // 'Jun'
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#dc2626" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerDate}>{formatDate(selectedBooking?.startTime)}</Text>
          <TouchableOpacity>
            <Ionicons name="chevron-down" size={24} color="white" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
          <Ionicons name="close" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Contact Card */}
        <View style={styles.contactCard}>
          <View style={styles.contactInfo}>
            <Text style={styles.contactName}>{selectedBooking?.clientName}</Text>
            <Text style={styles.contactEmail}>{selectedBooking?.clientPhone}</Text>
          </View>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>J</Text>
          </View>
        </View>

        {/* Appointment Details */}
        <View style={styles.appointmentCard}>
          <View style={styles.appointmentRow}>
            <MaterialIcons name="calendar-today" size={20} color="#666" />
            <Text style={styles.appointmentText}>{formatDate(selectedBooking?.startTime)}</Text>
            <View style={styles.timeContainer}>
              <MaterialIcons name="access-time" size={16} color="#666" />
              <Text style={styles.timeText}>3:45pm</Text>
            </View>
          </View>

          <View style={styles.repeatRow}>
            <MaterialIcons name="repeat" size={20} color="#666" />
            <Text style={styles.repeatText}>Doesn't repeat</Text>
          </View>
        </View>

        {/* Services Section */}
        <View style={styles.servicesSection}>
          <Text style={styles.sectionTitle}>Services</Text>

          <View style={styles.serviceItem}>
            <View style={styles.serviceIndicator} />
            <View style={styles.serviceDetails}>
              <Text style={styles.serviceName}>{selectedBooking?.serviceName}</Text>
              <Text style={styles.serviceInfo}>
                {formatTime(selectedBooking?.startTime)} • {formatTime(selectedBooking?.endTime)}
              </Text>
            </View>
            <Text style={styles.servicePrice}>CA$ {selectedBooking?.price}</Text>
          </View>

          <TouchableOpacity style={styles.addServiceButton}>
            <Ionicons name="add" size={20} color="#dc2626" />
            <Text style={styles.addServiceText}>Add service</Text>
          </TouchableOpacity>
        </View>

        {/* Total Section */}
        <View style={styles.totalSection}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalAmount}>CA$ {selectedBooking?.price}</Text>
        </View>

        {/* Bottom Actions */}
        <View style={styles.bottomActions}>
          <TouchableOpacity style={styles.moreButton}>
            <Ionicons name="ellipsis-horizontal" size={24} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity onPress={handleCheckout} style={styles.checkoutButton}>
            <Text style={styles.checkoutText}>Checkout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#dc2626',
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerDate: {
    color: 'white',
    fontSize: 18,
    fontWeight: '500',
    marginRight: 8,
  },
  closeButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  contactCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  contactEmail: {
    fontSize: 14,
    color: '#666',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#e0e7ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#4f46e5',
  },
  actionButtons: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 12,
  },
  actionsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    gap: 8,
  },
  actionsButtonText: {
    fontSize: 14,
    color: '#666',
  },
  messageButton: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  appointmentCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  appointmentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  appointmentText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
    flex: 1,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timeText: {
    fontSize: 16,
    color: '#333',
  },
  repeatRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  repeatText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
  },
  servicesSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  serviceItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  serviceIndicator: {
    width: 4,
    height: 40,
    backgroundColor: '#60a5fa',
    borderRadius: 2,
    marginRight: 16,
  },
  serviceDetails: {
    flex: 1,
  },
  serviceName: {
    fontSize: 18,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  serviceInfo: {
    fontSize: 14,
    color: '#666',
  },
  servicePrice: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  addServiceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    alignSelf: 'flex-start',
    gap: 8,
  },
  addServiceText: {
    fontSize: 14,
    color: '#dc2626',
    fontWeight: '500',
  },
  totalSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  totalLabel: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
  },
  bottomActions: {
    flexDirection: 'row',
    gap: 50,
    marginBottom: 30,
  },
  moreButton: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  payNowButton: {
    flex: 1,
    backgroundColor: 'white',
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    alignItems: 'center',
  },
  payNowText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  checkoutButton: {
    flex: 1,
    backgroundColor: '#dc2626',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  checkoutText: {
    fontSize: 16,
    color: 'white',
    fontWeight: '600',
  },
});
