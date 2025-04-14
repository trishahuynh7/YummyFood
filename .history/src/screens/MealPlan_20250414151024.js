import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';

const sampleMeals = [
  {id: '1', title: 'Breakfast - Oatmeal with Fruits', image: require('../../assets/oatmeal_fruit.jpg')},
  {id: '2', title: 'Grilled Chicken Salad', image: require('../../assets/chicken_salad.jpg')},
  {id: '3', title: 'Spaghetti', image: require('../../assets/spaghetti.jpg')}
];

export default function MealPlan() {
  
  const renderMealItem = ({ item }) => (
    <View style={styles.mealCard}>
      <Image source={item.image} style={styles.mealImage} />
      <Text style={styles.mealTitle}>{item.title}</Text>
    </View>
  );
  
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Plan Your Next Meal</Text>
    <FlatList 
    data={sampleMeals}
    renderItem={renderMealItem}
    keyExtractor={(item) => item.id}
    style={styles.mealList}
    />
    <TouchableOpacity style={styles.addButton}>
    <Text style={styles.addButtonText}>+ Add Meal</Text>
    </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    alignItems: 'center',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  mealList: {
    flexGrow: 0,
  },
  mealCard: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5, 
    elevation: 3,
    alignItems: 'center',
  },
  mealImage: {
    width: '100%',
    height: 120,
    borderRadius: 10,
    marginBottom: 10,
  },
  mealTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  addButton: {
    backgroundColor: '#4CAf50',
    padding: 15,
    borderRadius: 50,
    alignItems: 'center',
    position: 'absolute',
    bottom: 20,
    right: 20,
    elevation: 5,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

