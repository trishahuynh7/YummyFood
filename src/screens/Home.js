import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { Searchbar } from 'react-native-paper';

export default function Home() {
  const [searchQuery, setSearchQuery] = React.useState('');

  const handleClear = () => {
    setSearchQuery('');
    searchBarRef.current.blur();
  };

  return (
    <View style={styles.container}>
      <View style={styles.search}>
        <Searchbar
          placeholder="Search YummyFoods Recipe"
          onChangeText={setSearchQuery}
          showCancel={true}
          onClear={handleClear}
          value={searchQuery}
        />
      </View>
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
    // search bar goes top position
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  // cancel: {
  // }
});
