'use client';

import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Key } from 'lucide-react-native';
import { useAtom } from 'jotai';
import { userAtom } from '@/store/userAtom';

export default function Profile() {
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [phone, setPhone] = useState<number>(0);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const router = useRouter();
  // user jotai atom
  const [jotaiUser, setJotaiUser] = useAtom(userAtom);

  // checks if fields are not empty and continue button is enabled
  const areFieldsValid = () => {
    return firstName.trim() !== '' && lastName.trim() !== '' && address.trim() !== '';
  };

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert('Permission Required', 'Permission to access camera roll is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const handleContinue = () => {
    if (firstName.trim() && lastName.trim() && address.trim()) {
      setJotaiUser((prev) => ({
        ...prev!,
        firstName,
        lastName,
        address,
        phone,
        profileImage: profileImage ?? undefined,
      }));
      router.push('/common/complete');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color="#64748b" />
            </TouchableOpacity>
            <Text style={styles.title}>Set up your profile</Text>
          </View>

          <ScrollView>
            <View style={styles.form}>
              <View style={styles.imageSection}>
                <TouchableOpacity style={styles.imageContainer} onPress={pickImage}>
                  {profileImage ? (
                    <Image source={{ uri: profileImage }} style={styles.profileImage} />
                  ) : (
                    <View style={styles.placeholderImage}>
                      <Ionicons name="camera" size={32} color="#94a3b8" />
                    </View>
                  )}
                  <View style={styles.cameraIcon}>
                    <Ionicons name="camera" size={16} color="#fff" />
                  </View>
                </TouchableOpacity>
                <Text style={styles.imageLabel}>Add profile photo</Text>
              </View>

              <View style={styles.inputSection}>
                <Text style={styles.inputLabel}>First Name</Text>
                <TextInput
                  style={styles.textInput}
                  value={firstName}
                  onChangeText={setFirstName}
                  placeholder={`Enter your first name`}
                  placeholderTextColor="#94a3b8"
                />
              </View>

              <View style={styles.inputSection}>
                <Text style={styles.inputLabel}>Last Name</Text>
                <TextInput
                  style={styles.textInput}
                  value={lastName}
                  onChangeText={setLastName}
                  placeholder={`Enter your last name`}
                  placeholderTextColor="#94a3b8"
                />
              </View>

              <View style={styles.inputSection}>
                <Text style={styles.inputLabel}>Address</Text>
                <TextInput
                  style={styles.textInput}
                  value={address}
                  onChangeText={setAddress}
                  placeholder={`Enter your address`}
                  placeholderTextColor="#94a3b8"
                />
              </View>

              <View style={styles.inputSection}>
                <Text style={styles.inputLabel}>Phone number</Text>
                <TextInput
                  style={styles.textInput}
                  value={phone ? phone.toString() : ''}
                  keyboardType="phone-pad"
                  onChangeText={(text) => setPhone(Number(text))}
                  placeholder={`Enter your phone number`}
                  placeholderTextColor="#94a3b8"
                />
              </View>
            </View>
          </ScrollView>
          <TouchableOpacity
            style={[styles.continueButton, !areFieldsValid() && styles.disabledButton]}
            onPress={handleContinue}
            disabled={!areFieldsValid()}
          >
            <Text
              style={[styles.continueButtonText, !areFieldsValid() && styles.disabledButtonText]}
            >
              Continue
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    flex: 1,
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
    marginTop: 20,
  },
  backButton: {
    position: 'absolute',
    left: 0,
    top: 0,
    padding: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
  },
  form: {
    flex: 1,
  },
  imageSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  placeholderImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#e2e8f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#cc001e',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  imageLabel: {
    fontSize: 14,
    color: '#64748b',
  },
  inputSection: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    fontSize: 16,
    color: '#1e293b',
  },
  continueButton: {
    backgroundColor: '#cc001e',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 'auto',
  },
  disabledButton: {
    backgroundColor: '#cbd5e1',
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButtonText: {
    color: '#94a3b8',
  },
});
