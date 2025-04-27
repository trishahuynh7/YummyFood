import React from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet,
  Image, ScrollView, Dimensions
} from 'react-native';
import { Entypo } from '@expo/vector-icons';
import { useSavedRecipes } from '../context/SavedRecipesContext';
import { useNavigation } from '@react-navigation/native';

const screenWidth = Dimensions.get('window').width;
const cardWidth = (screenWidth - 30) / 2; 

export default function SavedRecipe() {
  const navigation = useNavigation();
  const { 
    savedRecipes, 
    toggleSaveRecipe, 
    isLoading 
  } = useSavedRecipes();

  const renderRecipe = ({ item }) => {
    return (
      <View style={styles.cardWrapper}>
        <TouchableOpacity 
          style={styles.card} 
          onPress={() => navigation.navigate('RecipeDetail', { recipeId: item.id })}
        >
          <Image 
            source={{ uri: item.imageURL || item.image }} 
            style={styles.cardImage} 
            resizeMode="cover"
          />
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>{item.title || item.name}</Text>
            <TouchableOpacity onPress={(e) => {
              e.stopPropagation();
              toggleSaveRecipe(item);
            }}>
              <Entypo
                name="heart"
                size={24}
                color="red"
              />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>Loading saved recipes...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Saved Recipes</Text>
      </View>

      {savedRecipes.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>You haven't saved any recipes yet.</Text>
          <Text style={styles.instructionText}>
            Browse recipes and tap the heart icon to save your favorites.
          </Text>
        </View>
      ) : (
        <FlatList
          data={savedRecipes}
          numColumns={2}
          keyExtractor={(item) => item.id}
          renderItem={renderRecipe}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
    width: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  list: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#666',
  },
  instructionText: {
    fontSize: 14,
    textAlign: 'center',
    color: '#888',
    paddingHorizontal: 30,
  },
  cardWrapper: {
    width: cardWidth,
    margin: 5,
  },
  card: {
    borderRadius: 10,
    backgroundColor: '#ffe0cc',
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    alignItems: 'center',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 8,
    width: '100%',
  },
  cardImage: {
    width: '100%',
    height: 120,
    borderRadius: 10,
  },
  cardTitle: {
    padding: 8,
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 14,
    flex: 1,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
