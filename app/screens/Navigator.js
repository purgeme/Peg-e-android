import React from 'react';
import PropTypes from 'prop-types';
import { ImageBackground, StyleSheet, View, Image, Text, Button, Pressable } from 'react-native';
import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';
import HomeScreen from './HomeScreen';
import GameScreen from './Game';

const HomeStack = createStackNavigator(
  {
    HomeScreen,
    GameScreen,
  },
  {
    initialRouteName: 'HomeScreen',
  }
);

export default createAppContainer(HomeStack);