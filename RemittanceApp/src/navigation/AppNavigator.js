import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Import screens
import WalletScreen from '../screens/Wallet/WalletScreen';
import TransactionHistoryScreen from '../screens/Wallet/TransactionHistoryScreen';
import KycFormScreen from '../screens/KYC/KycFormScreen';
import ConversionScreen from '../screens/Transfer/ConversionScreen';
import RecipientScreen from '../screens/Transfer/RecipientScreen';
import ConfirmationScreen from '../screens/Transfer/ConfirmationScreen';

// Create navigators
const Tab = createBottomTabNavigator();
const WalletStack = createStackNavigator();
const TransferStack = createStackNavigator();
const KycStack = createStackNavigator();

// Wallet Stack
function WalletStackNavigator() {
  return (
    <WalletStack.Navigator>
      <WalletStack.Screen name="Wallet" component={WalletScreen} />
      <WalletStack.Screen 
        name="TransactionHistory" 
        component={TransactionHistoryScreen} 
        options={{ title: 'Transaction History' }}
      />
    </WalletStack.Navigator>
  );
}

// Transfer Stack
function TransferStackNavigator() {
  return (
    <TransferStack.Navigator>
      <TransferStack.Screen 
        name="Conversion" 
        component={ConversionScreen} 
        options={{ title: 'Send Money' }}
      />
      <TransferStack.Screen 
        name="Recipient" 
        component={RecipientScreen} 
        options={{ title: 'Add Recipient' }}
      />
      <TransferStack.Screen 
        name="Confirmation" 
        component={ConfirmationScreen} 
        options={{ title: 'Confirm Transfer' }}
      />
    </TransferStack.Navigator>
  );
}

// KYC Stack
function KycStackNavigator() {
  return (
    <KycStack.Navigator>
      <KycStack.Screen 
        name="KycForm" 
        component={KycFormScreen} 
        options={{ title: 'Verify Identity' }}
      />
    </KycStack.Navigator>
  );
}

// Main Tab Navigator
export default function AppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#2563EB',
        tabBarInactiveTintColor: 'gray',
      }}
    >
      <Tab.Screen 
        name="WalletTab" 
        component={WalletStackNavigator} 
        options={{
          headerShown: false,
          title: 'Wallet',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="wallet" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen 
        name="TransferTab" 
        component={TransferStackNavigator} 
        options={{
          headerShown: false,
          title: 'Send',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="send" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen 
        name="KycTab" 
        component={KycStackNavigator} 
        options={{
          headerShown: false,
          title: 'KYC',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="shield-account" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}