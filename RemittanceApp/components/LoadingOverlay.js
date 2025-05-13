import React from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';

const LoadingOverlay = ({ message = 'Loading...' }) => {
  return (
    <View style={styles.container}>
      <View style={styles.overlay}>
        <ActivityIndicator size="large" color="#ffffff" />
        <Text style={styles.text}>{message}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 999,
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 30,
    paddingVertical: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  text: {
    color: '#ffffff',
    marginTop: 15,
    fontWeight: '500',
  },
});

export default LoadingOverlay;