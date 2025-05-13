import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text, Title, HelperText } from 'react-native-paper';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useSearchParams, useRouter } from 'expo-router';

const OtpSchema = Yup.object().shape({
  otp: Yup.string()
    .required('OTP is required')
    .matches(/^[0-9]+$/, 'OTP must be numeric')
    .length(6, 'OTP must be 6 digits'),
});

export default function OtpVerificationScreen() {
  const { email } = useSearchParams(); // ✅ gets ?email=abc@example.com
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(true);
  const [countdown, setCountdown] = useState(30);

  useEffect(() => {
    if (countdown > 0 && resendDisabled) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      setResendDisabled(false);
    }
  }, [countdown, resendDisabled]);

  const handleVerifyOtp = async (values) => {
    try {
      setLoading(true);
      console.log('Verifying OTP:', values.otp, 'for email:', email);
      await new Promise(resolve => setTimeout(resolve, 1000));
      router.push('/login'); // ✅ redirect using Expo Router
    } catch (error) {
      console.error('OTP verification error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      setResendDisabled(true);
      setCountdown(30);
      console.log('Resending OTP to:', email);
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error('Resend OTP error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Title style={styles.title}>Verify Your Email</Title>
      <Text style={styles.subtitle}>
        We've sent a 6-digit code to {email}
      </Text>

      <Formik
        initialValues={{ otp: '' }}
        validationSchema={OtpSchema}
        onSubmit={handleVerifyOtp}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <View style={styles.formContainer}>
            <TextInput
              label="OTP Code"
              value={values.otp}
              onChangeText={handleChange('otp')}
              onBlur={handleBlur('otp')}
              error={touched.otp && errors.otp ? true : false}
              style={styles.input}
              mode="outlined"
              keyboardType="number-pad"
              maxLength={6}
            />
            {touched.otp && errors.otp && (
              <HelperText type="error">{errors.otp}</HelperText>
            )}
            <Button
              mode="contained"
              onPress={handleSubmit}
              loading={loading}
              disabled={loading}
              style={styles.button}
            >
              Verify
            </Button>
          </View>
        )}
      </Formik>

      <View style={styles.resendContainer}>
        <Text>Didn't receive the code?</Text>
        <Button
          mode="text"
          onPress={handleResendOtp}
          disabled={resendDisabled}
          style={styles.resendButton}
        >
          {resendDisabled ? `Resend in ${countdown}s` : 'Resend OTP'}
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginTop: 20, textAlign: 'center' },
  subtitle: { fontSize: 16, color: 'gray', marginTop: 10, textAlign: 'center', marginBottom: 30 },
  formContainer: { marginBottom: 20 },
  input: { marginBottom: 10, fontSize: 18, letterSpacing: 5 },
  button: { marginTop: 15, paddingVertical: 8 },
  resendContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  resendButton: { marginLeft: 5 },
});