import React from 'react';
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, Modal } from 'react-native';
import { Searchbar } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons'; // For food type icons

export default function Home() {
  const [searchQuery, setSearchQuery] = React.useState('');

  const handleClear = () => {
    setSearchQuery('');
  };

  const categories = [1, 2, 3, 4]; // Representing category buttons (can be revised with food types)
  const images = [
    // Placeholders for recipe images for now
    { uri: 'https://via.placeholder.com/150' },
    { uri: 'https://via.placeholder.com/150' },
    { uri: 'https://via.placeholder.com/150' },
    { uri: 'https://via.placeholder.com/150' },
  ];

  return (
    <View style={styles.container}>     
      {/* Search Bar */}
      <Searchbar
        placeholder="Search YummyFoods Recipe"
        onChangeText={setSearchQuery}
        value={searchQuery}
        onClear={handleClear}
        style={styles.searchBar}
      />

      {/* Categories */}
      <View style={styles.categoryContainer}>
        {categories.map((item, index) => (
          <View key={index} style={styles.categoryCircle} />
        ))}
      </View>

      {/* Image Grid */}
      <FlatList
        data={images}
        numColumns={2}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <Image source={item} style={styles.image} />
        )}
      />
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 40,
  },
  searchBar: {
    width: '90%',
    marginTop: 0,
    marginBottom: 20,    
  },
  // Food types (under search bar)
  categoryContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 15,
  },
  categoryCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'orange',
    justifyContent: 'space-evenly',
    marginHorizontal: 5,
  },
  image: {
    width: 150,
    height: 120,
    margin: 5,
    borderRadius: 10,
  },
});

