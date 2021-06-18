import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import HomeScreen from './HomeScreen';
import GameScreen from './Game';
import Success from './success';
import Failure from './failure';
import Pause from './pause';

const Stack = createStackNavigator();

export default function Navigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="HomeScreen"
      >
        <Stack.Screen
          name="HomeScreen"
          component={HomeScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="GameScreen"
          component={GameScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Pause"
          component={Pause}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Success"
          component={Success}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Failure"
          component={Failure}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
  {/* // {
  //   HomeScreen,
  //   Pause,
  //   GameScreen,
  //   Success,
  // },
  // {
  //   initialRouteName: 'HomeScreen',
  // } */}