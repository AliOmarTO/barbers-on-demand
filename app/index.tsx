import { CustomButton } from '@/components/CustomButton';
import { auth } from '@/firebaseConfig';
import '@/gesture-handler';
import '@/global.css';
import { FirebaseError } from 'firebase/app';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

import { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
export default function Index() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const signUp = async () => {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      const user = userCredential.user;
      console.log('User signed up:', user);
    } catch (e: any) {
      const err = e as FirebaseError;
      alert('Registration failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async () => {
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log('User signed in:', user);
    } catch (e: any) {
      const err = e as FirebaseError;
      alert('Login failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('@/assets/images/bodLogo.png')} // Update this path to your actual image location
        style={styles.logo}
        resizeMode="contain"
      />
      <KeyboardAvoidingView behavior="padding">
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder="Email"
        />

        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder="Password"
        />
        {loading ? (
          <ActivityIndicator size={'small'} style={{ margin: 28 }} />
        ) : (
          <View>
            <CustomButton onPress={signIn} title="Login" />
            <CustomButton onPress={signUp} title="Register" />
          </View>
        )}
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    flex: 1,
    justifyContent: 'center',
  },
  logo: {
    width: 300,
    height: 300,
    alignSelf: 'center',
    marginBottom: 24,
  },
  input: {
    marginVertical: 4,
    height: 50,
    borderWidth: 1,
    borderRadius: 4,
    padding: 10,
    backgroundColor: '#fff',
  },
});
