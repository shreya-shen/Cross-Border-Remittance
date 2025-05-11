import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { Card, Title, Text, Button, List, Divider, ActivityIndicator } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const WalletScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [walletData, setWalletData] = useState(null);
  
  useEffect(() => {
    fetchWalletData();
  }, []);
  
  const fetchWalletData = () => {
    // Simulate API call to get wallet data
    setTimeout(() => {
      setWalletData({
        balance: {
          usd: 1250.75,
          usdc: 850.50,
        },
        recentTransactions: [
          {
            id: '1',
            type: 'received',
            amount: 350.00,
            currency: 'USDC',
            from: 'John Doe',
            timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
          },
          {
            id: '2',
            type: 'sent',
            amount: 125.50,
            currency: 'USDC',
            to: 'Jane Smith',
            timestamp: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
          },
          {
            id: '3',
            type: 'converted',
            amount: 500.00,
            fromCurrency: 'USD',
            toCurrency: 'USDC',
            timestamp: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
          },
        ]
      });
      setLoading(false);
      setRefreshing(false);
    }, 1500);
  };
  
  const onRefresh = () => {
    setRefreshing(true);
    fetchWalletData();
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const renderTransactionIcon = (type) => {
    switch (type) {
      case 'received':
        return <MaterialCommunityIcons name="arrow-bottom-left" size={24} color="#4CAF50" />;
      case 'sent':
        return <MaterialCommunityIcons name="arrow-top-right" size={24} color="#F44336" />;
      case 'converted':
        return <MaterialCommunityIcons name="swap-horizontal" size={24} color="#2196F3" />;
      default:
        return <MaterialCommunityIcons name="help-circle" size={24} color="#9E9E9E" />;
    }
  };
  
  const renderTransactionTitle = (transaction) => {
    switch (transaction.type) {
      case 'received':
        return `Received from ${transaction.from}`;
      case 'sent':
        return `Sent to ${transaction.to}`;
      case 'converted':
        return `Converted ${transaction.fromCurrency} to ${transaction.toCurrency}`;
      default:
        return 'Unknown Transaction';
    }
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
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      >
        <Card style={styles.balanceCard}>
          <Card.Content>
            <Title style={styles.balanceTitle}>Total Balance</Title>
            <View style={styles.balanceRow}>
              <View style={styles.balanceItem}>
                <Text style={styles.balanceLabel}>USD</Text>
                <Text style={styles.balanceAmount}>${walletData.balance.usd.toFixed(2)}</Text>
              </View>
              <View style={styles.balanceItem}>
                <Text style={styles.balanceLabel}>USDC</Text>
                <Text style={styles.balanceAmount}>${walletData.balance.usdc.toFixed(2)}</Text>
              </View>
            </View>
          </Card.Content>
        </Card>
        
        <View style={styles.actionButtons}>
          <Button
            mode="contained"
            icon="arrow-top-right"
            onPress={() => navigation.navigate('Transfer', { screen: 'Conversion' })}
            style={styles.actionButton}
          >
            Send
          </Button>
          <Button
            mode="outlined"
            icon="swap-horizontal"
            onPress={() => navigation.navigate('Transfer', { screen: 'Conversion' })}
            style={styles.actionButton}
          >
            Convert
          </Button>
        </View>
        
        <Card style={styles.transactionsCard}>
          <Card.Content>
            <View style={styles.transactionsHeader}>
              <Title>Recent Transactions</Title>
              <Button 
                mode="text" 
                onPress={() => navigation.navigate('History')}
              >
                See All
              </Button>
            </View>
            
            {walletData.recentTransactions.length > 0 ? (
              walletData.recentTransactions.map((transaction, index) => (
                <React.Fragment key={transaction.id}>
                  <List.Item
                    title={renderTransactionTitle(transaction)}
                    description={formatDate(transaction.timestamp)}
                    left={() => renderTransactionIcon(transaction.type)}
                    right={() => (
                      <Text style={transaction.type === 'received' ? styles.receivedAmount : styles.sentAmount}>
                        {transaction.type === 'received' ? '+' : transaction.type === 'sent' ? '-' : ''}
                        ${transaction.amount.toFixed(2)} {transaction.currency || ''}
                      </Text>
                    )}
                  />
                  {index < walletData.recentTransactions.length - 1 && <Divider />}
                </React.Fragment>
              ))
            ) : (
              <Text style={styles.noTransactions}>No recent transactions</Text>
            )}
          </Card.Content>
        </Card>
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
  balanceCard: {
    margin: 16,
    elevation: 4,
  },
  balanceTitle: {
    marginBottom: 16,
    textAlign: 'center',
    fontSize: 18,
  },
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  balanceItem: {
    alignItems: 'center',
  },
  balanceLabel: {
    fontSize: 16,
    color: '#666',
  },
  balanceAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 16,
    paddingHorizontal: 16,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 8,
  },
  transactionsCard: {
    margin: 16,
    marginTop: 0,
    elevation: 4,
  },
  transactionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  noTransactions: {
    textAlign: 'center',
    marginVertical: 24,
    color: '#666',
  },
  receivedAmount: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  sentAmount: {
    color: '#F44336',
    fontWeight: 'bold',
  },
});

export default WalletScreen;