// src/components/CurrencyInput.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Text } from 'react-native-paper';

const CurrencyInput = ({ value, onChangeText, style, error, ...props }) => {
  const handleTextChange = (text) => {
    // Format input to only allow numeric values with up to 2 decimal places
    const formattedText = text.replace(/[^0-9.]/g, '');
    
    // Handle decimal points
    if (formattedText.split('.').length > 2) {
      // Don't allow multiple decimal points
      return;
    }
    
    // Limit to 2 decimal places
    const parts = formattedText.split('.');
    if (parts[1] && parts[1].length > 2) {
      return;
    }
    
    onChangeText(formattedText);
  };
  
  return (
    <View style={[styles.container, style]}>
      <TextInput
        value={value}
        onChangeText={handleTextChange}
        keyboardType="numeric"
        left={<TextInput.Affix text="$" />}
        mode="outlined"
        error={Boolean(error)}
        {...props}
      />
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  error: {
    fontSize: 12,
    color: '#B00020',
    paddingHorizontal: 4,
    paddingTop: 4,
  },
});

export default CurrencyInput;