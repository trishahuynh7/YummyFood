import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import { getAuth } from 'firebase/auth';
import SavedRecipe from './SavedRecipe';

// PLACEHOLDER FOR NOW. Will update with actual user account info.
export default function Account({ navigation }) {
  const [user, setUser] = useState({
    username: 'JohnDoe',
    firstName: 'John',
    lastName: 'Doe',
    email: 'johndoe123@gmail.com',
    profileImage: 'https://www.w3schools.com/w3images/avatar2.png',
  });

  const handleSave = (updatedData) => {
    setUser((prevUser) => ({
      ...prevUser,
      ...updatedData,
    }));
    // Add code to update saved data to backend for user
  };

  return (
    <View style={styles.container}>
      {/* Header with Settings Icon */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{user.username}</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
          <Entypo name="menu" size={30} color="black" marginTop='45'/>
        </TouchableOpacity>
      </View>

      {/* Profile Section */}
      <View style={styles.profileSection}>
        <Image source={{ uri: user.profileImage }} style={styles.profileImage} />
        <TouchableOpacity style={styles.editProfileButton} onPress={() => navigation.navigate('EditProfile')}>
          <Text style={styles.editProfileText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      {/* Saved Recipes Section */}
      <View style={styles.recipesSection}>
        <SavedRecipe />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#d1e6cc'
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 50,
  },
  profileSection: {
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 5,
    backgroundColor: '#d1e6cc'
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  username: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  editProfileButton: {
    marginTop: 10,
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#F8931F',
    borderRadius: 15,
  },
  editProfileText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  recipesSection: {
    flex: 1,
    paddingHorizontal: 10,
  },
  sectionTitle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
