import React, { useState } from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Alert, Platform } from 'react-native';
import { Button, Text, ActivityIndicator } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const PhotoUploader = ({ onImageSelected, label, icon = 'camera', size = 120 }) => {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const requestPermissions = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Sorry, we need camera roll permissions to make this work!');
        return false;
      }
      return true;
    }
    return true;
  };

  const takePhoto = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      setLoading(true);
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        setImage(result.assets[0].uri);
        if (onImageSelected) {
          onImageSelected(result.assets[0].uri);
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to take photo');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      setLoading(true);
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        setImage(result.assets[0].uri);
        if (onImageSelected) {
          onImageSelected(result.assets[0].uri);
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const removeImage = () => {
    setImage(null);
    if (onImageSelected) {
      onImageSelected(null);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label || 'Upload Photo'}</Text>
      
      {loading ? (
        <View style={[styles.imageContainer, { width: size, height: size }]}>
          <ActivityIndicator size="large" color="#6200ee" />
        </View>
      ) : image ? (
        <View>
          <Image source={{ uri: image }} style={[styles.image, { width: size, height: size }]} />
          <TouchableOpacity style={styles.removeButton} onPress={removeImage}>
            <MaterialCommunityIcons name="close-circle" size={24} color="#F44336" />
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity 
          style={[styles.placeholder, { width: size, height: size }]} 
          onPress={takePhoto}
        >
          <MaterialCommunityIcons name={icon} size={size / 3} color="#6200ee" />
        </TouchableOpacity>
      )}
      
      <View style={styles.buttonContainer}>
        <Button mode="contained" onPress={takePhoto} style={styles.button}>
          Camera
        </Button>
        <Button mode="outlined" onPress={pickImage} style={styles.button}>
          Gallery
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E1E1E1',
    borderRadius: 8,
  },
  image: {
    borderRadius: 8,
    resizeMode: 'cover',
  },
  placeholder: {
    backgroundColor: '#E1E1E1',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#C7C7C7',
    borderStyle: 'dashed',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 16,
    width: '100%',
    justifyContent: 'space-around',
  },
  button: {
    width: '45%',
  },
  removeButton: {
    position: 'absolute',
    top: -10,
    right: -10,
    backgroundColor: 'white',
    borderRadius: 12,
    elevation: 2,
  },
});

export default PhotoUploader;