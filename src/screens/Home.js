import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Searchbar } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { fetchRecipesFromAPI, fetchCategoriesFromAPI } from './api';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const EXLUDED_CATEGORIES = ['Starter', 'Vegan', 'Breakfast', 'Goat']
  

  const navigation = useNavigation();

  // Fetch all recipes when component mounts
  useEffect(() => {
    fetchRecipes();
    fetchCategories();
  }, []);


  const fetchRecipes = async () => {
    try {
      setLoading(true);
      const recipesList = await fetchRecipesFromAPI();
      
      const filteredList = recipesList.filter(
        meal => !EXLUDED_CATEGORIES.includes(meal.strCategory)
      );

      const formattedRecipes = filteredList.map(meal => ({
        id: meal.idMeal,
        name: meal.strMeal,
        imageURL: meal.strMealThumb,
        description: meal.strInstructions,
        categoryID: meal.strCategory,
        ingredients: extractIngredients(meal)
      }));
      
      setRecipes(formattedRecipes);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching recipes: ", error);
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

  const renameCategory = (originalName) => {
    const map = {
      'Miscellaneous': 'Misc',
      'Vegetarian' : 'Veggie',
    };
    return map[originalName] || originalName;
  };

  const fetchCategories = async () => {
    try {
      const categoriesList = await fetchCategoriesFromAPI();

      const filteredCategories = categoriesList.filter(
        category => !EXLUDED_CATEGORIES.includes(category.strCategory)
      );
      

      const formattedCategories = filteredCategories.map(category => ({
        id: category.strCategory,
        name: renameCategory(category.strCategory),
        icon: getCategoryIcon(category.strCategory) 
      }));
      
      setCategories(formattedCategories);
    } catch (error) {
      console.error("Error fetching categories: ", error);
    }
  };


  const getCategoryIcon = (categoryName) => {
    const iconMap = {
      'Beef': 'food-steak',
      'Chicken': 'food-drumstick',
      'Dessert': 'cake',
      'Lamb': 'food-steak',
      'Miscellaneous': 'food-variant',
      'Pasta': 'pasta',
      'Pork': 'food-steak',
      'Seafood': 'fish',
      'Side': 'bowl-mix',
      'Vegetarian': 'food-apple',
    };
    
    return iconMap[categoryName] || 'bowl'; 
  };

  const handleSearch = () => {
    if (searchQuery.trim() !== '') {
      navigation.navigate('SearchResults', { query: searchQuery, allRecipes: recipes });
    }
  };

  const handleSearchChange = (text) => {
    setSearchQuery(text);
  };

  const handleClear = () => {
    setSearchQuery('');
  };

  const filterByCategory = (categoryName) => {
    navigation.navigate('SearchResults', { 
      categoryId: categoryName, 
      allRecipes: recipes 
    });
  };

  const renderRecipeItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.recipeCard}
      onPress={() => navigation.navigate('RecipeDetail', { recipeId: item.id })}
    >
      <Image 
        source={{ uri: item.imageURL || 'https://via.placeholder.com/150' }} 
        style={styles.image} 
      />
      <Text style={styles.recipeTitle} numberOfLines={1}>{item.name || item.title}</Text>
    </TouchableOpacity>
  );


  const featuredRecipes = recipes.slice(0, 6);

  return (
    <View style={styles.container}>     
      {/* Search Bar */}
      <Searchbar
        placeholder="Search YummyFoods Recipe"
        onChangeText={handleSearchChange}
        value={searchQuery}
        onClear={handleClear}
        onSubmitEditing={handleSearch}
        onIconPress={handleSearch}
        style={styles.searchBar}
      />

      {/* Categories */}
      <View style={styles.categoryContainer}>
        {categories.length > 0 ? (
          <FlatList
            data={categories}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={styles.categoryCircle}
                onPress={() => filterByCategory(item.id)}
              >
                {item.icon && (
                  <MaterialCommunityIcons name={item.icon} size={24} color="white" />
                )}
                <Text style={styles.categoryText}>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
        ) : (

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
    paddingTop: 10,
    backgroundColor: '#fff',
  },
  searchBar: {
    width: '90%',
    marginTop: 0,
    marginBottom: 10,  
    backgroundColor: '#cee8c8'  
  },
  categoryContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 15,
    width: '100%',
    paddingHorizontal: 10,
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
    backgroundColor: '#ffe0cc',
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