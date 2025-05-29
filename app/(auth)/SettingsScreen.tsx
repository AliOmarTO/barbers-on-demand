import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { auth } from '@/firebaseConfig';

// Mock user data
const userData = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  phone: '+1 (555) 123-4567',
  avatar: 'https://randomuser.me/api/portraits/men/42.jpg',
};

const SettingsScreen = () => {
  const user = auth.currentUser;
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <Image source={{ uri: userData.avatar }} style={styles.profileImage} />
          <Text style={styles.profileName}>{userData.name}</Text>
        </View>

        {/* User Info Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Information</Text>

          <View style={styles.infoCard}>
            <View style={styles.infoItem}>
              <View style={styles.infoIconContainer}>
                <Ionicons name="person-outline" size={20} color="#555" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Full Name</Text>
                <Text style={styles.infoValue}>{userData.name}</Text>
              </View>
              <TouchableOpacity style={styles.editButton}>
                <Ionicons name="pencil-outline" size={20} color="#555" />
              </TouchableOpacity>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoItem}>
              <View style={styles.infoIconContainer}>
                <Ionicons name="mail-outline" size={20} color="#555" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Email</Text>
                <Text style={styles.infoValue}>{user?.email}</Text>
              </View>
              <TouchableOpacity style={styles.editButton}>
                <Ionicons name="pencil-outline" size={20} color="#555" />
              </TouchableOpacity>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoItem}>
              <View style={styles.infoIconContainer}>
                <Ionicons name="call-outline" size={20} color="#555" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Phone</Text>
                <Text style={styles.infoValue}>{userData.phone}</Text>
              </View>
              <TouchableOpacity style={styles.editButton}>
                <Ionicons name="pencil-outline" size={20} color="#555" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Additional Settings Sections */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>

          <TouchableOpacity style={styles.settingsItem}>
            <View style={styles.settingsItemLeft}>
              <View style={[styles.iconContainer, { backgroundColor: '#E8F5E9' }]}>
                <Ionicons name="notifications-outline" size={20} color="#43A047" />
              </View>
              <Text style={styles.settingsItemText}>Notifications</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#BDBDBD" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingsItem}>
            <View style={styles.settingsItemLeft}>
              <View style={[styles.iconContainer, { backgroundColor: '#E3F2FD' }]}>
                <Ionicons name="card-outline" size={20} color="#1E88E5" />
              </View>
              <Text style={styles.settingsItemText}>Payment Methods</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#BDBDBD" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingsItem}>
            <View style={styles.settingsItemLeft}>
              <View style={[styles.iconContainer, { backgroundColor: '#FFF3E0' }]}>
                <Ionicons name="time-outline" size={20} color="#FF9800" />
              </View>
              <Text style={styles.settingsItemText}>Booking History</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#BDBDBD" />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>

          <TouchableOpacity style={styles.settingsItem}>
            <View style={styles.settingsItemLeft}>
              <View style={[styles.iconContainer, { backgroundColor: '#F3E5F5' }]}>
                <Ionicons name="help-circle-outline" size={20} color="#8E24AA" />
              </View>
              <Text style={styles.settingsItemText}>Help Center</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#BDBDBD" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingsItem}>
            <View style={styles.settingsItemLeft}>
              <View style={[styles.iconContainer, { backgroundColor: '#E0F7FA' }]}>
                <Ionicons name="document-text-outline" size={20} color="#00ACC1" />
              </View>
              <Text style={styles.settingsItemText}>Terms & Privacy</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#BDBDBD" />
          </TouchableOpacity>
        </View>

        {/* Sign Out Button */}
        <View style={styles.signOutContainer}>
          <TouchableOpacity
            style={styles.signOutButton}
            onPress={() => auth.signOut()}
            activeOpacity={0.8}
          >
            <Ionicons name="log-out-outline" size={20} color="#FFF" style={styles.signOutIcon} />
            <Text style={styles.signOutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Version 0.0.1</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  profileName: {
    fontSize: 22,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  infoCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  infoIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: '#1A1A1A',
    fontWeight: '500',
  },
  editButton: {
    padding: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#EEEEEE',
    marginHorizontal: 16,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  settingsItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  settingsItemText: {
    fontSize: 16,
    color: '#1A1A1A',
    fontWeight: '500',
  },
  signOutContainer: {
    paddingHorizontal: 20,
    marginTop: 8,
    marginBottom: 16,
  },
  signOutButton: {
    backgroundColor: '#cc001e',
    borderRadius: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signOutIcon: {
    marginRight: 8,
  },
  signOutText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  versionContainer: {
    alignItems: 'center',
    paddingVertical: 16,
    marginBottom: 16,
  },
  versionText: {
    fontSize: 14,
    color: '#9E9E9E',
  },
});

export default SettingsScreen;
