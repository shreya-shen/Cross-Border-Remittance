import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { List, Divider, Text, Title, Searchbar, Chip, ActivityIndicator } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const TransactionHistoryScreen = () => {
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  
  useEffect(() => {
    fetchTransactionHistory();
  }, []);
  
  const fetchTransactionHistory = () => {
    // API call to get trans history
    setTimeout(() => {
      setTransactions([
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
        {
          id: '4',
          type: 'received',
          amount: 210.75,
          currency: 'USDC',
          from: 'Robert Brown',
          timestamp: new Date(Date.now() - 345600000).toISOString(), // 4 days ago
        },
        {
          id: '5',
          type: 'sent',
          amount: 75.25,
          currency: 'USDC',
          to: 'Sarah Johnson',
          timestamp: new Date(Date.now() - 432000000).toISOString(), // 5 days ago
        },
        {
          id: '6',
          type: 'converted',
          amount: 300.00,
          fromCurrency: 'USD',
          toCurrency: 'USDC',
          timestamp: new Date(Date.now() - 518400000).toISOString(), // 6 days ago
        },
        {
          id: '7',
          type: 'received',
          amount: 150.00,
          currency: 'USDC',
          from: 'Michael Wilson',
          timestamp: new Date(Date.now() - 604800000).toISOString(), // 7 days ago
        },
      ]);
      setLoading(false);
    }, 1500);
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
  
  const filterTransactions = () => {
    let filtered = [...transactions];
    
    // search filter
    if (searchQuery) {
      filtered = filtered.filter(transaction => {
        const title = renderTransactionTitle(transaction).toLowerCase();
        return title.includes(searchQuery.toLowerCase());
      });
    }
    
    // type filter
    if (filter !== 'all') {
      filtered = filtered.filter(transaction => transaction.type === filter);
    }
    
    return filtered;
  };
  
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200ee" />
        <Text style={styles.loadingText}>Loading transactions...</Text>
      </View>
    );
  }
  
  const filteredTransactions = filterTransactions();
  
  return (
    <SafeAreaView style={styles.container}>
      <Searchbar
        placeholder="Search transactions"
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchbar}
      />
      
      <View style={styles.filterContainer}>
        <Chip 
          selected={filter === 'all'} 
          onPress={() => setFilter('all')}
          style={styles.filterChip}
        >
          All
        </Chip>
        <Chip 
          selected={filter === 'received'} 
          onPress={() => setFilter('received')}
          style={styles.filterChip}
          icon="arrow-bottom-left"
        >
          Received
        </Chip>
        <Chip 
          selected={filter === 'sent'} 
          onPress={() => setFilter('sent')}
          style={styles.filterChip}
          icon="arrow-top-right"
        >
          Sent
        </Chip>
        <Chip 
          selected={filter === 'converted'} 
          onPress={() => setFilter('converted')}
          style={styles.filterChip}
          icon="swap-horizontal"
        >
          Converted
        </Chip>
      </View>
      
      {filteredTransactions.length > 0 ? (
        <FlatList
          data={filteredTransactions}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <List.Item
              title={renderTransactionTitle(item)}
              description={formatDate(item.timestamp)}
              left={() => renderTransactionIcon(item.type)}
              right={() => (
                <Text style={item.type === 'received' ? styles.receivedAmount : styles.sentAmount}>
                  {item.type === 'received' ? '+' : item.type === 'sent' ? '-' : ''}
                  ${item.amount.toFixed(2)} {item.currency || ''}
                </Text>
              )}
            />
          )}
          ItemSeparatorComponent={() => <Divider />}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons name="receipt" size={64} color="#9E9E9E" />
          <Text style={styles.emptyText}>No transactions found</Text>
        </View>
      )}
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
  searchbar: {
    margin: 16,
    marginBottom: 8,
  },
  filterContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  filterChip: {
    marginRight: 8,
    marginBottom: 8,
  },
  listContent: {
    backgroundColor: '#fff',
  },
  receivedAmount: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  sentAmount: {
    color: '#F44336',
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
});

export default TransactionHistoryScreen;