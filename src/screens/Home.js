import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Searchbar } from 'react-native-paper';

export default function Home() {
  return (
    <View style={styles.container}>
      // search bar
      <View style={styles.search}>
        <Searchbar
          placeholder="Search YummyFoods Recipe"
        />
      </View>

      // homepage text
      <Text style={styles.text}>This is the Home Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  search: {
    height: 25,
    borderRadius: 10,
    padding: 10,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  }
});
