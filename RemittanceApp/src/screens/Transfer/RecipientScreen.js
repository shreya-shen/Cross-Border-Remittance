// src/screens/Transfer/RecipientScreen.js
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { TextInput, Button, Title, Text, List, Avatar, Divider, Chip, ActivityIndicator } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const RecipientScreen = ({ route, navigation }) => {
  const { amount, convertedAmount, fromCurrency, toCurrency } = route.params;
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [recipients, setRecipients] = useState([]);
  const [recentRecipients, setRecentRecipients] = useState([]);
  const [selectedRecipient, setSelectedRecipient] = useState(null);
  
  useEffect(() => {
    fetchRecipients();
  }, []);
  
  const fetchRecipients = () => {
    // Simulate API call to get recent recipients
    setTimeout(() => {
      setRecentRecipients([
        {
          id: '1',
          name: 'John Doe',
          walletAddress: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
          email: 'john.doe@example.com',
        },
        {
          id: '2',
          name: 'Jane Smith',
          walletAddress: '0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t',
          email: 'jane.smith@example.com',
        },
        {
          id: '3',
          name: 'Robert Brown',
          walletAddress: '0x9s8r7q6p5o4n3m2l1k0j9i8h7g6f5e4d3c2b1a',
          email: 'robert.brown@example.com',
        },
      ]);
      setLoading(false);
    }, 1000);
  };
  
  const handleSearch = (query) => {
    setSearchQuery(query);
    
    if (!query) {
      setRecipients([]);
      return;
    }
    
    setSearching(true);
    
    // Simulate API call to search recipients
    setTimeout(() => {
      setRecipients([
        {
          id: '4',
          name: 'Michael Johnson',
          walletAddress: '0x4n3m2l1k0j9i8h7g6f5e4d3c2b1a9s8r7q6p5o',
          email: 'michael.johnson@example.com',
        },
        {
          id: '5',
          name: 'Sarah Wilson',
          walletAddress: '0x7g6f5e4d3c2b1a0j9i8h7g6f5e4d3c2b1a0z9y8',
          email: 'sarah.wilson@example.com',
        },
      ].filter(recipient => 
        recipient.name.toLowerCase().includes(query.toLowerCase()) ||
        recipient.email.toLowerCase().includes(query.toLowerCase())
      ));
      setSearching(false);
    }, 1000);
  };
  
  const handleSelectRecipient = (recipient) => {
    setSelectedRecipient(recipient);
  };
  
  const handleContinue = () => {
    if (!selectedRecipient) {
      Alert.alert('No Recipient Selected', 'Please select a recipient to continue');
      return;
    }
    
    navigation.navigate('Confirmation', {
      amount,
      convertedAmount,
      fromCurrency,
      toCurrency,
      recipient: selectedRecipient,
    });
  };
  
  const renderRecipientItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleSelectRecipient(item)}>
      <List.Item
        title={item.name}
        description={item.email}
        left={props => (
          <Avatar.Text
            {...props}
            size={40}
            label={item.name.split(' ').map(n => n[0]).join('')}
          />
        )}
        right={props => 
          selectedRecipient && selectedRecipient.id === item.id ? (
            <MaterialCommunityIcons {...props} name="check-circle" size={24} color="#6200ee" />
          ) : null
        }
        style={selectedRecipient && selectedRecipient.id === item.id ? styles.selectedItem : null}
      />
    </TouchableOpacity>
  );
  
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200ee" />
        <Text style={styles.loadingText}>Loading recipients...</Text>
      </View>
    );
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <Title style={styles.title}>Select Recipient</Title>
      
      <TextInput
        label="Search by name or email"
        value={searchQuery}
        onChangeText={handleSearch}
        style={styles.searchInput}
        left={<TextInput.Icon name="magnify" />}
        clearButtonMode="while-editing"
      />
      
      {searching && (
        <View style={styles.searchingContainer}>
          <ActivityIndicator size="small" color="#6200ee" />
          <Text style={styles.searchingText}>Searching...</Text>
        </View>
      )}
      
      {!searching && recipients.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Search Results</Text>
          <FlatList
            data={recipients}
            renderItem={renderRecipientItem}
            keyExtractor={item => item.id}
            ItemSeparatorComponent={() => <Divider />}
          />
        </View>
      )}
      
      {!searching && searchQuery && recipients.length === 0 && (
        <View style={styles.emptyResultContainer}>
          <MaterialCommunityIcons name="account-search" size={48} color="#9E9E9E" />
          <Text style={styles.emptyResultText}>No recipients found</Text>
        </View>
      )}
      
      {recentRecipients.length > 0 && !searchQuery && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Recipients</Text>
          <FlatList
            data={recentRecipients}
            renderItem={renderRecipientItem}
            keyExtractor={item => item.id}
            ItemSeparatorComponent={() => <Divider />}
          />
        </View>
      )}
      
      <View style={styles.amountSummary}>
        <Text style={styles.amountLabel}>Sending Amount:</Text>
        <Text style={styles.amountValue}>${amount} {fromCurrency} → ${convertedAmount} {toCurrency}</Text>
      </View>
      
      <Button
        mode="contained"
        onPress={handleContinue}
        style={styles.continueButton}
        disabled={!selectedRecipient}
      >
        Continue
      </Button>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
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
    marginVertical: 16,
  },
  searchInput: {
    marginBottom: 16,
  },
  searchingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  searchingText: {
    marginLeft: 8,
    color: '#666',
  },
  section: {
    marginVertical: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#666',
  },
  selectedItem: {
    backgroundColor: 'rgba(98, 0, 238, 0.05)',
  },
  emptyResultContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyResultText: {
    marginTop: 16,
    color: '#666',
    fontSize: 16,
  },
  amountSummary: {
    backgroundColor: '#E8F5E9',
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
  },
  amountLabel: {
    fontSize: 14,
    color: '#333',
  },
  amountValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginTop: 8,
  },
  continueButton: {
    marginTop: 16,
  },
});

export default RecipientScreen;