import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Searchbar } from 'react-native-paper';
import { Entypo } from '@expo/vector-icons';
import { db } from './firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  
  // Get navigation object
  const navigation = useNavigation();

  // Fetch all recipes when component mounts
  useEffect(() => {
    fetchRecipes();
    fetchCategories();
  }, []);

  // Fetch recipes from Firestore
  const fetchRecipes = async () => {
    try {
      setLoading(true);
      const recipesCollection = collection(db, 'recipes');
      const recipesSnapshot = await getDocs(recipesCollection);
      const recipesList = recipesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setRecipes(recipesList);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching recipes: ", error);
      setLoading(false);
    }
  };

  // Fetch food categories
  const fetchCategories = async () => {
    try {
      const categoriesCollection = collection(db, 'categories');
      const categoriesSnapshot = await getDocs(categoriesCollection);
      const categoriesList = categoriesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setCategories(categoriesList);
    } catch (error) {
      console.error("Error fetching categories: ", error);
    }
  };

  // Handle search submission
  const handleSearch = () => {
    if (searchQuery.trim() !== '') {
      // Navigate to search results page with the search query
      navigation.navigate('SearchResults', { query: searchQuery, allRecipes: recipes });
    }
  };

  // Handle search text change
  const handleSearchChange = (text) => {
    setSearchQuery(text);
  };

  const handleClear = () => {
    setSearchQuery('');
  };

  // Filter recipes by category
  const filterByCategory = (categoryId) => {
    // Navigate to search results page with the category filter
    navigation.navigate('SearchResults', { categoryId, allRecipes: recipes });
  };

  const renderRecipeItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.recipeCard}
      onPress={() => navigation.navigate('RecipeDetail', { recipeId: item.id })}
    >
      <Image 
        source={{ uri: item.imageUrl || 'https://via.placeholder.com/150' }} 
        style={styles.image} 
      />
      <Text style={styles.recipeTitle} numberOfLines={1}>{item.name || item.title}</Text>
    </TouchableOpacity>
  );

  // Show some featured recipes on the home page
  const featuredRecipes = recipes.slice(0, 4); // Just show first 4 recipes as featured

  return (
    <View style={styles.container}>     
      {/* Search Bar */}
      <Searchbar
        placeholder="Search YummyFoods Recipe"
        onChangeText={handleSearchChange}
        value={searchQuery}
        onClear={handleClear}
        onSubmitEditing={handleSearch} // Add this to handle search on submit
        onIconPress={handleSearch} // Add this to handle search on icon press
        style={styles.searchBar}
      />

      {/* Categories */}
      <View style={styles.categoryContainer}>
        {categories.length > 0 ? (
          categories.map((category) => (
            <TouchableOpacity 
              key={category.id} 
              style={styles.categoryCircle}
              onPress={() => filterByCategory(category.id)}
            >
              {category.icon && (
                <Entypo name={category.icon} size={24} color="white" />
              )}
              <Text style={styles.categoryText}>{category.name}</Text>
            </TouchableOpacity>
          ))
        ) : (
          // Fallback to the default circles if no categories are loaded
          [1, 2, 3, 4].map((item, index) => (
            <View key={index} style={styles.categoryCircle} />
          ))
        )}
      </View>

      {/* Loading indicator */}
      {loading ? (
        <ActivityIndicator size="large" color="#FF6347" style={styles.loader} />
      ) : (
        <>
          {/* Featured Recipes Section */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Featured Recipes</Text>
            <FlatList
              data={featuredRecipes}
              numColumns={2}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderRecipeItem}
              ListEmptyComponent={
                <Text style={styles.emptyText}>No recipes available</Text>
              }
              style={styles.recipeList}
            />
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 20,
    backgroundColor: '#fff',
  },
  searchBar: {
    width: '90%',
    marginTop: 0,
    marginBottom: 20,  
    backgroundColor: '#cee8c8'  
  },
  categoryContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 15,
    width: '100%',
  },
  categoryCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'orange',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  categoryText: {
    color: 'white',
    fontSize: 10,
    marginTop: 4,
  },
  sectionContainer: {
    width: '100%',
    marginBottom: 20,
    paddingHorizontal: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    marginLeft: 5,
  },
  recipeList: {
    width: '100%',
  },
  recipeCard: {
    flex: 1,
    margin: 5,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#f9f9f9',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  image: {
    width: '100%',
    height: 120,
    borderRadius: 10,
  },
  recipeTitle: {
    padding: 8,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#888',
  },
});