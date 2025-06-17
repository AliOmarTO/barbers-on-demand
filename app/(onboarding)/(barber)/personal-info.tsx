import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ScrollView,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useAtom } from 'jotai';
import { barberBasicInfoAtom, barberBusinessInfoAtom } from '@/store/createdBarberAtom';
import { useRouter } from 'expo-router';

export default function PersonalInfoScreen() {
  const router = useRouter();
  const [basicInfo, setBasicInfo] = useAtom(barberBasicInfoAtom);
  const [businessInfo, setBusinessInfo] = useAtom(barberBusinessInfoAtom);

  const [firstName, setFirstName] = useState(basicInfo.firstName);
  const [lastName, setLastName] = useState(basicInfo.lastName);
  const [phone, setPhone] = useState(basicInfo.phone);
  const [email, setEmail] = useState(basicInfo.email);
  const [professionalPhoto, setProfessionalPhoto] = useState(basicInfo.profileImage || '');
  const [certificationPhoto, setCertificationPhoto] = useState('');

  // Update local state when atoms change
  useEffect(() => {
    setFirstName(basicInfo.firstName);
    setLastName(basicInfo.lastName);
    setPhone(basicInfo.phone);
    setEmail(basicInfo.email);
    setProfessionalPhoto(basicInfo.profileImage || '');
  }, [basicInfo]);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string) => {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-$$$$]/g, ''));
  };

  const handleNext = () => {
    if (!firstName.trim() || !lastName.trim()) {
      Alert.alert('Error', 'Please fill in both first and last name');
      return;
    }

    if (!phone.trim() || !validatePhone(phone)) {
      Alert.alert('Error', 'Please enter a valid phone number');
      return;
    }

    // Update atoms with form data
    setBasicInfo({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      phone: phone.trim(),
      email: email.trim(),
      profileImage: professionalPhoto,
    });

    setBusinessInfo({
      ...businessInfo,
      licenseNumber: certificationPhoto, // Store license image URL temporarily
    });

    router.push('/(onboarding)/(barber)/service-type');
  };

  const requestPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please grant camera roll permissions to add photos.');
      return false;
    }
    return true;
  };

  const pickImage = async (type: 'professional' | 'certification') => {
    const hasPermission = await requestPermission();
    if (!hasPermission) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: type === 'professional' ? [1, 1] : [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      if (type === 'professional') {
        setProfessionalPhoto(result.assets[0].uri);
      } else {
        setCertificationPhoto(result.assets[0].uri);
      }
    }
  };

  const takePhoto = async (type: 'professional' | 'certification') => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please grant camera permissions to take photos.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: type === 'professional' ? [1, 1] : [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      if (type === 'professional') {
        setProfessionalPhoto(result.assets[0].uri);
      } else {
        setCertificationPhoto(result.assets[0].uri);
      }
    }
  };

  const showImageOptions = (type: 'professional' | 'certification') => {
    Alert.alert(
      `Add ${type === 'professional' ? 'Professional Photo' : 'Certification'}`,
      'Choose how you want to add the image',
      [
        { text: 'Camera', onPress: () => takePhoto(type) },
        { text: 'Photo Library', onPress: () => pickImage(type) },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const formatPhoneNumber = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return text;
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.content}>
            <View style={styles.header}>
              <Text style={styles.title}>Professional Information</Text>
              <Text style={styles.subtitle}>Let's set up your professional barber profile</Text>
            </View>

            <View style={styles.form}>
              {/* Name Fields */}
              <View style={styles.row}>
                <View style={[styles.inputGroup, styles.halfWidth]}>
                  <Text style={styles.label}>
                    First Name <Text style={styles.required}>*</Text>
                  </Text>
                  <TextInput
                    style={styles.input}
                    value={firstName}
                    onChangeText={setFirstName}
                    placeholder="Enter first name"
                    autoCapitalize="words"
                    autoCorrect={false}
                  />
                </View>

                <View style={[styles.inputGroup, styles.halfWidth]}>
                  <Text style={styles.label}>
                    Last Name <Text style={styles.required}>*</Text>
                  </Text>
                  <TextInput
                    style={styles.input}
                    value={lastName}
                    onChangeText={setLastName}
                    placeholder="Enter last name"
                    autoCapitalize="words"
                    autoCorrect={false}
                  />
                </View>
              </View>

              {/* Contact Information */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>
                  Phone Number <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  style={styles.input}
                  value={phone}
                  onChangeText={(text) => setPhone(formatPhoneNumber(text))}
                  placeholder="(555) 123-4567"
                  keyboardType="phone-pad"
                  maxLength={14}
                />
              </View>

              {/* Professional Photo */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Professional Photo</Text>
                <Text style={styles.helperText}>Upload a clear, professional headshot</Text>
                <TouchableOpacity
                  style={styles.photoUpload}
                  onPress={() => showImageOptions('professional')}
                >
                  {professionalPhoto ? (
                    <View style={styles.photoContainer}>
                      <Image source={{ uri: professionalPhoto }} style={styles.uploadedPhoto} />
                      <View style={styles.photoOverlay}>
                        <Ionicons name="camera" size={24} color="#fff" />
                        <Text style={styles.photoOverlayText}>Change Photo</Text>
                      </View>
                    </View>
                  ) : (
                    <View style={styles.photoPlaceholder}>
                      <View style={styles.photoIcon}>
                        <Ionicons name="person-add" size={32} color="#cc001e" />
                      </View>
                      <Text style={styles.photoPlaceholderText}>Add Professional Photo</Text>
                      <Text style={styles.photoSubtext}>Tap to upload or take photo</Text>
                    </View>
                  )}
                </TouchableOpacity>
              </View>

              {/* Certification/License */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Certification/License</Text>
                <Text style={styles.helperText}>Upload your barber license or certification</Text>
                <TouchableOpacity
                  style={styles.photoUpload}
                  onPress={() => showImageOptions('certification')}
                >
                  {certificationPhoto ? (
                    <View style={styles.photoContainer}>
                      <Image
                        source={{ uri: certificationPhoto }}
                        style={styles.uploadedCertification}
                      />
                      <View style={styles.photoOverlay}>
                        <Ionicons name="camera" size={24} color="#fff" />
                        <Text style={styles.photoOverlayText}>Change Document</Text>
                      </View>
                    </View>
                  ) : (
                    <View style={styles.photoPlaceholder}>
                      <View style={styles.photoIcon}>
                        <Ionicons name="document-text" size={32} color="#cc001e" />
                      </View>
                      <Text style={styles.photoPlaceholderText}>Add Certification</Text>
                      <Text style={styles.photoSubtext}>Upload license or certificate</Text>
                    </View>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <Text style={styles.nextButtonText}>Continue</Text>
            <Ionicons name="arrow-forward" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    lineHeight: 24,
  },
  form: {
    gap: 24,
  },
  row: {
    flexDirection: 'row',
    gap: 16,
  },
  inputGroup: {
    flex: 1,
  },
  halfWidth: {
    flex: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  required: {
    color: '#cc001e',
  },
  helperText: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  input: {
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    backgroundColor: '#ffffff',
    color: '#111827',
    fontWeight: '500',
  },
  photoUpload: {
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#ffffff',
  },
  photoContainer: {
    position: 'relative',
  },
  uploadedPhoto: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  uploadedCertification: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  photoOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0,
  },
  photoOverlayText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4,
  },
  photoPlaceholder: {
    paddingVertical: 40,
    paddingHorizontal: 24,
    alignItems: 'center',
    backgroundColor: '#f9fafb',
  },
  photoIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#fee2e2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  photoPlaceholderText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  photoSubtext: {
    fontSize: 14,
    color: '#6b7280',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    paddingVertical: 24,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  nextButton: {
    backgroundColor: '#cc001e',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#cc001e',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  nextButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
