import React, { useState, useEffect } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, Modal, TextInput, StyleSheet, Image, Animated, Dimensions
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PanGestureHandler } from 'react-native-gesture-handler';

const { height } = Dimensions.get('window');

export default function SavedRecipes() {
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const translateY = useState(new Animated.Value(height))[0];

  // Load saved recipes from storage
  useEffect(() => {
    const loadRecipes = async () => {
      const storedRecipes = await AsyncStorage.getItem('savedRecipes');
      if (storedRecipes) setSavedRecipes(JSON.parse(storedRecipes));
    };
    loadRecipes();
  }, []);

  // Save updated recipes back to storage
  const saveRecipesToStorage = async (recipes) => {
    await AsyncStorage.setItem('savedRecipes', JSON.stringify(recipes));
    setSavedRecipes(recipes);
  };

  // Open modal
  const handleRecipePress = (recipe) => {
    setSelectedRecipe(recipe);
    Animated.timing(translateY, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  // Close modal with swipe
  const handleSwipeDown = ({ nativeEvent }) => {
    if (nativeEvent.translationY > 100) {
      Animated.timing(translateY, {
        toValue: height,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setSelectedRecipe(null));
    }
  };

  // Save edits to recipe
  const handleSaveChanges = () => {
    const updatedRecipes = savedRecipes.map((recipe) =>
      recipe.id === selectedRecipe.id ? selectedRecipe : recipe
    );
    saveRecipesToStorage(updatedRecipes);
    handleSwipeDown({ nativeEvent: { translationY: 101 } }); // Close modal
  };

  // Delete recipe
  const handleDeleteRecipe = () => {
    const updatedRecipes = savedRecipes.filter((recipe) => recipe.id !== selectedRecipe.id);
    saveRecipesToStorage(updatedRecipes);
    handleSwipeDown({ nativeEvent: { translationY: 101 } }); // Close modal
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Saved Recipes</Text>
      <FlatList
        data={savedRecipes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.recipeCard} onPress={() => handleRecipePress(item)}>
            <Image source={{ uri: item.image }} style={styles.recipeImage} />
            <Text style={styles.recipeTitle}>{item.title}</Text>
          </TouchableOpacity>
        )}
      />

      {/* Modal for Editing Recipe */}
      {selectedRecipe && (
        <PanGestureHandler onGestureEvent={handleSwipeDown}>
          <Animated.View style={[styles.modal, { transform: [{ translateY }] }]}>
            <TextInput
              style={styles.input}
              value={selectedRecipe.title}
              onChangeText={(text) => setSelectedRecipe({ ...selectedRecipe, title: text })}
            />
            <TextInput
              style={styles.input}
              multiline
              value={selectedRecipe.ingredients.join('\n')}
              onChangeText={(text) =>
                setSelectedRecipe({ ...selectedRecipe, ingredients: text.split('\n') })
              }
            />
            <TextInput
              style={styles.input}
              multiline
              value={selectedRecipe.steps.join('\n')}
              onChangeText={(text) => setSelectedRecipe({ ...selectedRecipe, steps: text.split('\n') })}
            />

            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges}>
                <Text style={styles.buttonText}>Save Changes</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteRecipe}>
                <Text style={styles.buttonText}>Delete Recipe</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </PanGestureHandler>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  recipeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  recipeImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 15,
  },
  recipeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  modal: {
    position: 'absolute',
    width: '100%',
    height: '70%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    bottom: 0,
  },
  input: {
    fontSize: 16,
    borderBottomWidth: 1,
    borderColor: '#ddd',
    marginBottom: 10,
    padding: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  saveButton: {
    backgroundColor: '#28a745',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    padding: 12,
    borderRadius: 8,
    flex: 1,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
