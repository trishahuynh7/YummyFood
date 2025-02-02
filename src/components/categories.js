import React from 'react';
import { View, Text, Image, TextInput, ScrollView } from 'react-native';
import {categoryData} from '../constants';

export default function Categories() {
	return (
		<View>
			<ScrollView 
			horizontal 
			showsHorizontalScrollIndicator={false} 
			className="space-x-4"
			contentContainerStyle={{paddingLeft: 15}}>
			</ScrollView>
			
		</View>
	);
}