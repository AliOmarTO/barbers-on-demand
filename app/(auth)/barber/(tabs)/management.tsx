import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
  RefreshControl,
  StyleSheet,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAtom } from 'jotai';
import { barberAtom } from '@/store/createdBarberAtom';

interface Props {
  navigation: any;
}

// Booking interface
interface Booking {
  id: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  serviceName: string;
  serviceId: string;
  startTime: Date;
  endTime: Date;
  price: number;
  status: 'new' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled' | 'declined';
  isFirstTime: boolean;
  notes?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  isMobileService: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Mock booking data
const mockBookings: Booking[] = [
  {
    id: '1',
    clientName: 'John Smith',
    clientPhone: '(555) 123-4567',
    clientEmail: 'john.smith@email.com',
    serviceName: 'Haircut & Beard Trim',
    serviceId: 'service1',
    startTime: new Date(2024, 11, 20, 9, 0),
    endTime: new Date(2024, 11, 20, 10, 0),
    price: 45,
    status: 'new',
    isFirstTime: false,
    notes: 'prefer fade cut',
    address: {
      street: '123 Main St',
      city: 'Toronto',
      state: 'ON',
      zipCode: '',
    },
    isMobileService: true,
    createdAt: new Date(2024, 11, 18, 14, 30),
    updatedAt: new Date(2024, 11, 18, 14, 30),
  },
  {
    id: '2',
    clientName: 'Mike Johnson',
    clientPhone: '(555) 987-6543',
    clientEmail: 'mike.j@email.com',
    serviceName: 'Premium Haircut',
    serviceId: 'service2',
    startTime: new Date(2024, 11, 19, 11, 30),
    endTime: new Date(2024, 11, 19, 12, 30),
    price: 35,
    status: 'confirmed',
    isFirstTime: true,
    notes: 'First time client - I want a modern fade. Allergic to certain hair products.',
    isMobileService: false,
    createdAt: new Date(2024, 11, 17, 10, 15),
    updatedAt: new Date(2024, 11, 17, 15, 20),
  },
  {
    id: '3',
    clientName: 'David Wilson',
    clientPhone: '(555) 456-7890',
    clientEmail: 'david.wilson@email.com',
    serviceName: 'Beard Styling',
    serviceId: 'service3',
    startTime: new Date(2024, 11, 18, 14, 0),
    endTime: new Date(2024, 11, 18, 14, 45),
    price: 25,
    status: 'in-progress',
    isFirstTime: false,
    address: {
      street: '456 Oak Ave',
      city: 'Toronto',
      state: 'ON',
      zipCode: '90211',
    },
    isMobileService: true,
    createdAt: new Date(2024, 11, 16, 9, 0),
    updatedAt: new Date(2024, 11, 18, 14, 0),
  },
  {
    id: '4',
    clientName: 'Alex Brown',
    clientPhone: '(555) 321-0987',
    clientEmail: 'alex.brown@email.com',
    serviceName: 'Full Service Package',
    serviceId: 'service4',
    startTime: new Date(2024, 11, 17, 10, 0),
    endTime: new Date(2024, 11, 17, 11, 30),
    price: 65,
    status: 'completed',
    isFirstTime: false,
    notes: 'little bit off the sides, leave the top long',
    isMobileService: false,
    createdAt: new Date(2024, 11, 15, 16, 45),
    updatedAt: new Date(2024, 11, 17, 11, 30),
  },
  {
    id: '5',
    clientName: 'Chris Davis',
    clientPhone: '(555) 654-3210',
    clientEmail: 'chris.davis@email.com',
    serviceName: 'Haircut',
    serviceId: 'service5',
    startTime: new Date(2024, 11, 21, 15, 30),
    endTime: new Date(2024, 11, 21, 16, 30),
    price: 30,
    status: 'new',
    isFirstTime: true,
    notes: 'Requested specific barber, wants consultation first',
    address: {
      street: '789 Pine St',
      city: 'Toronto',
      state: 'ON',
      zipCode: 'M5H 2N2',
    },
    isMobileService: true,
    createdAt: new Date(2024, 11, 19, 8, 20),
    updatedAt: new Date(2024, 11, 19, 8, 20),
  },
];

const statusTabs = [
  { key: 'all', label: 'All', count: 0 },
  { key: 'new', label: 'New', count: 0 },
  { key: 'confirmed', label: 'Confirmed', count: 0 },
  { key: 'in-progress', label: 'In Progress', count: 0 },
  { key: 'completed', label: 'Completed', count: 0 },
];

export default function BookingManagementScreen({ navigation }: Props) {
  const [barber] = useAtom(barberAtom);
  const [bookings, setBookings] = useState<Booking[]>(mockBookings);
  const [selectedTab, setSelectedTab] = useState('all');
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate API call to refresh bookings
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'new':
        return { backgroundColor: '#fef3c7', color: '#92400e' };
      case 'confirmed':
        return { backgroundColor: '#dcfce7', color: '#166534' };
      case 'in-progress':
        return { backgroundColor: '#dbeafe', color: '#1e40af' };
      case 'completed':
        return { backgroundColor: '#f3e8ff', color: '#7c2d12' };
      case 'cancelled':
        return { backgroundColor: '#fecaca', color: '#991b1b' };
      case 'declined':
        return { backgroundColor: '#fee2e2', color: '#991b1b' };
      default:
        return { backgroundColor: '#f3f4f6', color: '#374151' };
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new':
        return 'time-outline';
      case 'confirmed':
        return 'checkmark-circle-outline';
      case 'in-progress':
        return 'play-circle-outline';
      case 'completed':
        return 'checkmark-done-circle-outline';
      case 'cancelled':
        return 'close-circle-outline';
      case 'declined':
        return 'ban-outline';
      default:
        return 'help-circle-outline';
    }
  };

  const filteredBookings =
    selectedTab === 'all' ? bookings : bookings.filter((booking) => booking.status === selectedTab);

  const getTabCounts = () => {
    const counts = statusTabs.map((tab) => ({
      ...tab,
      count:
        tab.key === 'all' ? bookings.length : bookings.filter((b) => b.status === tab.key).length,
    }));
    return counts;
  };

  const handleAcceptBooking = (bookingId: string) => {
    Alert.alert('Accept Booking', 'Are you sure you want to accept this booking?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Accept',
        onPress: () => {
          setBookings((prev) =>
            prev.map((booking) =>
              booking.id === bookingId
                ? { ...booking, status: 'confirmed', updatedAt: new Date() }
                : booking
            )
          );
          Alert.alert('Success', 'Booking has been accepted!');
        },
      },
    ]);
  };

  const handleDeclineBooking = (bookingId: string) => {
    Alert.alert(
      'Decline Booking',
      'Are you sure you want to decline this booking? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Decline',
          style: 'destructive',
          onPress: () => {
            setBookings((prev) =>
              prev.map((booking) =>
                booking.id === bookingId
                  ? { ...booking, status: 'declined', updatedAt: new Date() }
                  : booking
              )
            );
            Alert.alert('Declined', 'Booking has been declined.');
          },
        },
      ]
    );
  };

  const handleStartService = (bookingId: string) => {
    setBookings((prev) =>
      prev.map((booking) =>
        booking.id === bookingId
          ? { ...booking, status: 'in-progress', updatedAt: new Date() }
          : booking
      )
    );
  };

  const handleCompleteService = (bookingId: string) => {
    setBookings((prev) =>
      prev.map((booking) =>
        booking.id === bookingId
          ? { ...booking, status: 'completed', updatedAt: new Date() }
          : booking
      )
    );
    Alert.alert('Service Completed', 'Great job! The service has been marked as completed.');
  };

  const handleCallClient = (phone: string) => {
    Linking.openURL(`tel:${phone}`);
  };

  const handleMessageClient = (phone: string) => {
    Linking.openURL(`sms:${phone}`);
  };

  const handleGetDirections = (address: any) => {
    const addressString = `${address.street}, ${address.city}, ${address.state} ${address.zipCode}`;
    const url = `https://maps.google.com/?q=${encodeURIComponent(addressString)}`;
    Linking.openURL(url);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const renderBookingCard = (booking: Booking) => {
    const statusStyle = getStatusStyle(booking.status);
    const statusIcon = getStatusIcon(booking.status);

    return (
      <View key={booking.id} style={styles.bookingCard}>
        {/* Header */}
        <View style={styles.bookingHeader}>
          <View style={styles.clientInfo}>
            <View style={styles.clientAvatar}>
              <Text style={styles.clientInitials}>
                {booking.clientName
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </Text>
            </View>
            <View style={styles.clientDetails}>
              <View style={styles.clientNameRow}>
                <Text style={styles.clientName}>{booking.clientName}</Text>
                {booking.isFirstTime && (
                  <View style={styles.newClientBadge}>
                    <Text style={styles.newClientText}>NEW</Text>
                  </View>
                )}
              </View>
              <Text style={styles.serviceName}>{booking.serviceName}</Text>
            </View>
          </View>

          <View style={[styles.statusBadge, { backgroundColor: statusStyle.backgroundColor }]}>
            <Ionicons name={statusIcon} size={12} color={statusStyle.color} />
            <Text style={[styles.statusText, { color: statusStyle.color }]}>
              {booking.status.replace('-', ' ').toUpperCase()}
            </Text>
          </View>
        </View>

        {/* Booking Details */}
        <View style={styles.bookingDetails}>
          <View style={styles.detailRow}>
            <Ionicons name="calendar" size={16} color="#6b7280" />
            <Text style={styles.detailText}>
              {formatDate(booking.startTime)} at {formatTime(booking.startTime)} -{' '}
              {formatTime(booking.endTime)}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Ionicons name="cash" size={16} color="#16a34a" />
            <Text style={[styles.detailText, { color: '#16a34a', fontWeight: '600' }]}>
              ${booking.price}
            </Text>
          </View>

          {booking.isMobileService && booking.address && (
            <View style={styles.detailRow}>
              <Ionicons name="location" size={16} color="#6b7280" />
              <Text style={styles.detailText}>
                {booking.address.street}, {booking.address.city}
              </Text>
            </View>
          )}

          {!booking.isMobileService && (
            <View style={styles.detailRow}>
              <Ionicons name="storefront" size={16} color="#6b7280" />
              <Text style={styles.detailText}>In-shop service</Text>
            </View>
          )}

          <View style={styles.detailRow}>
            <Ionicons name="call" size={16} color="#6b7280" />
            <Text style={styles.detailText}>{booking.clientPhone}</Text>
          </View>
        </View>

        {/* Notes */}
        {booking.notes && (
          <View style={styles.notesSection}>
            <Text style={styles.notesLabel}>Notes:</Text>
            <Text style={styles.notesText}>{booking.notes}</Text>
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <View style={styles.contactButtons}>
            <TouchableOpacity
              style={styles.contactButton}
              onPress={() => handleCallClient(booking.clientPhone)}
            >
              <Ionicons name="call" size={18} color="#2563eb" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.contactButton}
              onPress={() => handleMessageClient(booking.clientPhone)}
            >
              <Ionicons name="chatbubble" size={18} color="#2563eb" />
            </TouchableOpacity>

            {booking.isMobileService && booking.address && (
              <TouchableOpacity
                style={styles.contactButton}
                onPress={() => handleGetDirections(booking.address)}
              >
                <Ionicons name="navigate" size={18} color="#2563eb" />
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.statusButtons}>
            {booking.status === 'new' && (
              <>
                <TouchableOpacity
                  style={styles.declineButton}
                  onPress={() => handleDeclineBooking(booking.id)}
                >
                  <Text style={styles.declineButtonText}>Decline</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.acceptButton}
                  onPress={() => handleAcceptBooking(booking.id)}
                >
                  <Text style={styles.acceptButtonText}>Accept</Text>
                </TouchableOpacity>
              </>
            )}

            {booking.status === 'confirmed' && (
              <TouchableOpacity
                style={styles.startButton}
                onPress={() => handleStartService(booking.id)}
              >
                <Text style={styles.startButtonText}>Start Service</Text>
              </TouchableOpacity>
            )}

            {booking.status === 'in-progress' && (
              <TouchableOpacity
                style={styles.completeButton}
                onPress={() => handleCompleteService(booking.id)}
              >
                <Text style={styles.completeButtonText}>Mark Complete</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    );
  };

  const tabCounts = getTabCounts();

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      {/* <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#6b7280" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Bookings</Text>

          <TouchableOpacity style={styles.filterButton} onPress={() => console.log('Open filters')}>
            <Ionicons name="filter" size={24} color="#6b7280" />
          </TouchableOpacity>
        </View>
      </View> */}

      {/* Status Tabs */}
      <View style={styles.tabsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsScroll}>
          {tabCounts.map((tab) => (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tab, selectedTab === tab.key && styles.activeTab]}
              onPress={() => setSelectedTab(tab.key)}
            >
              <Text style={[styles.tabText, selectedTab === tab.key && styles.activeTabText]}>
                {tab.label}
              </Text>
              {tab.count > 0 && (
                <View style={[styles.tabBadge, selectedTab === tab.key && styles.activeTabBadge]}>
                  <Text
                    style={[
                      styles.tabBadgeText,
                      selectedTab === tab.key && styles.activeTabBadgeText,
                    ]}
                  >
                    {tab.count}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Bookings List */}
      <ScrollView
        style={styles.bookingsList}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={styles.bookingsContent}>
          {filteredBookings.length > 0 ? (
            filteredBookings.map(renderBookingCard)
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="calendar-outline" size={64} color="#d1d5db" />
              <Text style={styles.emptyStateTitle}>No bookings found</Text>
              <Text style={styles.emptyStateText}>
                {selectedTab === 'all'
                  ? "You don't have any bookings yet."
                  : `No ${selectedTab} bookings at the moment.`}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  filterButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
  },
  tabsContainer: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    paddingBottom: 8,
    borderBottomColor: '#e5e7eb',
  },
  tabsScroll: {
    paddingHorizontal: 24,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
  },
  activeTab: {
    backgroundColor: '#dc2626',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },
  activeTabText: {
    color: '#ffffff',
  },
  tabBadge: {
    marginLeft: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    backgroundColor: '#e5e7eb',
  },
  activeTabBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  tabBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#374151',
  },
  activeTabBadgeText: {
    color: '#ffffff',
  },
  bookingsList: {
    flex: 1,
  },
  bookingsContent: {
    padding: 24,
  },
  bookingCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  clientInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  clientAvatar: {
    width: 48,
    height: 48,
    backgroundColor: '#fef2f2',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  clientInitials: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#dc2626',
  },
  clientDetails: {
    flex: 1,
  },
  clientNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  clientName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  newClientBadge: {
    marginLeft: 8,
    backgroundColor: '#dbeafe',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  newClientText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#1e40af',
  },
  serviceName: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  bookingDetails: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#374151',
    marginLeft: 8,
    flex: 1,
  },
  notesSection: {
    backgroundColor: '#f9fafb',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  notesLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 4,
  },
  notesText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  contactButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  contactButton: {
    width: 40,
    height: 40,
    backgroundColor: '#eff6ff',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  acceptButton: {
    backgroundColor: '#dc2626',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  acceptButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
  },
  declineButton: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  declineButtonText: {
    color: '#6b7280',
    fontWeight: '600',
    fontSize: 14,
  },
  startButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  startButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
  },
  completeButton: {
    backgroundColor: '#16a34a',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  completeButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 64,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#374151',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
  },
});
