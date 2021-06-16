import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from './HomeScreen';
import GameScreen from './Game';
import Success from './success';
import Pause from './pause';
import { NavigationContainer } from '@react-navigation/native';

const Stack = createStackNavigator();

const HomeStack = (
  <Stack.Navigator
    initialRouteName="HomeScreen"
  >
    <Stack.Screen
      name="HomeScreen"
      component={HomeScreen}
    />
    <Stack.Screen
      name="GameScreen"
      component={GameScreen}
    />
    <Stack.Screen
      name="Pause"
      component={Pause}
    />
    <Stack.Screen
      name="Success"
      component={Success}
    />
  </Stack.Navigator>
  // {
  //   HomeScreen,
  //   Pause,
  //   GameScreen,
  //   Success,
  // },
  // {
  //   initialRouteName: 'HomeScreen',
  // }
);

export default function navigator() {
  return <NavigationContainer>{HomeStack}</NavigationContainer>
};