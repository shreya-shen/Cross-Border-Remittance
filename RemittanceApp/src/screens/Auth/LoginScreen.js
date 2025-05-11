import React, { useState } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { TextInput, Button, Text, Headline, HelperText } from 'react-native-paper';
import { Formik } from 'formik';
import * as Yup from 'yup';

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
});

export default function LoginScreen({ navigation }) {
  const [loading, setLoading] = useState(false);

  const handleLogin = async (values) => {
    try {
      setLoading(true);
      // Here you would normally call your API
      console.log('Login attempt with:', values);
      
      // For demo: simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Navigate to OTP verification
      navigation.navigate('OtpVerification', { email: values.email });
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        {/* You can replace with your app logo */}
        <Headline style={styles.title}>Global Remit</Headline>
        <Text style={styles.subtitle}>Blockchain Remittance</Text>
      </View>

      <Formik
        initialValues={{ email: '' }}
        validationSchema={LoginSchema}
        onSubmit={handleLogin}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <View style={styles.formContainer}>
            <TextInput
              label="Email"
              value={values.email}
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              error={touched.email && errors.email ? true : false}
              style={styles.input}
              mode="outlined"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {touched.email && errors.email && (
              <HelperText type="error">{errors.email}</HelperText>
            )}

            <Button
              mode="contained"
              onPress={handleSubmit}
              loading={loading}
              disabled={loading}
              style={styles.button}
            >
              Send OTP
            </Button>
          </View>
        )}
      </Formik>

      <View style={styles.footer}>
        <Text>Don't have an account?</Text>
        <Button 
          mode="text" 
          onPress={() => navigation.navigate('Register')}
          style={styles.registerButton}
        >
          Sign Up
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2563EB',
  },
  subtitle: {
    fontSize: 16,
    color: 'gray',
    marginTop: 5,
  },
  formContainer: {
    marginBottom: 20,
  },
  input: {
    marginBottom: 10,
  },
  button: {
    marginTop: 15,
    paddingVertical: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerButton: {
    marginLeft: 5,
  },
});