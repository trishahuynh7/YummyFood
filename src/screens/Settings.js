import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { Ionicons } from 'react-native-vector-icons';

const SettingsScreen = ({ navigation }) => {

  const handleLogout = () => {
    // Implement your logout logic here, such as clearing user data and navigating to the login screen
    navigation.reset({
      index: 0,
      routes: [{ name: 'Welcome' }],
    });
  };

  return (
    <View style={styles.container}>
            <View style={styles.header}>
        <Ionicons
          name="arrow-back"
          size={30}
          color="black"
          onPress={() => navigation.goBack()} // Navigate back to Account page
          style={styles.backIcon}
        />
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <View style={styles.editButtonContainer}>
        <Button title="Edit Profile" onPress={() => navigation.navigate('EditProfile')} color='black'/>
      </View>

      <View style={styles.buttonContainer}>
        <Button title="Log Out" onPress={handleLogout} color='red' borderColor='red'/>
      </View>
    </View>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    backgroundColor: '#fff',
    paddingTop: 50,
  },
  backIcon: {
    position: 'absolute',
    left: 10, 
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10, 
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 10,
    justifyContent: 'center',
    marginLeft: 120,
  },
  label: {
    marginTop: 15,
    fontWeight: 'bold',
  },
  editButtonContainer: {
    marginTop: 20,
    backgroundColor: 'white',
    borderRadius: 30,
    borderWidth: 1,
  },
  buttonContainer: {
    marginTop: 20,
    backgroundColor: 'white',
    borderColor: 'red',
    borderRadius: 30,
    borderWidth: 1,
  },
});
