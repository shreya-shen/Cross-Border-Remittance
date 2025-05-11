import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, Text, Title, HelperText } from 'react-native-paper';
import { Formik } from 'formik';
import * as Yup from 'yup';

const RegisterSchema = Yup.object().shape({
  fullName: Yup.string().required('Full name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  phone: Yup.string()
    .matches(/^[0-9]+$/, 'Phone number must be numeric')
    .min(10, 'Phone number must be at least 10 digits')
    .required('Phone number is required'),
});

export default function RegisterScreen({ navigation }) {
  const [loading, setLoading] = useState(false);

  const handleRegister = async (values) => {
    try {
      setLoading(true);
      // Here you would call your API to register the user
      console.log('Register attempt with:', values);
      
      // For demo: simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Navigate to OTP verification after registration
      navigation.navigate('OtpVerification', { email: values.email });
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Title style={styles.title}>Create an Account</Title>
      <Text style={styles.subtitle}>
        Sign up to start sending money globally with blockchain
      </Text>

      <Formik
        initialValues={{ fullName: '', email: '', phone: '' }}
        validationSchema={RegisterSchema}
        onSubmit={handleRegister}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <View style={styles.formContainer}>
            <TextInput
              label="Full Name"
              value={values.fullName}
              onChangeText={handleChange('fullName')}
              onBlur={handleBlur('fullName')}
              error={touched.fullName && errors.fullName ? true : false}
              style={styles.input}
              mode="outlined"
            />
            {touched.fullName && errors.fullName && (
              <HelperText type="error">{errors.fullName}</HelperText>
            )}

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

            <TextInput
              label="Phone Number"
              value={values.phone}
              onChangeText={handleChange('phone')}
              onBlur={handleBlur('phone')}
              error={touched.phone && errors.phone ? true : false}
              style={styles.input}
              mode="outlined"
              keyboardType="phone-pad"
            />
            {touched.phone && errors.phone && (
              <HelperText type="error">{errors.phone}</HelperText>
            )}

            <Button
              mode="contained"
              onPress={handleSubmit}
              loading={loading}
              disabled={loading}
              style={styles.button}
            >
              Register
            </Button>
          </View>
        )}
      </Formik>

      <View style={styles.footer}>
        <Text>Already have an account?</Text>
        <Button 
          mode="text" 
          onPress={() => navigation.navigate('Login')}
          style={styles.loginButton}
        >
          Sign In
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: 'gray',
    marginTop: 10,
    textAlign: 'center',
    marginBottom: 30,
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
    marginBottom: 30,
  },
  loginButton: {
    marginLeft: 5,
  },
});