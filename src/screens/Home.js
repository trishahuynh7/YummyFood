import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, ActivityIndicator, TextInput, Modal, Button } from 'react-native';
import { Searchbar } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker'; // Import the image picker
import { fetchRecipesFromAPI, fetchCategoriesFromAPI } from './api';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [profilePicture, setProfilePicture] = useState(null);
  const [showFilter, setShowFilter] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [notifications, setNotifications] = useState(3); // example: 3 notifications

  const EXLUDED_CATEGORIES = ['Starter', 'Vegan', 'Breakfast', 'Goat'];

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
    setSelectedCategory(categoryName);
    setShowFilter(false);
    navigation.navigate('SearchResults', { 
      categoryId: categoryName, 
      allRecipes: recipes 
    });
  };

  // Profile Picture Upload function
  const handleProfilePicUpload = async () => {
    // Ask for camera roll permissions (if not granted already)
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission to access camera roll is required!');
      return;
    }

    // Open the image picker
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1], // Aspect ratio for the profile picture (square)
      quality: 1, // Full quality image
    });

    if (!result.cancelled) {
      setProfilePicture(result.uri); // Set the selected image URI
    }
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
      {/* Header with Profile Picture, Notifications, and Filter Icon */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleProfilePicUpload}>
          <Image
            source={{ uri: profilePicture || 'https://www.w3schools.com/w3images/avatar2.png' }}
            style={styles.profilePic}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Notifications')}>
          <MaterialCommunityIcons name="bell" size={28} color="black" />
          {notifications > 0 && <View style={styles.notificationBadge}><Text style={styles.notificationText}>{notifications}</Text></View>}
        </TouchableOpacity>
        {/* Filter Icon */}
        <TouchableOpacity onPress={() => setShowFilter(true)}>
          <MaterialCommunityIcons name="filter" size={28} color="black" />
        </TouchableOpacity>
      </View>
      
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

      {/* Filter Modal */}
      <Modal
        visible={showFilter}
        onRequestClose={() => setShowFilter(false)}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.filterTitle}>Select Category</Text>
            <FlatList
              data={categories}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={styles.filterOption}
                  onPress={() => filterByCategory(item.id)}
                >
                  <Text style={styles.filterText}>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
            <Button title="Close" onPress={() => setShowFilter(false)} />
          </View>
        </View>
      </Modal>

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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    padding: 10,
    alignItems: 'center',
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#ccc',
  },
  notificationBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: 'red',
    borderRadius: 10,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  searchBar: {
    width: '90%',
    marginTop: 10,
    backgroundColor: '#cee8c8'  
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  filterTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  filterOption: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  filterText: {
    fontSize: 16,
  },
  categoryContainer: {
    flexDirection: 'row',
    marginTop: 20,
    paddingHorizontal: 10,
  },
  categoryCircle: {
    backgroundColor: '#FF6347',
    borderRadius: 40,
    height: 80,
    width: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  categoryText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  sectionContainer: {
    marginTop: 20,
    width: '90%',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  recipeCard: {
    width: '48%',
    margin: 5,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#f9f9f9',
  },
  image: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  recipeTitle: {
    padding: 10,
    fontSize: 14,
    fontWeight: 'bold',
  },
  loader: {
    marginTop: 50,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 18,
  },
  recipeList: {
    marginTop: 10,
  },
});
