import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { View, StyleSheet, Image } from 'react-native';
import { TextInput, Button, Text, Headline, HelperText } from 'react-native-paper';
import { Formik } from 'formik';
import * as Yup from 'yup';

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
});

export default function LoginScreen() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (values) => {
    try {
      setLoading(true);
      console.log('Login attempt with:', values);

      await new Promise(resolve => setTimeout(resolve, 1000));

      // router.push instead of navigation.navigate
      router.push({ pathname: '/OtpVerification', params: { email: values.email } });
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* ... UI code unchanged ... */}
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
          onPress={() => router.push('/register')}
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