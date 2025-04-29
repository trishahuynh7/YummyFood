import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, 
  Modal, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

const EditProfile = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const pickImage = async () => {
    // Request permissions
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
      'Permission Required',
      'Please allow access to your photos to change your profile picture.'
      );
      return;
    }

    // Launch picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaType.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const handleSave = () => {
    // Implement save logic here (backend)

    // Set new data to current data
    const updatedData = {
      username,
      firstName,
      lastName,
      email,
      profileImage,
      phoneNumber,
    };

    // Console message displaying updated info success
    console.log('Updated user data:', updatedData);
    // Go back 
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
        
      {/* Top Navigation Bar */}
      <View style={styles.navBar}>
        <TouchableOpacity style={styles.navTitle} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.navTitle}>Edit Profile</Text>
        <TouchableOpacity style={styles.navTitle} onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {/* Profile Image Section */}
      <View style={styles.imageContainer}>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Image
            source={{ uri: profileImage || 'https://www.w3schools.com/w3images/avatar2.png' }}
            style={styles.profileImage}
          />
          <Text style={styles.changePhotoText}>Change Photo</Text>
        </TouchableOpacity>
      </View>

      {/* Form Fields */}
      <View style={styles.form}>
        {/* Username */}
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
        />
        {/* First Name */}
        <TextInput
          style={styles.input}
          placeholder="First Name (Optional)"
          value={firstName}
          onChangeText={setFirstName}
        />
        {/* Last Name */}
        <TextInput
          style={styles.input}
          placeholder="Last Name (Optional)"
          value={lastName}
          onChangeText={setLastName}
        />
        {/* Email */}
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        {/* Password */}
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        {/* Phone Number */}
        <TextInput
          style={styles.input}
          placeholder="Phone Number (Optional)"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <TouchableOpacity
            style={styles.modalOption}
            onPress={async () => {
              setModalVisible(false);
              const { status } = await ImagePicker.requestCameraPermissionsAsync();
              if (status !== 'granted') {
                Alert.alert('Camera access is required to take a photo.');
                return;
              }
              const result = await ImagePicker.launchCameraAsync({
                allowsEditing: true,
                aspect: [1, 1],
                quality: 1,
              });
              if (!result.canceled) {
                setProfileImage(result.assets[0].uri);
              }
            }}
          >
            <Text style={styles.modalOptionText}>Take Photo</Text>
        </TouchableOpacity>

      <TouchableOpacity
        style={styles.modalOption}
        onPress={async () => {
          setModalVisible(false);
          const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
          if (status !== 'granted') {
            Alert.alert('Photo library access is required to select a photo.');
            return;
          }
          const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
          });
          if (!result.canceled) {
            setProfileImage(result.assets[0].uri);
          }
        }}
      >
        <Text style={styles.modalOptionText}>Choose from Library</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.modalOption, { backgroundColor: '#eee' }]}
        onPress={() => setModalVisible(false)}
      >
        <Text style={[styles.modalOptionText, { color: '#666' }]}>Cancel</Text>
      </TouchableOpacity>
      </View>
      </View>
      </Modal>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  imageContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  navTitle: {
    marginTop: 45,
    fontSize: 20,
    fontWeight: 'bold',
  },
  profileImage: {
    width: 100, 
    height: 100, 
    borderRadius: 50, 
    marginBottom: 8,
  },
  changePhotoText: {
    color: '#007AFF', 
    fontSize: 14,
  },
  form: {
    padding: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 25,
    padding: 15,
    marginBottom: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalOption: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalOptionText: {
    fontSize: 16,
    textAlign: 'center',
  },
  saveButton: {
    backgroundColor: '#34C759',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default EditProfile;
