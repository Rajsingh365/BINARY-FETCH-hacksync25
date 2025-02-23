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

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address.');
      return;
    }

    // Log the form data (you can send it to a server instead)
    console.log({
      email,
      password,
    });

    Alert.alert('Success', 'Login successful!');
    // Reset the form
    setEmail('');
    setPassword('');
  };

  return (
    <>
      {/* Status Bar */}
      <StatusBar
        barStyle="dark-content" 
        backgroundColor="#FBFFE4" 
        translucent={false} 
      />

      {/* SafeAreaView and Gradient Background */}
      <SafeAreaView style={{ flex: 1 }}>
        <LinearGradient
          colors={['#FBFFE4', '#B3D8A8', '#A3D1C6']} // Your color palette
          style={styles.container}
        >
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <Text style={styles.title}>Login</Text>

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

            {/* Login Button */}
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>

            {/* Sign-Up Link */}
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
  signupLinkContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  signupText: {
    fontSize: 16,
    color: '#3D8D7A', // Dark teal for text
  },
  signupButton: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3D8D7A', // Dark teal for the sign-up link
    marginLeft: 5,
  },
});

export default Login;