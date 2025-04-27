import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Searchbar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { Entypo } from '@expo/vector-icons';
import { db } from './firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';

export default function SearchResults({ route }) {
  const { query, categoryId, allRecipes } = route.params;
  const [searchQuery, setSearchQuery] = useState(query || '');
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const navigation = useNavigation();


  useEffect(() => {

    if (allRecipes) {
      if (categoryId) {
        filterByCategory(categoryId);
      } else if (query) {
        filterBySearchTerm(query);
      }
    } else {

      fetchAndFilterRecipes();
    }
  }, [query, categoryId]);

  const fetchAndFilterRecipes = async () => {
    try {
      setLoading(true);
      let recipesQuery = collection(db, 'recipes');
      
      if (categoryId) {
        recipesQuery = query(recipesQuery, where('categoryID', '==', categoryId));
      }
      
      const recipesSnapshot = await getDocs(recipesQuery);
      const recipesList = recipesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      if (query) {
        const filtered = filterRecipesBySearchTerm(recipesList, query);
        setFilteredRecipes(filtered);
      } else {
        setFilteredRecipes(recipesList);
      }
      
      setLoading(false);
    } catch (error) {
      console.error("Error fetching recipes:", error);
      setLoading(false);
    }
  };

  const filterByCategory = (catName) => {
    setLoading(true);
    const filtered = allRecipes.filter(recipe => recipe.categoryID === catName);
    setFilteredRecipes(filtered);
    setLoading(false);
  };

  const filterBySearchTerm = (term) => {
    setLoading(true);
    const filtered = filterRecipesBySearchTerm(allRecipes, term);
    setFilteredRecipes(filtered);
    setLoading(false);
  };

  const filterRecipesBySearchTerm = (recipes, term) => {
    const searchText = term.toLowerCase();
    
    return recipes.filter(recipe => {
      const name = (recipe.name || recipe.title || '').toLowerCase();
      if (name.includes(searchText)) return true;
      
      const ingredientsMatch = recipe.ingredients?.some(ingredient => 
        typeof ingredient === 'string' && ingredient.toLowerCase().includes(searchText)
      ) || false;
      if (ingredientsMatch) return true;
      
      const description = (recipe.description || '').toLowerCase();
      if (description.includes(searchText)) return true;
      
      const tagsMatch = recipe.tags?.some(tag => 
        typeof tag === 'string' && tag.toLowerCase().includes(searchText)
      ) || false;
      
      return tagsMatch;
    });
  };

  const handleSearch = () => {
    if (searchQuery.trim() !== '') {
      filterBySearchTerm(searchQuery);
    }
  };

  const handleSearchChange = (text) => {
    setSearchQuery(text);
  };

  const handleClear = () => {
    setSearchQuery('');
    if (categoryId) {
      filterByCategory(categoryId);
    } else {
      setFilteredRecipes(allRecipes || []);
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
        <View style={styles.recipeInfo}>
          <Text style={styles.recipeTitle} numberOfLines={1}>{item.name || item.title}</Text>
          <Text style={styles.recipeDescription} numberOfLines={2}>
            {item.description || ''}
          </Text>
        </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>

      {/* Back Button */}
      <TouchableOpacity 
      style={styles.backButton}
      onPress={() => {
         navigation.navigate('HomeScreen', {
            screen: 'Home'
        });
      }}
     >
     <Entypo name="chevron-left" size={24} color="#333" />
    </TouchableOpacity>

      {/* Search Bar */}
      <Searchbar
        placeholder="Refine your search"
        onChangeText={handleSearchChange}
        value={searchQuery}
        onClear={handleClear}
        onSubmitEditing={handleSearch}
        onIconPress={handleSearch}
        style={styles.searchBar}
      />
      
      {/* Results Title */}
      <View style={styles.resultsHeader}>
        <Text style={styles.resultsTitle}>
          {categoryId ? 'Category Results' : 'Search Results'}
        </Text>
        <Text style={styles.resultsCount}>
          {filteredRecipes.length} {filteredRecipes.length === 1 ? 'recipe' : 'recipes'} found
        </Text>
      </View>
      
      {/* Results List */}
      {loading ? (
        <ActivityIndicator size="large" color="#FF6347" style={styles.loader} />
      ) : (
        <FlatList
          data={filteredRecipes}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderRecipeItem}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No recipes found</Text>
              <Text style={styles.emptySubtext}>Try a different search term</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 15,
    paddingTop: 70
  },
  backButton: {
    position: 'absolute',
    bottom: 40,
    left: 25,
    backgroundColor: '#cee8c8',
    padding: 10,
    borderRadius: 50,
    zIndex: 10, 
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  searchBar: {
    marginBottom: 25,
    backgroundColor: '#cee8c8',
  },
  resultsHeader: {
    marginBottom: 15,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  resultsCount: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  listContent: {
    paddingBottom: 20,
  },
  recipeCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    marginBottom: 15,
    padding: 10,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  recipeInfo: {
    flex: 1,
    marginLeft: 15,
  },
  recipeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    marginLeft: 10,
  },
  recipeDescription: {
    fontSize: 14,
    color: '#666',
    marginLeft: 10,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 10,
  },
});