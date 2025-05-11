import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { TextInput, Button, Text, Title, HelperText, Divider } from 'react-native-paper';
import { Formik } from 'formik';
import * as Yup from 'yup';
import * as ImagePicker from 'expo-image-picker';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const KycSchema = Yup.object().shape({
  idNumber: Yup.string().required('ID number is required'),
  dateOfBirth: Yup.string()
    .matches(
      /^\d{2}\/\d{2}\/\d{4}$/,
      'Date must be in format DD/MM/YYYY'
    )
    .required('Date of birth is required'),
  address: Yup.string().required('Address is required'),
});

export default function KycFormScreen({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [idPhoto, setIdPhoto] = useState(null);
  const [selfiePhoto, setSelfiePhoto] = useState(null);

  const pickImage = async (setImageFunc) => {
    // Request permissions
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to upload photos!');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImageFunc(result.assets[0].uri);
    }
  };

  const takePhoto = async (setImageFunc) => {
    // Request permissions
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    
    if (status !== 'granted') {
      alert('Sorry, we need camera permissions to take photos!');
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImageFunc(result.assets[0].uri);
    }
  };

  const handleSubmitKyc = async (values) => {
    try {
      // Validate photos
      if (!idPhoto || !selfiePhoto) {
        alert('Please upload both ID photo and selfie');
        return;
      }

      setLoading(true);
      // Here you would call your API
      console.log('KYC submission with:', {
        ...values,
        idPhoto,
        selfiePhoto,
      });
      
      // For demo: simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Show success message
      alert('KYC submitted successfully! We will review your documents shortly.');
      
      // In a real app, you might navigate back or to a confirmation screen
      // navigation.goBack();
    } catch (error) {
      console.error('KYC submission error:', error);
      alert('Failed to submit KYC. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Title style={styles.title}>Identity Verification</Title>
      <Text style={styles.subtitle}>
        Complete KYC to unlock full remittance features
      </Text>

      <Formik
        initialValues={{ idNumber: '', dateOfBirth: '', address: '' }}
        validationSchema={KycSchema}
        onSubmit={handleSubmitKyc}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <View style={styles.formContainer}>
            <TextInput
              label="Government ID Number"
              value={values.idNumber}
              onChangeText={handleChange('idNumber')}
              onBlur={handleBlur('idNumber')}
              error={touched.idNumber && errors.idNumber ? true : false}
              style={styles.input}
              mode="outlined"
            />
            {touched.idNumber && errors.idNumber && (
              <HelperText type="error">{errors.idNumber}</HelperText>
            )}

            <TextInput
              label="Date of Birth (DD/MM/YYYY)"
              value={values.dateOfBirth}
              onChangeText={handleChange('dateOfBirth')}
              onBlur={handleBlur('dateOfBirth')}
              error={touched.dateOfBirth && errors.dateOfBirth ? true : false}
              style={styles.input}
              mode="outlined"
              placeholder="DD/MM/YYYY"
            />
            {touched.dateOfBirth && errors.dateOfBirth && (
              <HelperText type="error">{errors.dateOfBirth}</HelperText>
            )}

            <TextInput
              label="Residential Address"
              value={values.address}
              onChangeText={handleChange('address')}
              onBlur={handleBlur('address')}
              error={touched.address && errors.address ? true : false}
              style={styles.input}
              mode="outlined"
              multiline
              numberOfLines={3}
            />
            {touched.address && errors.address && (
              <HelperText type="error">{errors.address}</HelperText>
            )}

            <Divider style={styles.divider} />
            
            <Text style={styles.sectionTitle}>ID Verification</Text>
            
            <View style={styles.photoSection}>
              <Text style={styles.photoTitle}>ID Document Photo</Text>
              
              <View style={styles.photoContainer}>
                {idPhoto ? (
                  <Image source={{ uri: idPhoto }} style={styles.photo} />
                ) : (
                  <View style={styles.photoPlaceholder}>
                    <MaterialCommunityIcons name="card-account-details" size={40} color="#999" />
                    <Text style={styles.photoPlaceholderText}>ID Photo</Text>
                  </View>
                )}
              </View>
              
              <View style={styles.photoButtons}>
                <Button 
                  mode="outlined" 
                  onPress={() => pickImage(setIdPhoto)}
                  style={styles.photoButton}
                >
                  Choose Photo
                </Button>
                <Button 
                  mode="outlined" 
                  onPress={() => takePhoto(setIdPhoto)}
                  style={styles.photoButton}
                >
                  Take Photo
                </Button>
              </View>
            </View>

            <View style={styles.photoSection}>
              <Text style={styles.photoTitle}>Selfie with ID</Text>
              
              <View style={styles.photoContainer}>
                {selfiePhoto ? (
                  <Image source={{ uri: selfiePhoto }} style={styles.photo} />
                ) : (
                  <View style={styles.photoPlaceholder}>
                    <MaterialCommunityIcons name="account" size={40} color="#999" />
                    <Text style={styles.photoPlaceholderText}>Selfie Photo</Text>
                  </View>
                )}
              </View>
              
              <View style={styles.photoButtons}>
                <Button 
                  mode="outlined" 
                  onPress={() => pickImage(setSelfiePhoto)}
                  style={styles.photoButton}
                >
                  Choose Photo
                </Button>
                <Button 
                  mode="outlined" 
                  onPress={() => takePhoto(setSelfiePhoto)}
                  style={styles.photoButton}
                >
                  Take Photo
                </Button>
              </View>
            </View>

            <Button
              mode="contained"
              onPress={handleSubmit}
              loading={loading}
              disabled={loading}
              style={styles.submitButton}
            >
              Submit Verification
            </Button>
          </View>
        )}
      </Formik>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
  },
  subtitle: {
    fontSize: 16,
    color: 'gray',
    marginTop: 5,
    marginBottom: 20,
  },
  formContainer: {
    marginBottom: 20,
  },
  input: {
    marginBottom: 10,
  },
  divider: {
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  photoSection: {
    marginBottom: 20,
  },
  photoTitle: {
    fontSize: 16,
    marginBottom: 10,
  },
  photoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  photo: {
    width: 200,
    height: 150,
    borderRadius: 10,
  },
  photoPlaceholder: {
    width: 200,
    height: 150,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  photoPlaceholderText: {
    marginTop: 5,
    color: '#999',
  },
  photoButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  photoButton: {
    marginHorizontal: 5,
  },
  submitButton: {
    marginTop: 20,
    paddingVertical: 8,
  },
});