import React, { useState, useRef } from 'react';
import {View, Text, FlatList, TouchableOpacity, StyleSheet,
  Modal, Image, Animated, PanResponder, Dimensions,
  TextInput, ScrollView } from 'react-native';
import { BlurView } from 'expo-blur';
import { Feather } from '@expo/vector-icons';

// Placeholder recipes. will update soon with saved data.
const savedRecipesData = [
  {
    id: '1',
    title: 'Fluffy Pancakes',
    image: 'https://source.unsplash.com/800x600/?pancakes',
    description: 'Light and fluffy pancakes made from scratch.',
    ingredients: ['Flour', 'Eggs', 'Milk'],
    steps: ['Mix ingredients', 'Cook on skillet', 'Serve with syrup'],
  },
  {
    id: '2',
    title: 'Baked Chicken',
    image: 'https://source.unsplash.com/800x600/?chicken',
    description: 'Juicy oven-baked chicken with herbs.',
    ingredients: ['Chicken', 'Garlic', 'Rosemary'],
    steps: ['Preheat oven', 'Season chicken', 'Bake 40 mins'],
  },
];

const SCREEN_HEIGHT = Dimensions.get('window').height;

export default function SavedRecipes() {
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedRecipe, setEditedRecipe] = useState(null);

  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const scrollY = useRef(0);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return scrollY.current <= 0 && gestureState.dy > 10;
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          slideAnim.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 100) {
          closeModal();
        } else {
          Animated.spring(slideAnim, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

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
    });
  };

  const saveEdits = () => {
    selectedRecipe.title = editedRecipe.title;
    selectedRecipe.description = editedRecipe.description;
    selectedRecipe.ingredients = editedRecipe.ingredients;
    selectedRecipe.steps = editedRecipe.steps;
    setIsEditing(false);
  };

  const addIngredient = () => {
    setEditedRecipe({
      ...editedRecipe,
      ingredients: [...editedRecipe.ingredients, ''],
    });
  };

  const addStep = () => {
    setEditedRecipe({
      ...editedRecipe,
      steps: [...editedRecipe.steps, ''],
    });
  };

  const renderRecipe = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => openModal(item)}>
      <Image source={{ uri: item.image }} style={styles.cardImage} />
      <Text style={styles.cardTitle}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={savedRecipesData}
        keyExtractor={(item) => item.id}
        renderItem={renderRecipe}
        contentContainerStyle={styles.list}
      />

      {modalVisible && (
        <Modal transparent animationType="none" visible={modalVisible}>
          <BlurView intensity={50} style={StyleSheet.absoluteFill} tint="light" />

          <Animated.View
            style={[styles.modalContent, { transform: [{ translateY: slideAnim }] }]}
            {...panResponder.panHandlers}
          >
            <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
              <Feather name="x" size={24} color="#333" />
            </TouchableOpacity>

            <Image source={{ uri: selectedRecipe?.image }} style={styles.modalImage} />
            <ScrollView
              style={styles.modalBody}
              onScroll={(e) => {
                scrollY.current = e.nativeEvent.contentOffset.y;
              }}
              scrollEventThrottle={16}
              contentContainerStyle={{ paddingBottom: 80 }}
            >
              {isEditing ? (
                <>
                  <TextInput
                    style={styles.inputTitle}
                    value={editedRecipe.title}
                    onChangeText={(text) => setEditedRecipe({ ...editedRecipe, title: text })}
                  />
                  <TextInput
                    style={styles.inputText}
                    value={editedRecipe.description}
                    onChangeText={(text) => setEditedRecipe({ ...editedRecipe, description: text })}
                    multiline
                  />

                  <Text style={styles.modalSubtitle}>Ingredients:</Text>
                  {editedRecipe.ingredients.map((item, index) => (
                    <TextInput
                      key={index}
                      style={styles.inputText}
                      value={item}
                      onChangeText={(text) => {
                        const newIngredients = [...editedRecipe.ingredients];
                        newIngredients[index] = text;
                        setEditedRecipe({ ...editedRecipe, ingredients: newIngredients });
                      }}
                    />
                  ))}
                  <TouchableOpacity onPress={addIngredient} style={styles.button}>
                    <Text style={styles.buttonText}>+ Add Ingredient</Text>
                  </TouchableOpacity>

                  <Text style={styles.modalSubtitle}>Steps:</Text>
                  {editedRecipe.steps.map((step, index) => (
                    <TextInput
                      key={index}
                      style={styles.inputText}
                      value={step}
                      onChangeText={(text) => {
                        const newSteps = [...editedRecipe.steps];
                        newSteps[index] = text;
                        setEditedRecipe({ ...editedRecipe, steps: newSteps });
                      }}
                    />
                  ))}
                  <TouchableOpacity onPress={addStep} style={styles.button}>
                    <Text style={styles.buttonText}>+ Add Step</Text>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={saveEdits} style={styles.button}>
                    <Text style={styles.buttonText}>Save</Text>
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
                    <Feather name="edit" size={20} color="#fff" />
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
    paddingTop: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginBottom: 10,
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
  cardImage: {
    width: '100%',
    height: 150,
    borderRadius: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 10,
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
    overflow: 'hidden',
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
    borderBottomWidth: 1,
    marginBottom: 10,
  },
  inputText: {
    fontSize: 14,
    borderBottomWidth: 1,
    marginBottom: 15,
  },
  button: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#f57c00',
    borderRadius: 10,
    alignItems: 'center',
  },
  iconButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#4caf50',
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 16,
    zIndex: 10,
    padding: 8,
  },
});
