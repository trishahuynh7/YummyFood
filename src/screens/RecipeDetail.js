import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Animated, Dimensions, Modal, ActivityIndicator } from 'react-native';
import { BlurView } from 'expo-blur';
import { Entypo } from '@expo/vector-icons';
import { fetchRecipeById } from './api';
import { useSavedRecipes } from '../context/SavedRecipesContext';

const SCREEN_HEIGHT = Dimensions.get('window').height;

export default function RecipeDetail({ route, navigation }) {
  const { recipeId } = route.params;
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(true);
  
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const { isRecipeSaved, toggleSaveRecipe } = useSavedRecipes();

  useEffect(() => {
    fetchRecipeDetails();
    openModal();
  }, [recipeId]);

  const fetchRecipeDetails = async () => {
    try {
      setLoading(true);
      const recipeData = await fetchRecipeById(recipeId);
      
      if (recipeData) {

        const formattedRecipe = {
          id: recipeData.idMeal,
          name: recipeData.strMeal,
          imageURL: recipeData.strMealThumb,
          description: recipeData.strInstructions,
          category: recipeData.strCategory,
          ingredients: extractIngredients(recipeData),
          measures: extractMeasures(recipeData)
        };
        
        setRecipe(formattedRecipe);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching recipe details:", error);
      setLoading(false);
    }
  };

  const extractIngredients = (meal) => {
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
      const ingredient = meal[`strIngredient${i}`];
      if (ingredient && ingredient.trim() !== '') {
        ingredients.push(ingredient);
      }
    }
    return ingredients;
  };

  const extractMeasures = (meal) => {
    const measures = [];
    for (let i = 1; i <= 20; i++) {
      const measure = meal[`strMeasure${i}`];
      if (measure && measure.trim() !== '') {
        measures.push(measure);
      }
    }
    return measures;
  };

  const openModal = () => {
    setModalVisible(true);
    slideAnim.setValue(SCREEN_HEIGHT);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeModal = () => {
    Animated.timing(slideAnim, {
      toValue: SCREEN_HEIGHT,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setModalVisible(false);
      navigation.goBack();
    });
  };

  const handleSaveToggle = () => {
    if (recipe) {
      toggleSaveRecipe(recipe);
    }
  };

  return (
    <View style={styles.container}>
      {modalVisible && (
        <Modal transparent animationType="none" visible={modalVisible}>
          <BlurView intensity={50} style={StyleSheet.absoluteFill} tint="light" />
          
          <Animated.View
            style={[styles.modalContent, { transform: [{ translateY: slideAnim }] }]}
          >
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#FF6347" />
                <Text style={styles.loadingText}>Loading recipe...</Text>
              </View>
            ) : recipe ? (
              <>
                <Image
                  source={{ uri: recipe.imageURL || 'https://via.placeholder.com/400x300?text=No+Image' }}
                  style={styles.modalImage}
                />
                <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                  <Entypo name="circle-with-cross" size={25} color="#FFFFFF" />
                </TouchableOpacity>
                
                <TouchableOpacity 
                  onPress={handleSaveToggle} 
                  style={[styles.closeButton, styles.saveButton]}
                >
                  <Entypo 
                    name={isRecipeSaved(recipe.id) ? "heart" : "heart-outlined"} 
                    size={25} 
                    color={isRecipeSaved(recipe.id) ? "red" : "#FFFFFF"} 
                  />
                </TouchableOpacity>
                
                <ScrollView style={styles.modalBody}>
                  <Text style={styles.modalTitle}>{recipe.name}</Text>
                  
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Category: </Text>
                    <Text style={styles.infoValue}>{recipe.category}</Text>
                  </View>
                  
                  <Text style={styles.modalSubtitle}>Ingredients:</Text>
                  {recipe.ingredients.map((ingredient, index) => (
                    <Text key={index} style={styles.modalText}>
                      • {recipe.measures[index] || ''} {ingredient}
                    </Text>
                  ))}
                  
                  <Text style={styles.modalSubtitle}>Instructions:</Text>
                  <Text style={styles.modalText}>{recipe.description}</Text>
                </ScrollView>
              </>
            ) : (
              <View style={styles.loadingContainer}>
                <Text style={styles.errorText}>Recipe not found</Text>
                <TouchableOpacity onPress={closeModal} style={styles.button}>
                  <Text style={styles.buttonText}>Go Back</Text>
                </TouchableOpacity>
              </View>
            )}
          </Animated.View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  modalContent: {
    position: 'absolute',
    bottom: 0,
    height: SCREEN_HEIGHT * 0.9,
    width: '100%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingBottom: 40,
  },
  modalImage: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  modalBody: {
    padding: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalSubtitle: {
    marginTop: 15,
    marginBottom: 5,
    fontWeight: '600',
    fontSize: 16,
    color: '#444',
  },
  modalText: {
    fontSize: 14,
    color: '#333',
    marginTop: 4,
    lineHeight: 20,
  },
  infoRow: {
    flexDirection: 'row',
    marginTop: 5,
    marginBottom: 10,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#555',
  },
  infoValue: {
    fontSize: 14,
    color: '#333',
  },
  button: {
    marginTop: 20,
    padding: 12,
    backgroundColor: '#F8931F',
    borderRadius: 10,
    alignItems: 'center',
    width: '50%',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  closeButton: {
    position: 'absolute',
    right: 20,
    top: 20,
    zIndex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 15,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButton: {
    right: 60, 
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 15,
    fontSize: 18,
    color: '#666',
  },
  errorText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF6347',
  },
});