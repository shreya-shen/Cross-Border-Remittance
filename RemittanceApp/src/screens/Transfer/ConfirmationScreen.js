// src/screens/Transfer/ConfirmationScreen.js
import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Button, Title, Text, Card, Divider, ActivityIndicator } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const ConfirmationScreen = ({ route, navigation }) => {
  const { amount, convertedAmount, fromCurrency, toCurrency, recipient } = route.params;
  const [processing, setProcessing] = useState(false);
  
  const getFee = () => {
    // In a real app, this would be calculated based on amount, network congestion, etc.
    return (parseFloat(amount) * 0.01).toFixed(2); // 1% fee
  };
  
  const getTotal = () => {
    return parseFloat(amount).toFixed(2);
  };
  
  const handleConfirm = () => {
    setProcessing(true);
    
    // Simulate blockchain transaction
    setTimeout(() => {
      setProcessing(false);
      
      // Navigate to success screen or show success alert
      Alert.alert(
        'Transfer Successful',
        `You have successfully sent ${convertedAmount} ${toCurrency} to ${recipient.name}`,
        [{ text: 'OK', onPress: () => navigation.navigate('Wallet') }]
      );
    }, 3000);
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Title style={styles.title}>Confirm Transfer</Title>
        
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Amount</Text>
              <View style={styles.amountRow}>
                <Text style={styles.amountLabel}>You send:</Text>
                <Text style={styles.amountValue}>${amount} {fromCurrency}</Text>
              </View>
              <View style={styles.amountRow}>
                <Text style={styles.amountLabel}>Recipient gets:</Text>
                <Text style={styles.amountValue}>${convertedAmount} {toCurrency}</Text>
              </View>
            </View>
            
            <Divider style={styles.divider} />
            
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Recipient</Text>
              <Text style={styles.recipientName}>{recipient.name}</Text>
              <Text style={styles.recipientEmail}>{recipient.email}</Text>
              <Text style={styles.recipientWallet} numberOfLines={1} ellipsizeMode="middle">
                Wallet: {recipient.walletAddress}
              </Text>
            </View>
            
            <Divider style={styles.divider} />
            
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Fee Summary</Text>
              <View style={styles.feeRow}>
                <Text>Conversion Amount</Text>
                <Text>${amount} {fromCurrency}</Text>
              </View>
              <View style={styles.feeRow}>
                <Text>Network Fee</Text>
                <Text>${getFee()} {fromCurrency}</Text>
              </View>
              <Divider style={styles.feeDivider} />
              <View style={styles.feeRow}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>${getTotal()} {fromCurrency}</Text>
              </View>
            </View>
          </Card.Content>
        </Card>
        
        <View style={styles.disclaimerContainer}>
          <MaterialCommunityIcons name="information-outline" size={20} color="#666" />
          <Text style={styles.disclaimerText}>
            By confirming, you agree to our terms and conditions for cryptocurrency transfers.
            The transaction will be processed on the blockchain and cannot be reversed.
          </Text>
        </View>
        
        <Button
          mode="contained"
          onPress={handleConfirm}
          style={styles.confirmButton}
          loading={processing}
          disabled={processing}
        >
          {processing ? 'Processing...' : 'Confirm Transfer'}
        </Button>
        
        {!processing && (
          <Button
            mode="outlined"
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            Go Back
          </Button>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginVertical: 16,
    textAlign: 'center',
  },
  card: {
    marginVertical: 8,
  },
  section: {
    marginVertical: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#666',
  },
  amountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  amountLabel: {
    fontSize: 16,
  },
  amountValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  divider: {
    marginVertical: 16,
  },
  recipientName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  recipientEmail: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  recipientWallet: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  feeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
  feeDivider: {
    marginVertical: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6200ee',
  },
  disclaimerContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#E3F2FD',
    padding: 12,
    borderRadius: 8,
    marginVertical: 16,
  },
  disclaimerText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 8,
    flex: 1,
  },
  confirmButton: {
    marginTop: 8,
  },
  backButton: {
    marginTop: 8,
  },
});

export default ConfirmationScreen;