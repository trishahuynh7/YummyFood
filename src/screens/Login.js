import { View, Text, Image, TextInput, TouchableOpacity } from 'react-native';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';

export default function Login() {
    const navigation = useNavigation(); // Hook for navigation

    return (
        <View className="bg-white h-full w-full">
            <StatusBar style="light" />
            <Image className="h-full w-full absolute" source={require('../../assets/images/background1.png')} />

            {/* Login */}
            <View className="flex-row justify-around w-full absolute">
                <Animated.Image 
                    entering={FadeInUp.delay(200).duration(1000).springify()} 
                    className="h-[225] w-[90]" 
                    source={require('../../assets/images/light1.png')} 
                />
                <Animated.Image 
                    entering={FadeInUp.delay(400).duration(1000).springify()}
                    className="h-[160] w-[65]"
                    source={require('../../assets/images/light1.png')} 
                /> 
            </View>

            {/* Title and form */}
            <View className="h-full w-full flex justify-around items-center pt-40 pb-10">
                {/* Title */}
                <View className="flex items-center mb-6 mt-4">
                    <Animated.Text entering={FadeInUp.duration(1000).springify()} className="text-white font-bold tracking-wider text-5xl">
                        Login
                    </Animated.Text>
                </View>
                
                {/* Form */}
                <View className="flex items-center space-y-4 w-[90%]">
                    <Animated.View entering={FadeInDown.duration(1000).springify()} className="bg-black/5 p-4 rounded-2xl w-full">
                        <TextInput 
                            className="w-full text-base text-gray-700" 
                            placeholder="Email" 
                            placeholderTextColor="gray"
                        />
                    </Animated.View>
                    <Animated.View entering={FadeInDown.delay(200).duration(1000).springify()} className="bg-black/5 p-4 rounded-2xl w-full">
                        <TextInput 
                            className="w-full text-base text-gray-700" 
                            placeholder="Password" 
                            placeholderTextColor="gray"
                            secureTextEntry={true}
                        />
                    </Animated.View>
                    <Animated.View entering={FadeInDown.delay(400).duration(1000).springify()} className="w-full">
                        {/* Login Button with Navigation */}
                        <TouchableOpacity 
                            className="w-full bg-sky-400 p-3 rounded-2xl mb-3" 
                            onPress={() => {
                                console.log('Login button pressed');
                                navigation.navigate('HomeScreen'); // Navigate to HomeScreen
                            }}
                        >
                            <Text className="text-xl font-bold text-white text-center">Login</Text>
                        </TouchableOpacity>
                    </Animated.View>
                    <Animated.View entering={FadeInDown.delay(600).duration(1000).springify()} className="flex-row justify-center">
                        <Text>Don't have an account? </Text>
                        <TouchableOpacity onPress={() => navigation.push('Signup')}>
                            <Text className="text-blue-600">Signup</Text>
                        </TouchableOpacity>
                    </Animated.View>
                </View>
            </View>
        </View>
    );
}

