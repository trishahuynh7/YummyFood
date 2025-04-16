import React, { useState, useRef } from 'react';
import {View, Text, FlatList, TouchableOpacity, StyleSheet,
  Modal, Image, Animated, Dimensions, TextInput, ScrollView,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { Entypo } from '@expo/vector-icons';

// Placeholders for now. 
// Will have to implement data from the db to 
// receive data of saved recipes

// Trying to have an add option to this page
// Will be in Account page for now
// User create recipes should go to Saved Recipes
const savedRecipesData = [
  {
    id: '1',
    title: 'Fluffy Pancakes',
    image: 'https://eatsbythebeach.com/wp-content/uploads/2022/03/Super-Fluffy-Buttermilk-Pancakes-1-Eats-By-The-Beach.jpeg',
    description: 'Light and fluffy pancakes made from scratch.',
    ingredients: ['Flour', 'Eggs', 'Milk'],
    steps: ['Mix ingredients', 'Cook on skillet', 'Serve with syrup'],
  },
  {
    id: '2',
    title: 'Baked Chicken',
    image: 'https://krystelscooking.com/wp-content/uploads/2022/04/roastedchicken.jpg',
    description: 'Juicy oven-baked chicken with herbs.',
    ingredients: ['Chicken', 'Garlic', 'Rosemary'],
    steps: ['Preheat oven', 'Season chicken', 'Bake 40 mins'],
  },
];

const SCREEN_HEIGHT = Dimensions.get('window').height;

const toggleSave = (recipeId) => {
  const [savedRecipeIds, setSavedRecipeIds] = useState(new Set());
  setSavedRecipeIds((prev) => {
    const updated = new Set(prev);
    if (updated.has(recipeId)) {
      updated.delete(recipeId);
    } else {
      updated.add(recipeId);
    }
    return updated;
  });
};

export default function SavedRecipes() {
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedRecipe, setEditedRecipe] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [savedRecipeIds, setSavedRecipeIds] = useState(new Set());
  const [newRecipe, setNewRecipe] = useState({
    id: '',
    title: '',
    description: '',
    ingredients: [''],
    steps: [''],
    image: 'https://source.unsplash.com/800x600/?food',
  });

  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  const openModal = (recipe) => {
    setSelectedRecipe(recipe);
    setEditedRecipe({ ...recipe });
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
      setSelectedRecipe(null);
      setIsEditing(false);
      setIsAdding(false);
      setNewRecipe({
        id: '',
        title: '',
        description: '',
        ingredients: [''],
        steps: [''],
        image: 'https://source.unsplash.com/800x600/?food',
      });
    });
  };

  const saveEdits = () => {
    selectedRecipe.title = editedRecipe.title;
    selectedRecipe.description = editedRecipe.description;
    selectedRecipe.ingredients = editedRecipe.ingredients;
    selectedRecipe.steps = editedRecipe.steps;
    setIsEditing(false);
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

  const createRecipe = () => {
    const newEntry = {
      ...newRecipe,
      id: Date.now().toString(),
    };
    savedRecipesData.push(newEntry);
    closeModal();
  };

  const renderRecipe = ({ item }) => {
    const isSaved = savedRecipeIds.has(item.id);
    return (
      <TouchableOpacity style={styles.card} onPress={() => openModal(item)}>
        <Image source={{ uri: item.image }} style={styles.cardImage} />
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <TouchableOpacity onPress={() => toggleSave(item.id)}>
            <Entypo
              name={isSaved ? 'heart' : 'heart-outlined'}
              size={24}
              color={isSaved ? 'red' : 'gray'}
            />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={savedRecipesData}
        keyExtractor={(item) => item.id}
        renderItem={renderRecipe}
        contentContainerStyle={styles.list}
      />

      {/* Recipe Modal */}
      {modalVisible && (
        <Modal transparent animationType="none" visible={modalVisible}>
          <BlurView intensity={50} style={StyleSheet.absoluteFill} tint="light" />

          <Animated.View
            style={[styles.modalContent, { transform: [{ translateY: slideAnim }] }]}
          >
            <Image
              source={{ uri: isAdding ? newRecipe.image : selectedRecipe?.image }}
              style={styles.modalImage}
            />
            <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
              <Entypo name="circle-with-cross" size={25} color="#FFFFF" />
            </TouchableOpacity>
            <ScrollView style={styles.modalBody}>
              { (isEditing || isAdding) ? (
                <>
                  <TextInput
                    style={styles.inputTitle}
                    placeholder="Recipe Title"
                    value={isAdding ? newRecipe.title : editedRecipe.title}
                    onChangeText={(text) =>
                      isAdding
                        ? setNewRecipe({ ...newRecipe, title: text })
                        : setEditedRecipe({ ...editedRecipe, title: text })
                    }
                  />
                  <TextInput
                    style={styles.inputText}
                    placeholder="Description"
                    value={isAdding ? newRecipe.description : editedRecipe.description}
                    onChangeText={(text) =>
                      isAdding
                        ? setNewRecipe({ ...newRecipe, description: text })
                        : setEditedRecipe({ ...editedRecipe, description: text })
                    }
                    multiline
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
                  <TouchableOpacity onPress={() => setIsEditing(false)} style={styles.button}>
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
  list: {
    paddingHorizontal: 16,
  },
  card: {
    marginBottom: 16,
    borderRadius: 16,
    backgroundColor: '#ffe0cc',
    padding: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  cardImage: {
    width: '100%',
    height: 150,
    borderRadius: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
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
  },
  modalSubtitle: {
    marginTop: 10,
    marginBottom: 5,
    fontWeight: '600',
    fontSize: 16,
  },
  modalText: {
    fontSize: 14,
    color: '#333',
    marginTop: 4,
  },
  inputTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    borderBottomWidth: 0.5,
    borderColor: 'gray',
    marginBottom: 10,
  },
  inputText: {
    fontSize: 15,
    borderBottomWidth: 0.5,
    borderColor: 'gray',
    marginBottom: 5,
    padding: 5,
  },
  button: {
    marginTop: 5,
    padding: 10,
    marginBottom: 15,
    backgroundColor: '#F8931F',
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
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  closeButton: {
    position: 'absolute',
    right: 20,
    top: 20,
    zIndex: 1,
  },
});
