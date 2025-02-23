import React, { useState } from 'react';
import { StatusBar } from 'react-native';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from "expo-router";
import { useGlobal } from "@/context/GlobalProvider";

const index = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [preferences, setPreferences] = useState('');
  const {authuser, setAuthuser} = useGlobal();


  const handleSignUp = async() => {
    if (!name || !email || !password || !preferences) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address.');
      return;
    }

    // Split preferences into an array
    const preferencesArray = (preferences || '').split(',').map((pref) => pref.trim());

    // Log the form data (you can send it to a server instead)
    console.log({
      name,
      email,
      password,
      preferences: preferencesArray,
    });

    const res = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_URI}/api/listener/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        email,
        password,
        preferences: preferencesArray,
      }),
    });
    const data = await res.json();
    console.log(data);
    setAuthuser(data);
    router.push('/home');
  };

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <LinearGradient
        colors={['#FBFFE4', '#B3D8A8', '#A3D1C6']} // Your color palette
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.title}>Sign Up</Text>

          {/* Name Input */}
          <TextInput
            style={styles.input}
            placeholder="Name"
            value={name}
            onChangeText={setName}
          />

          {/* Email Input */}
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />

          {/* Password Input */}
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          {/* Preferences Input */}
          <TextInput
            style={styles.input}
            placeholder="Preferences (comma-separated)"
            value={preferences}
            onChangeText={setPreferences}
          />

          {/* Sign Up Button */}
          <TouchableOpacity style={styles.button} onPress={handleSignUp}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>

          {/* Login Link */}
          <View style={styles.loginLinkContainer}>
            <Text style={styles.loginText}>Already have an account?</Text>
            <TouchableOpacity onPress={() => router.push('/home')}>
              <Text style={styles.loginButton}>Login</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </LinearGradient>
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
    color: '#3D8D7A', // Dark teal for the title
    marginBottom: 30,
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#B3D8A8', // Light green border
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
    backgroundColor: '#FBFFE4', // Light cream background
  },
  button: {
    width: '100%',
    backgroundColor: '#3D8D7A', // Dark teal for the button
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FBFFE4', // Light cream text on the button
  },
  loginLinkContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  loginText: {
    fontSize: 16,
    color: '#3D8D7A', // Dark teal for text
  },
  loginButton: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3D8D7A', // Dark teal for the login link
    marginLeft: 5,
  },
});

export default index;