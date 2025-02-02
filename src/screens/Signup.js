import { View, Text, Image, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';

export default function Signup() {
    const navigation = useNavigation();
    
    return (
        <View className="bg-white h-full w-full">
            <StatusBar style="light" />
            <Image className="h-full w-full absolute" source={require('../../assets/images/background1.png')} />

            {/* Title */}
            <View className="flex items-center mb-6 mt-4 pt-12">
                <Animated.Text entering={FadeInUp.duration(1000).springify()} className="text-white font-bold tracking-wider text-5xl">
                    Sign Up
                </Animated.Text>
            </View>
            
            {/* Form */}
            <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 60 }}>
                <View className="flex items-center space-y-4 w-[90%]">
                    <Animated.View entering={FadeInDown.duration(1000).springify()} style={{ backgroundColor: 'white', padding: 16, borderRadius: 16, borderColor: 'black', borderWidth: 1, width: '100%' }}>
                        <TextInput 
                            style={{ width: '100%', fontSize: 16, color: 'gray' }} 
                            placeholder="Username" 
                            placeholderTextColor="gray"
                        />
                    </Animated.View>
                    <Animated.View entering={FadeInDown.delay(200).duration(1000).springify()} style={{ backgroundColor: 'white', padding: 16, borderRadius: 16, borderColor: 'black', borderWidth: 1, width: '100%' }}>
                        <TextInput 
                            style={{ width: '100%', fontSize: 16, color: 'gray' }} 
                            placeholder="Email" 
                            placeholderTextColor="gray"
                        />
                    </Animated.View>
                    <Animated.View entering={FadeInDown.delay(400).duration(1000).springify()} style={{ backgroundColor: 'white', padding: 16, borderRadius: 16, borderColor: 'black', borderWidth: 1, width: '100%' }}>
                        <TextInput 
                            style={{ width: '100%', fontSize: 16, color: 'gray' }} 
                            placeholder="Password" 
                            placeholderTextColor="gray"
                            secureTextEntry={true}
                        />
                    </Animated.View>    
                    <Animated.View entering={FadeInDown.delay(600).duration(1000).springify()} style={{ backgroundColor: 'white', padding: 16, borderRadius: 16, borderColor: 'black', borderWidth: 1, width: '100%' }}>
                        <TextInput
                            style={{ width: '100%', fontSize: 16, color: 'gray' }}
                            placeholder="First Name"
                            placeholderTextColor="gray"
                        />        
                    </Animated.View>
                    <Animated.View entering={FadeInDown.delay(800).duration(1000).springify()} style={{ backgroundColor: 'white', padding: 16, borderRadius: 16, borderColor: 'black', borderWidth: 1, width: '100%' }}>
                        <TextInput
                            style={{ width: '100%', fontSize: 16, color: 'gray' }}
                            placeholder="Last Name"
                            placeholderTextColor="gray"
                        />        
                    </Animated.View>
                    <Animated.View entering={FadeInDown.delay(1000).duration(1000).springify()} style={{ backgroundColor: 'white', padding: 16, borderRadius: 16, borderColor: 'black', borderWidth: 1, width: '100%' }}>
                        <TextInput
                            style={{ width: '100%', fontSize: 16, color: 'gray' }}
                            placeholder="Phone Number"
                            placeholderTextColor="gray"
                            keyboardType="phone-pad"
                        />        
                    </Animated.View>
                    <Animated.View entering={FadeInDown.delay(1200).duration(1000).springify()} style={{ width: '100%' }}>
                        <TouchableOpacity style={{ width: '100%', backgroundColor: '#38BDF8', padding: 12, borderRadius: 16, marginBottom: 12 }}>
                            <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white', textAlign: 'center' }}>Sign Up</Text>
                        </TouchableOpacity>
                    </Animated.View>
                    <Animated.View entering={FadeInDown.delay(1400).duration(1000).springify()} style={{ flexDirection: 'row', justifyContent: 'center' }}>
                        <Text>Already have an account? </Text>
                        <TouchableOpacity onPress={() => navigation.push('Login')}>
                            <Text style={{ color: '#1E40AF' }}>Login</Text>
                        </TouchableOpacity>
                    </Animated.View>
                </View>
            </ScrollView>
        </View>
    );
}

