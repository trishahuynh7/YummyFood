import React, { useState, useEffect, useRef } from 'react';
import {View,Text,StyleSheet,Image,TouchableOpacity,ScrollView,Animated,Dimensions,Modal,ActivityIndicator} from 'react-native';
import { BlurView } from 'expo-blur';
import { Entypo } from '@expo/vector-icons';
import { db } from './firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

const SCREEN_HEIGHT = Dimensions.get('window').height;

export default function RecipeDetail({ route, navigation }) {
  const { recipeId } = route.params;
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(true);
  
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  useEffect(() => {
    fetchRecipeDetails();
    openModal();
  }, [recipeId]);

  const fetchRecipeDetails = async () => {
    try {
      setLoading(true);
      const recipeRef = doc(db, 'recipes', recipeId);
      const recipeSnap = await getDoc(recipeRef);
      
      if (recipeSnap.exists()) {
        setRecipe({ id: recipeSnap.id, ...recipeSnap.data() });
      } else {
        console.log("No such recipe!");
      }
      
      setLoading(false);
    } catch (error) {
      console.error("Error fetching recipe details:", error);
      setLoading(false);
    }
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

  const formatIngredients = (ingredients) => {
    if (!ingredients) return [];
    
    // Handle different possible formats of ingredients
    if (Array.isArray(ingredients)) {
      return ingredients;
    } else if (typeof ingredients === 'string') {
      return ingredients.split(',').map(item => item.trim());
    } else if (typeof ingredients === 'object') {
      // If ingredients is an object like {ingredient1: "flour", amount1: "2 cups"}
      const result = [];
      Object.keys(ingredients).forEach(key => {
        if (key.includes('ingredient')) {
          const index = key.replace('ingredient', '');
          const amount = ingredients[`amount${index}`] || '';
          result.push(`${amount} ${ingredients[key]}`);
        }
      });
      return result.length ? result : Object.values(ingredients);
    }
    return [];
  };

  const formatSteps = (steps) => {
    if (!steps) return [];
    
    // Handle different possible formats of steps
    if (Array.isArray(steps)) {
      return steps;
    } else if (typeof steps === 'string') {
      return steps.split('\n').filter(s => s.trim().length > 0);
    } else if (typeof steps === 'object') {
      return Object.values(steps);
    }
    return [];
  };

  // If we have preparation steps but no array of steps, try to parse them
  const getSteps = (recipe) => {
    if (recipe.steps) {
      return formatSteps(recipe.steps);
    } else if (recipe.preparation) {
      return formatSteps(recipe.preparation);
    } else if (recipe.instructions) {
      return formatSteps(recipe.instructions);
    }
    return [];
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
                
                <ScrollView style={styles.modalBody}>
                  <Text style={styles.modalTitle}>{recipe.name || recipe.title}</Text>
                  
                  {recipe.description && (
                    <Text style={styles.modalText}>{recipe.description}</Text>
                  )}
                  
                  {recipe.prepTime && (
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Prep Time: </Text>
                      <Text style={styles.infoValue}>{recipe.prepTime}</Text>
                    </View>
                  )}
                  
                  {recipe.cookTime && (
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Cook Time: </Text>
                      <Text style={styles.infoValue}>{recipe.cookTime}</Text>
                    </View>
                  )}
                  
                  {recipe.servings && (
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Servings: </Text>
                      <Text style={styles.infoValue}>{recipe.servings}</Text>
                    </View>
                  )}
                  
                  <Text style={styles.modalSubtitle}>Ingredients:</Text>
                  {formatIngredients(recipe.ingredients).map((item, index) => (
                    <Text key={index} style={styles.modalText}>• {item}</Text>
                  ))}
                  
                  <Text style={styles.modalSubtitle}>Steps:</Text>
                  {getSteps(recipe).map((step, index) => (
                    <Text key={index} style={styles.modalText}>{index + 1}. {step}</Text>
                  ))}
                  
                  {recipe.notes && (
                    <>
                      <Text style={styles.modalSubtitle}>Notes:</Text>
                      <Text style={styles.modalText}>{recipe.notes}</Text>
                    </>
                  )}
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
    marginTop: 20,
    marginBottom: 10,
    fontWeight: '600',
    fontSize: 18,
    color: '#444',
  },
  modalText: {
    fontSize: 16,
    color: '#333',
    marginTop: 4,
    lineHeight: 22,
  },
  infoRow: {
    flexDirection: 'row',
    marginTop: 5,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#555',
  },
  infoValue: {
    fontSize: 16,
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
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF6347',
  },
});