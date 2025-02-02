import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Entypo } from '@expo/vector-icons';
import MealPlan from './MealPlan';
import Camera from './Camera';
import SavedRecipe from './SavedRecipe';
import Settings from './Settings';
import Home from './Home'; // Import the Home component

const Tab = createBottomTabNavigator();

const ICONS = {
  Home: 'home',
  MealPlan: 'list',
  Camera: 'camera',
  SavedRecipe: 'save',
  Settings: 'cog',
};

export default function HomeScreen() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          const iconName = ICONS[route.name];
          return <Entypo name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="MealPlan" component={MealPlan} />
      <Tab.Screen name="Camera" component={Camera} />
      <Tab.Screen name="SavedRecipe" component={SavedRecipe} />
      <Tab.Screen name="Settings" component={Settings} />
    </Tab.Navigator>
  );
}