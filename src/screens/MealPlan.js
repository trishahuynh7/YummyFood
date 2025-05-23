import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, Platform, Alert, ActivityIndicator } from 'react-native';
import * as Calendar from 'expo-calendar';
import DateTimePicker from '@react-native-community/datetimepicker';

const MealPlanScreen = () => {
  const [breakfastMeals, setBreakfastMeals] = useState([]);
  const [lunchMeals, setLunchMeals] = useState([]);
  const [dinnerMeals, setDinnerMeals] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    fetchMeals();
  }, []);

  const fetchMeals = async () => {
    try {
      // Load breakfast, lunch, and dinner separately
      const breakfastResponse = await fetch('https://www.themealdb.com/api/json/v1/1/filter.php?c=Breakfast');
      const lunchResponse = await fetch('https://www.themealdb.com/api/json/v1/1/filter.php?c=Seafood');
      const dinnerResponse = await fetch('https://www.themealdb.com/api/json/v1/1/filter.php?c=Beef');

      const breakfastData = await breakfastResponse.json();
      const lunchData = await lunchResponse.json();
      const dinnerData = await dinnerResponse.json();

      setBreakfastMeals(breakfastData.meals || []);
      setLunchMeals(lunchData.meals || []);
      setDinnerMeals(dinnerData.meals || []);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const getDefaultCalendarSource = async () => {
    const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
    const defaultCalendar = calendars.find(each => each.source.name === 'Default');
    return defaultCalendar?.source || calendars[0]?.source;
  };

  const createCalendarIfNeeded = async () => {
    const defaultSource = await getDefaultCalendarSource();
    const newCalendarID = await Calendar.createCalendarAsync({
      title: 'Meal Plan',
      color: 'blue',
      entityType: Calendar.EntityTypes.EVENT,
      sourceId: defaultSource.id,
      source: defaultSource,
      name: 'Meal Plan Calendar',
      ownerAccount: 'personal',
      accessLevel: Calendar.CalendarAccessLevel.OWNER,
    });
    return newCalendarID;
  };

  const addMealToCalendar = async (meal, date) => {
    try {
      const { status } = await Calendar.requestCalendarPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Calendar permission is required to add meal plans.');
        return;
      }

      const calendars = await Calendar.getCalendarsAsync();
      let calendar = calendars.find(cal => cal.title === 'Meal Plan');
      if (!calendar) {
        const calendarId = await createCalendarIfNeeded();
        calendar = { id: calendarId };
      }

      await Calendar.createEventAsync(calendar.id, {
        title: `Meal: ${meal.strMeal}`,
        startDate: date,
        endDate: new Date(date.getTime() + 60 * 60 * 1000), // 1-hour duration
        timeZone: 'GMT',
        notes: `Meal from MealPlan App.`,
      });

      Alert.alert('Success', 'Meal added to your Calendar!');
    } catch (error) {
      console.error(error);
    }
  };

  const handleMealPress = (meal) => {
    setSelectedMeal(meal);
    setShowDatePicker(true);
  };

  const handleDateChange = (event, date) => {
    if (date) {
      setShowDatePicker(false);
      addMealToCalendar(selectedMeal, date);
    } else {
      setShowDatePicker(false);
    }
  };

  const renderMealItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleMealPress(item)} style={{ flexDirection: 'row', marginVertical: 10, alignItems: 'center' }}>
      <Image
        source={{ uri: item.strMealThumb }}
        style={{ width: 80, height: 80, borderRadius: 8, marginRight: 10 }}
      />
      <Text style={{ fontSize: 18, flexWrap: 'wrap', width: '70%'  }}>{item.strMeal}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#FF6347" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#fff', padding: 20, paddingTop: 60 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 10}}>Meal Plan</Text>
      <Text style={{ fontSize: 18, marginBottom: 1}}>Pick a Meal to Add to Calendar.</Text>

      {/* Breakfast */}
      <Text style={{ fontSize: 22, fontWeight: 'bold', marginTop: 25,  marginBottom: 25, backgroundColor: '#FFEB8D', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8, textAlign: 'center'  }}>🍳 Breakfast</Text>
      <FlatList
        data={breakfastMeals}
        keyExtractor={item => item.idMeal}
        renderItem={renderMealItem}
      />

      {/* Lunch */}
      <Text style={{ fontSize: 22, fontWeight: 'bold', marginTop: 25,  marginBottom: 25, backgroundColor: '#A5D6A7', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8, textAlign: 'center' }}>🥗 Lunch</Text>
      <FlatList
        data={lunchMeals}
        keyExtractor={item => item.idMeal}
        renderItem={renderMealItem}
      />

      {/* Dinner  */}
      <Text style={{ fontSize: 22, fontWeight: 'bold', marginTop: 25, marginBottom: 25, backgroundColor: '#FFCCBC', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8, textAlign: 'center' }}>🍝 Dinner</Text>
      <FlatList
        data={dinnerMeals}
        keyExtractor={item => item.idMeal}
        renderItem={renderMealItem}
      />

      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}
    </View>
  );
};

export default MealPlanScreen;
