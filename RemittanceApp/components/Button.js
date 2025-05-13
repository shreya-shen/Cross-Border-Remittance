import React from 'react';
import { StyleSheet } from 'react-native';
import { Button as PaperButton } from 'react-native-paper';

const Button = ({ mode, style, children, ...props }) => {
  return (
    <PaperButton
      mode={mode}
      style={[
        styles.button,
        mode === 'outlined' && { backgroundColor: 'transparent' },
        style,
      ]}
      labelStyle={styles.text}
      {...props}
    >
      {children}
    </PaperButton>
  );
};

const styles = StyleSheet.create({
  button: {
    width: '100%',
    marginVertical: 10,
    paddingVertical: 2,
  },
  text: {
    fontWeight: 'bold',
    fontSize: 15,
    lineHeight: 26,
  },
});

export default Button;