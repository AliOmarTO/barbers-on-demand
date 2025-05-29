import { auth } from '@/firebaseConfig'; // Adjust the import path as necessary
import { MaterialIcons } from '@expo/vector-icons';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
export default function SettingsScreen() {
  const user = auth.currentUser;
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Name */}
        <View style={styles.row}>
          <MaterialIcons name="person" size={24} color="#555" />
          <Text style={styles.value}>John Doe</Text>
        </View>
        <View style={styles.separator} />

        {/* Email */}
        <View style={styles.row}>
          <MaterialIcons name="email" size={24} color="#555" />
          <Text style={styles.value}>{user?.email}</Text>
        </View>
        <View style={styles.separator} />

        {/* Phone */}
        <View style={styles.row}>
          <MaterialIcons name="phone" size={24} color="#555" />
          <Text style={styles.value}>+1 234 567 8900</Text>
        </View>
        <View style={styles.separator} />
      </ScrollView>

      <TouchableOpacity style={styles.signOutButton} onPress={() => auth.signOut()}>
        <Text style={styles.signOutButtonText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',

    paddingTop: 20,
  },
  scrollContent: {
    paddingBottom: 20,
    backgroundColor: '#EFEEEE', // subtle grey background
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    gap: 15,
  },
  value: {
    fontSize: 16,
    fontWeight: '500',
    color: '#222',
  },
  separator: {
    height: 1,
    backgroundColor: '#ddd',
  },
  signOutButton: {
    backgroundColor: '#E53E3E',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 20,
    marginHorizontal: 20,
  },
  signOutButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
});
