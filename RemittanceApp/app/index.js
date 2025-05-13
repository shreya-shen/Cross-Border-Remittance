import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Link } from 'expo-router';
import { Button } from 'react-native-paper';

const screens = [
  { title: 'Login', path: '/login' },
  { title: 'Register', path: '/register' },
  { title: 'OTP Verification', path: '/otp-verification' },
  { title: 'KYC', path: '/kyc' },
  { title: 'Recipient', path: '/recipient' },
  { title: 'Conversion', path: '/conversion' },
  { title: 'Confirmation', path: '/confirmation' },
  { title: 'Wallet', path: '/wallet' },
  { title: 'Transaction History', path: '/transaction-history' },
];

export default function Home() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Remittance App</Text>
      {screens.map((screen, idx) => (
        <Link href={screen.path} asChild key={idx}>
          <Button mode="contained" style={styles.button}>
            {screen.title}
          </Button>
        </Link>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  button: {
    marginVertical: 10,
    width: '100%',
  },
});