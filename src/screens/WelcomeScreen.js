import React, { useRef, useEffect } from 'react';
import { View, Image, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
import LottieView from 'lottie-react-native';

export default function WelcomeScreen() {
    const animation = useRef(null);
    const navigation = useNavigation();

    useEffect(() => {
        if (animation.current) {
            animation.current.play();
        }

        // Navigate to Login.js after 2.5 seconds
        const timer = setTimeout(() => {
            navigation.navigate('Login'); // Ensure "Login" is the name of your screen in the navigator
        }, 2500);

        return () => clearTimeout(timer); // Cleanup the timer on unmount
    }, [navigation]);

    return (
        <View style={{ flex: 1 }}>
            <Image 
                source={require('../../assets/images/background.png')} 
                style={{ 
                    height: hp(100), 
                    width: hp(150), 
                    position: 'absolute', 
                    top: 0, 
                    left: 0 
                }} 
                resizeMode="cover"
            />

            <StatusBar style="light" />

            <View className="flex-1 justify-center items-center space-y-8">
                <LottieView
                    ref={animation}
                    style={{ height: hp(30), width: wp(30) }}
                    source={require("../../assets/images/foodanimation.json")}
                    autoPlay
                    loop
                />
                <Text className="text-4xl font-bold text-green-500">Yummy Food</Text>
            </View>
        </View>
    );
}
