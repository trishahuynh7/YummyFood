import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen";
import WelcomeScreen from "../screens/WelcomeScreen";
import Login from "../screens/Login";
import Signup from "../screens/Signup";
import RecipeSearch from '../components/RecipeSearch';

const Stack = createNativeStackNavigator();

function AppNavigation() {
    return (
      <NavigationContainer>
          <Stack.Navigator initialRouteName='Welcome' screenOptions={{headerShown: false}}>
              <Stack.Screen name="Login" component={Login}/>
              <Stack.Screen name="Welcome" component={WelcomeScreen}/>
              <Stack.Screen name="Signup" component={Signup}/>
              <Stack.Screen name="HomeScreen" component={HomeScreen}/>
              <Stack.Screen name="RecipeSearch" component={RecipeSearch}/>
          </Stack.Navigator>
      </NavigationContainer>
    );
}

export default AppNavigation;
