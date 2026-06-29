import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Add sceens here
import SignUpScreen from '../screens/SignUpScreen';
import HomeScreen from '../screens/HomeScreen';
import BraveStepScreen from '../screens/BraveStepScreen';
import ReflectionSpaceScreen from '../screens/ReflectionSpaceScreen';
import SurveyScreen from '../screens/SurveyScreen';

export type RootStackParamList = {
  SignUp: undefined;
  Home: undefined;
  BraveStep: undefined;
  ReflectionSpace: undefined;
  Survey: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const [initialRoute, setInitialRoute] = useState<'SignUp' | 'Home' | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = await AsyncStorage.getItem('authToken');

    if (token) {
      setInitialRoute('Home');
    } else {
      setInitialRoute('SignUp');
    }
  };

  // Prevent navigator from rendering until auth check finishes
  if (!initialRoute) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={initialRoute}
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="BraveStep" component={BraveStepScreen} />
        <Stack.Screen name="ReflectionSpace" component={ReflectionSpaceScreen} />
        <Stack.Screen name="Survey" component={SurveyScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}