import React from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Text } from 'react-native-paper';

const CurrencyInput = ({ value, onChangeText, style, error, ...props }) => {
  const handleTextChange = (text) => {
    // i/p to allow numeric values with up to 2 decimal places
    const formattedText = text.replace(/[^0-9.]/g, '');
    
    // decimal point handing
    if (formattedText.split('.').length > 2) {
      // Don't allow multiple decimal points
      return;
    }
    
    // dp limit
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