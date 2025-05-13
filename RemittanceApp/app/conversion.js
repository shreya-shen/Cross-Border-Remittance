import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { TextInput, Button, Title, Text, Card, Switch, ActivityIndicator } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Formik } from 'formik';
import * as Yup from 'yup';

import CurrencyInput from '../components/CurrencyInput';

const conversionSchema = Yup.object().shape({
  amount: Yup.number()
    .required('Amount is required')
    .positive('Amount must be positive')
    .typeError('Amount must be a number'),
});

const ConversionScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [converting, setConverting] = useState(false);
  const [exchangeRate, setExchangeRate] = useState(1);
  const [isSendingToOthers, setIsSendingToOthers] = useState(false);
  const [walletData, setWalletData] = useState({
    usdBalance: 0,
    usdcBalance: 0,
  });
  
  useEffect(() => {
    fetchWalletData();
  }, []);
  
  const fetchWalletData = () => {
    // API call to get wallet data and exchange rate
    setTimeout(() => {
      setWalletData({
        usdBalance: 1250.75,
        usdcBalance: 850.50,
      });
      setExchangeRate(1.01); // $1 USD = $1.01 USDC
      setLoading(false);
    }, 1500);
  };
  
  const handleConvert = (values) => {
    // check if user has enough balance
    if (values.amount > walletData.usdBalance) {
      Alert.alert('Insufficient Balance', 'You do not have enough USD for this conversion');
      return;
    }
    
    setConverting(true);
    
    // sim conversion process
    setTimeout(() => {
      setConverting(false);
      
      if (isSendingToOthers) {
        // recipient selection screen
        navigation.navigate('Recipient', {
          amount: values.amount,
          convertedAmount: (values.amount * exchangeRate).toFixed(2),
          fromCurrency: 'USD',
          toCurrency: 'USDC',
        });
      } else {
        // success alert for self-conversion
        Alert.alert(
          'Conversion Successful',
          `You have successfully converted $${values.amount} USD to $${(values.amount * exchangeRate).toFixed(2)} USDC`,
          [{ text: 'OK', onPress: () => navigation.navigate('Wallet') }]
        );
      }
    }, 2000);
  };
  
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200ee" />
        <Text style={styles.loadingText}>Loading wallet data...</Text>
      </View>
    );
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Title style={styles.title}>Convert USD to USDC</Title>
        
        <Card style={styles.balanceCard}>
          <Card.Content>
            <Text style={styles.balanceLabel}>Your Balances</Text>
            <View style={styles.balanceRow}>
              <View style={styles.balanceItem}>
                <Text style={styles.balanceAmount}>${walletData.usdBalance.toFixed(2)}</Text>
                <Text style={styles.balanceCurrency}>USD</Text>
              </View>
              <View style={styles.balanceItem}>
                <Text style={styles.balanceAmount}>${walletData.usdcBalance.toFixed(2)}</Text>
                <Text style={styles.balanceCurrency}>USDC</Text>
              </View>
            </View>
          </Card.Content>
        </Card>
        
        <Formik
          initialValues={{ amount: '' }}
          validationSchema={conversionSchema}
          onSubmit={handleConvert}
        >
          {({ handleChange, handleSubmit, values, errors, touched, setFieldValue }) => (
            <View style={styles.form}>
              <Text style={styles.label}>Amount to Convert (USD)</Text>
              <CurrencyInput
                value={values.amount}
                onChangeText={(value) => setFieldValue('amount', value)}
                style={styles.input}
                error={touched.amount && errors.amount}
              />
              {touched.amount && errors.amount && (
                <Text style={styles.errorText}>{errors.amount}</Text>
              )}
              
              {values.amount ? (
                <View style={styles.previewContainer}>
                  <Text style={styles.previewLabel}>You will receive</Text>
                  <Text style={styles.previewAmount}>
                    ${(parseFloat(values.amount || 0) * exchangeRate).toFixed(2)} USDC
                  </Text>
                  <Text style={styles.exchangeRate}>
                    Exchange Rate: 1 USD = {exchangeRate.toFixed(2)} USDC
                  </Text>
                </View>
              ) : null}
              
              <View style={styles.switchContainer}>
                <Text>Send to someone else</Text>
                <Switch
                  value={isSendingToOthers}
                  onValueChange={setIsSendingToOthers}
                />
              </View>
              
              <Button 
                mode="contained" 
                onPress={handleSubmit}
                style={styles.button}
                loading={converting}
                disabled={converting || !values.amount}
              >
                {isSendingToOthers ? 'Next' : 'Convert'}
              </Button>
            </View>
          )}
        </Formik>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
  },
  title: {
    fontSize: 24,
    marginTop: 16,
    marginBottom: 16,
    textAlign: 'center',
  },
  balanceCard: {
    margin: 16,
    marginTop: 0,
    elevation: 4,
  },
  balanceLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  balanceItem: {
    alignItems: 'center',
  },
  balanceAmount: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  balanceCurrency: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  form: {
    padding: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    marginBottom: 8,
  },
  errorText: {
    color: '#B00020',
    fontSize: 12,
    marginBottom: 16,
    marginLeft: 8,
  },
  previewContainer: {
    backgroundColor: '#E8F5E9',
    padding: 16,
    borderRadius: 8,
    marginVertical: 16,
  },
  previewLabel: {
    fontSize: 14,
    color: '#333',
  },
  previewAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginVertical: 8,
  },
  exchangeRate: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 16,
  },
  button: {
    marginTop: 16,
    marginBottom: 16,
  },
});

export default ConversionScreen;