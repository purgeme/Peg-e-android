import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';
import HomeScreen from './HomeScreen';
import GameScreen from './Game';
import Success from './success';
import Pause from './pause';

const HomeStack = createStackNavigator(
  {
    HomeScreen,
    Pause,
    GameScreen,
    Success,
  },
  {
    initialRouteName: 'HomeScreen',
  }
);

export default createAppContainer(HomeStack);