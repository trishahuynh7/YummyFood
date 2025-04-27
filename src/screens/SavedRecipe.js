import React, { useState, useRef } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet,
  Modal, Image, Animated, Dimensions, TextInput, ScrollView
} from 'react-native';
import { BlurView } from 'expo-blur';
import { Entypo } from '@expo/vector-icons';
import { useSavedRecipes } from '../context/SavedRecipesContext';
import { useNavigation } from '@react-navigation/native';

const screenWidth = Dimensions.get('window').width;
const cardWidth = (screenWidth - 30) / 2;
const SCREEN_HEIGHT = Dimensions.get('window').height;

export default function SavedRecipe() {
  const navigation = useNavigation();
  const { savedRecipes, toggleSaveRecipe, isLoading } = useSavedRecipes();

  const [createdRecipes, setCreatedRecipes] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [newRecipe, setNewRecipe] = useState({
    id: '',
    title: '',
    description: '',
    image: 'https://source.unsplash.com/800x600/?food',
    ingredients: [''],
    steps: [''],
  });
  const [editedRecipe, setEditedRecipe] = useState(null);
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  const openAddModal = () => {
    setNewRecipe({
      id: '',
      title: '',
      description: '',
      image: 'https://source.unsplash.com/800x600/?food',
      ingredients: [''],
      steps: [''],
    });
    setIsAdding(true);
    setIsEditing(false);
    setModalVisible(true);
    slideAnim.setValue(SCREEN_HEIGHT);
    Animated.timing(slideAnim, { toValue: 0, duration: 300, useNativeDriver: true }).start();
  };

  const openViewModal = (recipe) => {
    setSelectedRecipe(recipe);
    setEditedRecipe({ ...recipe });
    setIsEditing(false);
    setIsAdding(false);
    setModalVisible(true);
    slideAnim.setValue(SCREEN_HEIGHT);
    Animated.timing(slideAnim, { toValue: 0, duration: 300, useNativeDriver: true }).start();
  };

  const closeModal = () => {
    Animated.timing(slideAnim, { toValue: SCREEN_HEIGHT, duration: 300, useNativeDriver: true }).start(() => {
      setModalVisible(false);
      setSelectedRecipe(null);
      setEditedRecipe(null);
      setIsAdding(false);
      setIsEditing(false);
    });
  };

  const createRecipe = () => {
    const createdRecipe = {
      ...newRecipe,
      id: Date.now().toString(),
      isUserCreated: true,
    };
    setCreatedRecipes((prev) => [...prev, createdRecipe]);
    closeModal();
  };

  const saveEdits = () => {
    const updatedRecipe = { ...editedRecipe };
    setCreatedRecipes((prev) => prev.map((r) => (r.id === updatedRecipe.id ? updatedRecipe : r)));
    closeModal();
  };

  const addIngredient = (isNew = false) => {
    if (isNew) {
      setNewRecipe({ ...newRecipe, ingredients: [...newRecipe.ingredients, ''] });
    } else {
      setEditedRecipe({ ...editedRecipe, ingredients: [...editedRecipe.ingredients, ''] });
    }
  };

  const addStep = (isNew = false) => {
    if (isNew) {
      setNewRecipe({ ...newRecipe, steps: [...newRecipe.steps, ''] });
    } else {
      setEditedRecipe({ ...editedRecipe, steps: [...editedRecipe.steps, ''] });
    }
  };

  const handleRecipePress = (item) => {
    if (item.isUserCreated) {
      openViewModal(item);
    } else {
      navigation.navigate('RecipeDetail', { recipeId: item.id });
    }
  };

  const renderRecipe = ({ item }) => (
    <View style={styles.cardWrapper}>
      <TouchableOpacity style={styles.card} onPress={() => handleRecipePress(item)}>
        <Image
          source={{ uri: item.image || item.imageURL }}
          style={styles.cardImage}
          resizeMode="cover"
        />
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>{item.title || item.name}</Text>
          <TouchableOpacity onPress={(e) => { e.stopPropagation(); toggleSaveRecipe(item); }}>
            <Entypo name="heart" size={24} color="red" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </View>
  );

  const allRecipes = [...savedRecipes, ...createdRecipes];

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
        <TouchableOpacity onPress={openAddModal} style={styles.addButton}>
          <Text style={styles.buttonText}>+ Add</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={allRecipes}
        numColumns={2}
        keyExtractor={(item) => item.id}
        renderItem={renderRecipe}
        contentContainerStyle={styles.list}
      />

      {/* Recipe Modal for user-created */}
      {modalVisible && (
        <Modal transparent animationType="none" visible={modalVisible}>
          <BlurView intensity={50} style={StyleSheet.absoluteFill} tint="light" />
          <Animated.View style={[styles.modalContent, { transform: [{ translateY: slideAnim }] }]}>
            <ScrollView style={styles.modalBody}>
              {(isEditing || isAdding) ? (
                <>
                  <TextInput
                    style={styles.inputTitle}
                    placeholder="Recipe Title"
                    value={isAdding ? newRecipe.title : editedRecipe.title}
                    onChangeText={(text) => isAdding
                      ? setNewRecipe({ ...newRecipe, title: text })
                      : setEditedRecipe({ ...editedRecipe, title: text })}
                  />
                  <TextInput
                    style={styles.inputText}
                    placeholder="Description"
                    multiline
                    value={isAdding ? newRecipe.description : editedRecipe.description}
                    onChangeText={(text) => isAdding
                      ? setNewRecipe({ ...newRecipe, description: text })
                      : setEditedRecipe({ ...editedRecipe, description: text })}
                  />

                  <Text style={styles.modalSubtitle}>Ingredients:</Text>
                  {(isAdding ? newRecipe.ingredients : editedRecipe.ingredients).map((item, index) => (
                    <TextInput
                      key={index}
                      style={styles.inputText}
                      placeholder="Ingredient"
                      value={item}
                      onChangeText={(text) => {
                        const updated = [...(isAdding ? newRecipe.ingredients : editedRecipe.ingredients)];
                        updated[index] = text;
                        isAdding
                          ? setNewRecipe({ ...newRecipe, ingredients: updated })
                          : setEditedRecipe({ ...editedRecipe, ingredients: updated });
                      }}
                    />
                  ))}
                  <TouchableOpacity onPress={() => addIngredient(isAdding)} style={styles.button}>
                    <Text style={styles.buttonText}>+ Add Ingredient</Text>
                  </TouchableOpacity>

                  <Text style={styles.modalSubtitle}>Steps:</Text>
                  {(isAdding ? newRecipe.steps : editedRecipe.steps).map((step, index) => (
                    <TextInput
                      key={index}
                      style={styles.inputText}
                      placeholder="Step"
                      value={step}
                      onChangeText={(text) => {
                        const updated = [...(isAdding ? newRecipe.steps : editedRecipe.steps)];
                        updated[index] = text;
                        isAdding
                          ? setNewRecipe({ ...newRecipe, steps: updated })
                          : setEditedRecipe({ ...editedRecipe, steps: updated });
                      }}
                    />
                  ))}
                  <TouchableOpacity onPress={() => addStep(isAdding)} style={styles.button}>
                    <Text style={styles.buttonText}>+ Add Step</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={isAdding ? createRecipe : saveEdits}
                    style={styles.button}
                  >
                    <Text style={styles.buttonText}>{isAdding ? 'Create' : 'Save'}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={closeModal} style={styles.button}>
                    <Text style={styles.buttonText}>Cancel</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <Text style={styles.modalTitle}>{selectedRecipe?.title}</Text>
                  <Text style={styles.modalText}>{selectedRecipe?.description}</Text>

                  <Text style={styles.modalSubtitle}>Ingredients:</Text>
                  {selectedRecipe?.ingredients.map((item, index) => (
                    <Text key={index} style={styles.modalText}>• {item}</Text>
                  ))}

                  <Text style={styles.modalSubtitle}>Steps:</Text>
                  {selectedRecipe?.steps.map((step, index) => (
                    <Text key={index} style={styles.modalText}>{index + 1}. {step}</Text>
                  ))}

                  <TouchableOpacity onPress={() => setIsEditing(true)} style={styles.iconButton}>
                    <Entypo name="edit" size={20} color="#fff" />
                  </TouchableOpacity>
                </>
              )}
            </ScrollView>
          </Animated.View>
        </Modal>
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
    width: (Dimensions.get('window').width - 30) / 2,
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

  cardImage: {
    width: '100%',
    height: 120,
    borderRadius: 10,
  },

  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 2,
    width: '100%',
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

  addButton: {
    backgroundColor: '#F8931F',
    padding: 10,
    borderRadius: 25,
  },

  modalContent: {
    position: 'absolute',
    bottom: 0,
    height: Dimensions.get('window').height * 0.9,
    width: '100%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingBottom: 40,
  },

  modalBody: {
    padding: 20,
  },

  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 8,
    textAlign: 'center',
  },

  modalSubtitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 10,
    marginBottom: 5,
  },

  modalText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#333',
    marginTop: 4,
  },

  inputTitle: {
    fontSize: 20,
    borderBottomWidth: 1,
    borderColor: 'gray',
    marginBottom: 20,
    paddingBottom: 5,
  },

  inputText: {
    fontSize: 16,
    borderBottomWidth: 1,
    borderColor: 'gray',
    marginBottom: 20,
    paddingBottom: 5,
  },

  button: {
    marginTop: 5,
    padding: 10,
    marginBottom: 15,
    backgroundColor: '#F8931F',
    borderRadius: 25,
    alignItems: 'center',
  },

  createButton: {
    backgroundColor: '#34C759',
    padding: 12,
    borderRadius: 25,
    marginBottom: 10,
    alignItems: 'center',
  },

  cancelButton: {
    backgroundColor: '#F44336',
    padding: 12,
    borderRadius: 25,
    alignItems: 'center',
  },

  iconButton: {
    marginTop: 20,
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#34C759',
    borderRadius: 25,
    alignItems: 'center',
    flex: 1,
  },

  closeButton: {
    position: 'absolute',
    right: 20,
    top: 20,
    zIndex: 1,
  },
});
