import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Create the context
const SavedRecipesContext = createContext();

// Custom hook to use the context
export const useSavedRecipes = () => useContext(SavedRecipesContext);

// Provider component
export const SavedRecipesProvider = ({ children }) => {
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load saved recipes from storage when the app starts
  useEffect(() => {
    const loadSavedRecipes = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem('savedRecipes');
        if (jsonValue !== null) {
          setSavedRecipes(JSON.parse(jsonValue));
        }
      } catch (error) {
        console.error('Failed to load saved recipes', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSavedRecipes();
  }, []);

  // Save recipes to storage whenever they change
  useEffect(() => {
    const saveToStorage = async () => {
      try {
        const jsonValue = JSON.stringify(savedRecipes);
        await AsyncStorage.setItem('savedRecipes', jsonValue);
      } catch (error) {
        console.error('Failed to save recipes', error);
      }
    };

    if (!isLoading) {
      saveToStorage();
    }
  }, [savedRecipes, isLoading]);

  // Check if a recipe is saved
  const isRecipeSaved = (recipeId) => {
    return savedRecipes.some(recipe => recipe.id === recipeId);
  };

  // Toggle save/unsave a recipe
  const toggleSaveRecipe = (recipe) => {
    if (isRecipeSaved(recipe.id)) {
      setSavedRecipes(savedRecipes.filter(item => item.id !== recipe.id));
    } else {
      setSavedRecipes([...savedRecipes, recipe]);
    }
  };

  // Add a new user-created recipe
  const addUserRecipe = (recipe) => {
    const newRecipe = {
      ...recipe,
      id: recipe.id || Date.now().toString(),
      userCreated: true
    };
    setSavedRecipes([...savedRecipes, newRecipe]);
    return newRecipe;
  };

  // Update an existing recipe
  const updateRecipe = (updatedRecipe) => {
    setSavedRecipes(
      savedRecipes.map(recipe => 
        recipe.id === updatedRecipe.id ? updatedRecipe : recipe
      )
    );
  };

  // Delete a recipe
  const deleteRecipe = (recipeId) => {
    setSavedRecipes(savedRecipes.filter(recipe => recipe.id !== recipeId));
  };

  // Provide the context values to consumer components
  return (
    <SavedRecipesContext.Provider 
      value={{ 
        savedRecipes, 
        isRecipeSaved, 
        toggleSaveRecipe,
        addUserRecipe,
        updateRecipe,
        deleteRecipe,
        isLoading 
      }}
    >
      {children}
    </SavedRecipesContext.Provider>
  );
};