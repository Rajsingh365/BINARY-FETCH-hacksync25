import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useGlobal } from "@/context/GlobalProvider";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { authuser, setAuthuser } = useGlobal();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address.');
      return;
    }

    const res = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_URI}/api/listener/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });
    const data = await res.json();
    setAuthuser(data);
    router.push('/home');
  };

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFBF5" translucent={false} />

      <SafeAreaView style={{ flex: 1 }}>
        <LinearGradient
          colors={['#FFFBF5', '#F7EFE5', '#C3ACD0']}
          style={styles.container}
        >
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <Text style={styles.title}>Login</Text>

            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#C3ACD0"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />

            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#C3ACD0"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            <TouchableOpacity style={styles.button} onPress={handleLogin}>
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>

            <View style={styles.signupLinkContainer}>
              <Text style={styles.signupText}>Don't have an account?</Text>
              <TouchableOpacity onPress={() => router.push('/')}>
                <Text style={styles.signupButton}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </LinearGradient>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#7743DB', // Title with primary purple
    marginBottom: 30,
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#C3ACD0', // Light purple border
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
    backgroundColor: '#FFFBF5', // Light cream background
    color: '#7743DB', // Input text color
  },
  button: {
    width: '100%',
    backgroundColor: '#7743DB', // Deep purple button
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFBF5', // Light text on button
  },
  signupLinkContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  signupText: {
    fontSize: 16,
    color: '#7743DB', // Primary purple for text
  },
  signupButton: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#C3ACD0', // Light purple for the link
    marginLeft: 5,
  },
});

export default Login;
