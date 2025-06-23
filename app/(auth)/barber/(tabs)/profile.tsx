import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image,
  Alert,
  Switch,
  Linking,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAtom } from 'jotai';
import { barberAtom } from '@/store/createdBarberAtom';
import { ServiceType, VerificationStatus, AvailabilityStatus } from '@/models/Barber';
import { auth } from '@/firebaseConfig';
import { userAtom } from '@/store/userAtom';

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function BarberProfileScreen() {
  const [barber, setBarber] = useAtom(barberAtom);
  const [showAllServices, setShowAllServices] = useState(false);
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  const [jotaiUser, setJotaiUser] = useAtom(userAtom);

  const handleStatusChange = (newStatus: AvailabilityStatus) => {
    // const updatedBarber = { ...barber };
    // updatedBarber.updateStatus(newStatus);
    // setBarber(updatedBarber);
  };

  const handleNotificationToggle = (setting: keyof typeof barber.notificationSettings) => {
    const updatedBarber = { ...barber };
    updatedBarber.notificationSettings[setting] = !updatedBarber.notificationSettings[setting];
    updatedBarber.updatedAt = new Date();
    setBarber(updatedBarber);
  };

  const getStatusStyle = (status: AvailabilityStatus) => {
    switch (status) {
      case AvailabilityStatus.AVAILABLE:
        return styles.statusAvailable;
      case AvailabilityStatus.BUSY:
        return styles.statusBusy;
      case AvailabilityStatus.OFFLINE:
        return styles.statusOffline;
      default:
        return styles.statusDefault;
    }
  };

  const getVerificationColor = (status: VerificationStatus) => {
    switch (status) {
      case VerificationStatus.VERIFIED:
        return '#16a34a';
      case VerificationStatus.PENDING:
        return '#eab308';
      case VerificationStatus.REJECTED:
        return '#dc2626';
      default:
        return '#6b7280';
    }
  };

  const getServiceTypeText = () => {
    switch (barber.serviceType) {
      case ServiceType.MOBILE_ONLY:
        return 'Mobile Services Only';
      case ServiceType.SHOP:
        return 'In-Shop Services Only';
      case ServiceType.BOTH:
        return 'Both Mobile & In-Shop';
      default:
        return 'Not specified';
    }
  };

  const getAvailableDays = () => {
    return barber.weeklyAvailability
      .filter((day) => day.isAvailable)
      .map((day) => days[day.dayOfWeek])
      .join(', ');
  };

  const handleEditProfile = () => {};

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      setJotaiUser(null); // Clear user state
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };
  const handleEditServices = () => {};

  const handleEditAvailability = () => {};

  const handleViewAnalytics = () => {};

  const handleShareProfile = () => {
    Alert.alert('Share Profile', 'How would you like to share your profile?', [
      { text: 'Copy Link', onPress: () => console.log('Copy link') },
      { text: 'Social Media', onPress: () => console.log('Share on social') },
      { text: 'QR Code', onPress: () => console.log('Show QR code') },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const handleContactSupport = () => {
    // Alert.alert('Contact Support', 'How would you like to contact support?', [
    //   { text: 'Email', onPress: () => Linking.openURL('mailto:support@barberapp.com') },
    //   { text: 'Phone', onPress: () => Linking.openURL('tel:+1234567890') },
    //   { text: 'Live Chat', onPress: () => console.log('Open live chat') },
    //   { text: 'Cancel', style: 'cancel' },
    // ]);
  };

  const servicesToShow = showAllServices ? barber.services : barber.services.slice(0, 3);
  const photosToShow = showAllPhotos
    ? barber.profile.portfolioImages
    : barber.profile.portfolioImages.slice(0, 6);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#6b7280" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>My Profile</Text>

          <TouchableOpacity onPress={handleEditProfile} style={styles.editButton}>
            <Ionicons name="create" size={24} color="#dc2626" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Profile Header */}
          <View style={styles.profileCard}>
            <View style={styles.profileHeader}>
              <View style={styles.profileImageContainer}>
                <View style={styles.profileImageWrapper}>
                  {barber.profileImage ? (
                    <Image
                      source={{ uri: barber.profileImage }}
                      style={styles.profileImage}
                      resizeMode="cover"
                    />
                  ) : (
                    <Text style={styles.profileInitials}>
                      {barber.firstName[0]}
                      {barber.lastName[0]}
                    </Text>
                  )}
                </View>

                {/* Status Indicator */}
                <View style={[styles.statusBadge, getStatusStyle(barber.currentStatus)]}>
                  <Text style={styles.statusText}>{barber.currentStatus}</Text>
                </View>
              </View>

              <Text style={styles.profileName}>{barber.fullName}</Text>
              <Text style={styles.serviceType}>{getServiceTypeText()}</Text>

              {/* Rating */}
              <View style={styles.ratingContainer}>
                <View style={styles.ratingSection}>
                  <Ionicons name="star" size={20} color="#fbbf24" />
                  <Text style={styles.ratingValue}>{barber.averageRating.toFixed(1)}</Text>
                  <Text style={styles.reviewCount}>({barber.totalReviews} reviews)</Text>
                </View>

                {/* Verification Badge */}
                <View style={styles.verificationContainer}>
                  <Ionicons
                    name={barber.isFullyVerified ? 'checkmark-circle' : 'time'}
                    size={16}
                    color={barber.isFullyVerified ? '#16a34a' : '#eab308'}
                  />
                  <Text
                    style={[
                      styles.verificationText,
                      { color: getVerificationColor(barber.verificationStatus) },
                    ]}
                  >
                    {barber.isFullyVerified ? 'Verified' : 'Pending'}
                  </Text>
                </View>
              </View>

              {/* Quick Stats */}
              <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{barber.services.length}</Text>
                  <Text style={styles.statLabel}>Services</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{barber.profile.yearsExperience}</Text>
                  <Text style={styles.statLabel}>Years Exp.</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>${barber.totalEarnings.toLocaleString()}</Text>
                  <Text style={styles.statLabel}>Total Earned</Text>
                </View>
              </View>
            </View>

            {/* Status Controls */}
            <View style={styles.statusControls}>
              <Text style={styles.sectionTitle}>Current Status</Text>
              <View style={styles.statusButtons}>
                {Object.values(AvailabilityStatus).map((status) => (
                  <TouchableOpacity
                    key={status}
                    style={[
                      styles.statusButton,
                      barber.currentStatus === status
                        ? styles.statusButtonActive
                        : styles.statusButtonInactive,
                    ]}
                    onPress={() => handleStatusChange(status)}
                  >
                    <Text
                      style={[
                        styles.statusButtonText,
                        barber.currentStatus === status
                          ? styles.statusButtonTextActive
                          : styles.statusButtonTextInactive,
                      ]}
                    >
                      {status}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          {/* Bio Section */}
          {barber.profile.bio && (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>About Me</Text>
                <TouchableOpacity onPress={handleEditProfile}>
                  <Ionicons name="create-outline" size={20} color="#6b7280" />
                </TouchableOpacity>
              </View>
              <Text style={styles.bioText}>{barber.profile.bio}</Text>
            </View>
          )}

          {/* Specialties */}
          {barber.profile.specialties.length > 0 && (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Specialties</Text>
              <View style={styles.specialtiesContainer}>
                {barber.profile.specialties.map((specialty, index) => (
                  <View key={index} style={styles.specialtyTag}>
                    <Text style={styles.specialtyText}>{specialty}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Services */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Services</Text>
              <TouchableOpacity onPress={handleEditServices}>
                <Ionicons name="create-outline" size={20} color="#6b7280" />
              </TouchableOpacity>
            </View>

            <View style={styles.servicesList}>
              {servicesToShow.map((service, index) => (
                <View
                  key={service.id}
                  style={[
                    styles.serviceItem,
                    index < servicesToShow.length - 1 && styles.serviceItemBorder,
                  ]}
                >
                  <View style={styles.serviceInfo}>
                    <Text style={styles.serviceName}>{service.name}</Text>
                    <Text style={styles.serviceDuration}>{service.duration} min</Text>
                    {service.description && (
                      <Text style={styles.serviceDescription}>{service.description}</Text>
                    )}
                  </View>
                  <View style={styles.servicePricing}>
                    <Text style={styles.servicePrice}>${service.price}</Text>
                    {service.mobilePrice && service.mobilePrice !== service.price && (
                      <Text style={styles.serviceMobilePrice}>${service.mobilePrice} mobile</Text>
                    )}
                  </View>
                </View>
              ))}
            </View>

            {barber.services.length > 3 && (
              <TouchableOpacity
                style={styles.showMoreButton}
                onPress={() => setShowAllServices(!showAllServices)}
              >
                <Text style={styles.showMoreText}>
                  {showAllServices ? 'Show Less' : `Show All ${barber.services.length} Services`}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Availability */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Availability</Text>
              <TouchableOpacity onPress={handleEditAvailability}>
                <Ionicons name="create-outline" size={20} color="#6b7280" />
              </TouchableOpacity>
            </View>

            <View style={styles.availabilityInfo}>
              <View style={styles.availabilityItem}>
                <Ionicons name="calendar" size={16} color="#6b7280" />
                <Text style={styles.availabilityText}>Available: {getAvailableDays()}</Text>
              </View>

              {barber.bufferTimeBetweenAppointments > 0 && (
                <View style={styles.availabilityItem}>
                  <Ionicons name="time" size={16} color="#6b7280" />
                  <Text style={styles.availabilityText}>
                    Buffer time: {barber.bufferTimeBetweenAppointments} minutes
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* Portfolio */}
          {barber.profile.portfolioImages.length > 0 && (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Portfolio</Text>
                <TouchableOpacity>
                  <Ionicons name="create-outline" size={20} color="#6b7280" />
                </TouchableOpacity>
              </View>

              <View style={styles.portfolioGrid}>
                {photosToShow.map((photo, index) => (
                  <TouchableOpacity key={index} style={styles.portfolioImage}>
                    <Image
                      source={{ uri: photo }}
                      style={styles.portfolioImageContent}
                      resizeMode="cover"
                    />
                  </TouchableOpacity>
                ))}
              </View>

              {barber.profile.portfolioImages.length > 6 && (
                <TouchableOpacity
                  style={styles.showMoreButton}
                  onPress={() => setShowAllPhotos(!showAllPhotos)}
                >
                  <Text style={styles.showMoreText}>
                    {showAllPhotos
                      ? 'Show Less'
                      : `View All ${barber.profile.portfolioImages.length} Photos`}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          {/* Business Information */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Business Information</Text>

            <View style={styles.businessInfo}>
              {barber.businessInfo.businessName && (
                <View style={styles.businessInfoItem}>
                  <Text style={styles.businessInfoLabel}>Business Name</Text>
                  <Text style={styles.businessInfoValue}>{barber.businessInfo.businessName}</Text>
                </View>
              )}

              {barber.businessInfo.licenseNumber && (
                <View style={styles.businessInfoItem}>
                  <Text style={styles.businessInfoLabel}>License Number</Text>
                  <Text style={styles.businessInfoValue}>{barber.businessInfo.licenseNumber}</Text>
                </View>
              )}

              <View style={styles.businessInfoItem}>
                <Text style={styles.businessInfoLabel}>Member Since</Text>
                <Text style={styles.businessInfoValue}>
                  {barber.createdAt.toLocaleDateString()}
                </Text>
              </View>

              <View style={styles.businessInfoItem}>
                <Text style={styles.businessInfoLabel}>Profile Status</Text>
                <Text
                  style={[
                    styles.businessInfoValue,
                    { color: barber.canAcceptBookings ? '#16a34a' : '#eab308' },
                  ]}
                >
                  {barber.canAcceptBookings ? 'Active' : 'Setup Required'}
                </Text>
              </View>
            </View>
          </View>

          {/* Notification Settings */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Notification Settings</Text>

            <View style={styles.notificationSettings}>
              <View style={styles.notificationItem}>
                <View style={styles.notificationInfo}>
                  <Text style={styles.notificationTitle}>New Bookings</Text>
                  <Text style={styles.notificationDescription}>
                    Get notified of new appointment requests
                  </Text>
                </View>
                <Switch
                  value={barber.notificationSettings.newBookings}
                  onValueChange={() => handleNotificationToggle('newBookings')}
                  trackColor={{ false: '#e5e7eb', true: '#FFD6D1' }}
                  thumbColor={barber.notificationSettings.newBookings ? '#cc001e' : '#f3f4f6'}
                />
              </View>

              <View style={styles.notificationItem}>
                <View style={styles.notificationInfo}>
                  <Text style={styles.notificationTitle}>Cancellations</Text>
                  <Text style={styles.notificationDescription}>
                    Get notified when appointments are cancelled
                  </Text>
                </View>
                <Switch
                  value={barber.notificationSettings.cancellations}
                  onValueChange={() => handleNotificationToggle('cancellations')}
                  trackColor={{ false: '#e5e7eb', true: '#FFD6D1' }}
                  thumbColor={barber.notificationSettings.cancellations ? '#cc001e' : '#f3f4f6'}
                />
              </View>

              <View style={styles.notificationItem}>
                <View style={styles.notificationInfo}>
                  <Text style={styles.notificationTitle}>Reminders</Text>
                  <Text style={styles.notificationDescription}>Get appointment reminders</Text>
                </View>
                <Switch
                  value={barber.notificationSettings.reminders}
                  onValueChange={() => handleNotificationToggle('reminders')}
                  trackColor={{ false: '#e5e7eb', true: '#FFD6D1' }}
                  thumbColor={barber.notificationSettings.reminders ? '#cc001e' : '#f3f4f6'}
                />
              </View>
            </View>
          </View>

          {/* Quick Actions */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Quick Actions</Text>

            <View style={styles.quickActions}>
              <TouchableOpacity
                style={[styles.quickActionItem, styles.quickActionBorder]}
                onPress={handleViewAnalytics}
              >
                <View style={styles.quickActionLeft}>
                  <View style={[styles.quickActionIcon, { backgroundColor: '#dbeafe' }]}>
                    <Ionicons name="analytics" size={20} color="#2563eb" />
                  </View>
                  <Text style={styles.quickActionText}>View Analytics</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#6b7280" />
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.quickActionItem, styles.quickActionBorder]}
                onPress={handleShareProfile}
              >
                <View style={styles.quickActionLeft}>
                  <View style={[styles.quickActionIcon, { backgroundColor: '#dcfce7' }]}>
                    <Ionicons name="share" size={20} color="#16a34a" />
                  </View>
                  <Text style={styles.quickActionText}>Share Profile</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#6b7280" />
              </TouchableOpacity>

              <TouchableOpacity style={[styles.quickActionItem, styles.quickActionBorder]}>
                <View style={styles.quickActionLeft}>
                  <View style={[styles.quickActionIcon, { backgroundColor: '#fef3c7' }]}>
                    <Ionicons name="card" size={20} color="#eab308" />
                  </View>
                  <Text style={styles.quickActionText}>Payment Settings</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#6b7280" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.quickActionItem} onPress={handleContactSupport}>
                <View style={styles.quickActionLeft}>
                  <View style={[styles.quickActionIcon, { backgroundColor: '#e9d5ff' }]}>
                    <Ionicons name="help-circle" size={20} color="#7c3aed" />
                  </View>
                  <Text style={styles.quickActionText}>Contact Support</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#6b7280" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Account Actions */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Account</Text>

            <View style={styles.accountActions}>
              <TouchableOpacity style={[styles.accountActionItem, styles.accountActionBorder]}>
                <View style={styles.accountActionLeft}>
                  <Ionicons name="settings" size={20} color="#6b7280" />
                  <Text style={styles.accountActionText}>Account Settings</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#6b7280" />
              </TouchableOpacity>

              <TouchableOpacity style={[styles.accountActionItem, styles.accountActionBorder]}>
                <View style={styles.accountActionLeft}>
                  <Ionicons name="shield-checkmark" size={20} color="#6b7280" />
                  <Text style={styles.accountActionText}>Privacy Policy</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#6b7280" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.accountActionItem} onPress={handleSignOut}>
                <View style={styles.accountActionLeft}>
                  <Ionicons name="log-out" size={20} color="#dc2626" />
                  <Text style={[styles.accountActionText, { color: '#dc2626' }]}>Sign Out</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#6b7280" />
              </TouchableOpacity>
            </View>
          </View>
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
    paddingBottom: 8,
    backgroundColor: '#f9fafb',
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
  editButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: '#fef2f2',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
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
  profileCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
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
  profileHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  profileImageWrapper: {
    width: 96,
    height: 96,
    backgroundColor: '#fef2f2',
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileImage: {
    width: 96,
    height: 96,
    borderRadius: 48,
  },
  profileInitials: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#dc2626',
  },
  statusBadge: {
    position: 'relative',
    marginTop: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignItems: 'center',
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  statusAvailable: {
    backgroundColor: '#dcfce7',
  },
  statusBusy: {
    backgroundColor: '#fef3c7',
  },
  statusOffline: {
    backgroundColor: '#fecaca',
  },
  statusDefault: {
    backgroundColor: '#f3f4f6',
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  serviceType: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 16,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  ratingSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  ratingValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginLeft: 4,
  },
  reviewCount: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 4,
  },
  verificationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  verificationText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  statLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  statusControls: {
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
  },
  statusButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  statusButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
  },
  statusButtonActive: {
    borderColor: '#dc2626',
    backgroundColor: '#fef2f2',
  },
  statusButtonInactive: {
    borderColor: '#e5e7eb',
    backgroundColor: '#ffffff',
  },
  statusButtonText: {
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  statusButtonTextActive: {
    color: '#dc2626',
  },
  statusButtonTextInactive: {
    color: '#6b7280',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  bioText: {
    color: '#374151',
    lineHeight: 24,
  },
  specialtiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  specialtyTag: {
    backgroundColor: '#fef2f2',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  specialtyText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#991b1b',
  },
  servicesList: {
    gap: 12,
  },
  serviceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  serviceItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    fontWeight: '600',
    color: '#1f2937',
  },
  serviceDuration: {
    fontSize: 14,
    color: '#6b7280',
  },
  serviceDescription: {
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 4,
  },
  servicePricing: {
    alignItems: 'flex-end',
  },
  servicePrice: {
    fontWeight: 'bold',
    color: '#dc2626',
  },
  serviceMobilePrice: {
    fontSize: 14,
    color: '#9ca3af',
  },
  showMoreButton: {
    marginTop: 16,
    paddingVertical: 8,
    alignItems: 'center',
  },
  showMoreText: {
    color: '#dc2626',
    fontWeight: '600',
  },
  availabilityInfo: {
    gap: 12,
  },
  availabilityItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  availabilityText: {
    color: '#374151',
    marginLeft: 8,
  },
  portfolioGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  portfolioImage: {
    width: '30%',
    aspectRatio: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  portfolioImageContent: {
    width: '100%',
    height: '100%',
  },
  businessInfo: {
    gap: 12,
  },
  businessInfoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  businessInfoLabel: {
    color: '#6b7280',
  },
  businessInfoValue: {
    fontWeight: '600',
    color: '#1f2937',
  },
  notificationSettings: {
    gap: 16,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  notificationInfo: {
    flex: 1,
  },
  notificationTitle: {
    fontWeight: '600',
    color: '#1f2937',
  },
  notificationDescription: {
    fontSize: 14,
    color: '#6b7280',
  },
  quickActions: {
    gap: 12,
  },
  quickActionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  quickActionBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  quickActionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quickActionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  quickActionText: {
    fontWeight: '600',
    color: '#1f2937',
  },
  accountActions: {
    gap: 12,
  },
  accountActionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  accountActionBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  accountActionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  accountActionText: {
    fontWeight: '600',
    color: '#1f2937',
    marginLeft: 12,
  },
});
