import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';

const SettingsScreen = ({ navigation }) => {
  // const [username, setUsername] = useState('JohnDoe');
  // const [firstName, setFirstName] = useState('John');
  // const [lastName, setLastName] = useState('Doe');
  // const [email, setEmail] = useState('johndoe@example.com');
  // const [password, setPassword] = useState('');

  const handleSave = () => {
    // Implement your save logic here, such as updating the user profile via API
    Alert.alert('Success', 'Your changes have been saved.');
  };

  const handleLogout = () => {
    // Implement your logout logic here, such as clearing user data and navigating to the login screen
    navigation.reset({
      index: 0,
      routes: [{ name: 'Welcome' }],
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      {/* <Text style={styles.label}>Username</Text>
      <TextInput value={username} onChangeText={setUsername} style={styles.input} />

      <Text style={styles.label}>First Name</Text>
      <TextInput value={firstName} onChangeText={setFirstName} style={styles.input} />

      <Text style={styles.label}>Last Name</Text>
      <TextInput value={lastName} onChangeText={setLastName} style={styles.input} />

      <Text style={styles.label}>Email</Text>
      <TextInput value={email} onChangeText={setEmail} style={styles.input} keyboardType="email-address" />

      <Text style={styles.label}>Password</Text>
      <TextInput value={password} onChangeText={setPassword} style={styles.input} secureTextEntry />

      <View style={styles.buttonContainer}>
        <Button title="Save Changes" onPress={handleSave} />
      </View> */}

      <View style={styles.buttonContainer}>
        <Button title="Log Out" onPress={handleLogout} color="red" />
      </View>
    </View>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  label: {
    marginTop: 15,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginTop: 5,
  },
  buttonContainer: {
    marginTop: 20,
  },
});
