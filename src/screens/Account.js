import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import SavedRecipe from './SavedRecipe';

// PLACEHOLDER FOR NOW. Will update with actual user account info.
export default function Account({ navigation }) {
  const user = {
    username: 'JohnDoe',
    name: 'John Doe',
    profileImage: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-VVAFQW2U8NQA87BUSeV-Er2L7_vKUbu0HA&s',
  };

  return (
    <View style={styles.container}>
      {/* Header with Settings Icon */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{user.username}</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
          <Entypo name="menu" size={30} color="black" />
        </TouchableOpacity>
      </View>

      {/* Profile Section */}
      <View style={styles.profileSection}>
        <Image source={{ uri: user.profileImage }} style={styles.profileImage} />
        <TouchableOpacity style={styles.editProfileButton}>
          <Text style={styles.editProfileText}>Edit Profile</Text>
          {/* Add code for Edit Profile. Make as Modal */}
        </TouchableOpacity>
      </View>

      {/* Saved Recipes Section */}
      <View style={styles.recipesSection}>
        <Text style={styles.sectionTitle}>My Recipes</Text>
          {/* Delete the plus icon on the lower right.  Have the user create their own recipe from a */}
          {/* different add icon located elsewhere. */}
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
  },
  profileSection: {
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 25,
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
    padding: 8,
    backgroundColor: '#f57c00',
    borderRadius: 5,
  },
  editProfileText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  recipesSection: {
    flex: 1,
    paddingHorizontal: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    paddingHorizontal: 15,
    marginBottom: 1,
  },
});

// TODO:
// 1. Add a profile picture
// 2. Add a username
// 3. Add a "My Recipes" section 
// 4. Add a Settings option w/ cog icon navigating to Settings Page