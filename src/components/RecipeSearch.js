import React, { useState, useEffect } from "react";
import { View, Text, TextInput, FlatList } from "react-native";
import { db } from "../constants/firebaseConfig"; // Import Firebase config
import { collection, getDocs } from "firebase/firestore";

const RecipeSearch = () => {
  const [recipes, setRecipes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredRecipes, setFilteredRecipes] = useState([]);

  // Fetch recipes from Firestore
  useEffect(() => {
    const fetchRecipes = async () => {
      const querySnapshot = await getDocs(collection(db, "recipes"));
      const recipeList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setRecipes(recipeList);
    };

    fetchRecipes();
  }, []);

  // Filter recipes by name, ingredients, and description
  useEffect(() => {
    const queryLower = searchQuery.toLowerCase().trim();
    const words = queryLower.split(" "); // Split query into words

    const filtered = recipes.filter(recipe =>
      words.some(word => {
        const regex = new RegExp(word, "i"); // Partial match
        return (
          regex.test(recipe.name) ||
          recipe.ingredients.some(ing => regex.test(ing)) ||
          (recipe.description && regex.test(recipe.description)) // Search in description
        );
      })
    );

    setFilteredRecipes(filtered);
  }, [searchQuery, recipes]);

  return (
    <View style={{ padding: 20 }}>
      <TextInput
        placeholder="Search recipes..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={{ height: 40, borderColor: "gray", borderWidth: 1, marginBottom: 10, padding: 10 }}
      />
      <FlatList
        data={filteredRecipes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Text style={{ fontSize: 18, marginBottom: 5 }}>{item.name}</Text>
        )}
      />
    </View>
  );
};

export default RecipeSearch;
