// The screen shown when a puzzle is solved
import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  ImageBackground,
  StyleSheet,
  View,
  Image,
  Text,
  Button,
  Pressable,
} from "react-native";
import { CommonActions } from '@react-navigation/native';
import { StackActions } from '@react-navigation/native';

import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

const Success = ({ navigation, route }) => {

  const opacity = useSharedValue(0);
  // Set the opacity value to animate between 0 and 1
  opacity.value = withTiming(1, { duration: 1000, easing: Easing.ease });

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value ,
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#bd93f9",
    borderRadius: 6,
  }), []);

  return(
            <Animated.View style={style} >
              <Text style={styles.successtxt}>You win!!!</Text>
              <Pressable
                style={styles.playButton}
                // onPress={() => navigation.navigate("GameScreen", {button: 'from success restart'})}
                onPress={() => {
                  // navigation.dispatch({...CommonActions.setParams({ button: "from pause resume"}), source: route.params.pkey});
                  // navigation.dispatch(StackActions.pop(1))
                  // navigation.goBack()
                  navigation.push("GameScreen", {button: "restart"})
                }}
              >
                <Text style={styles.playButtontxt}>
                  Restart
                </Text>
              </Pressable>
              <Pressable
                style={styles.playButton}
                onPress={() => navigation.popToTop()}
              >
                <Text style={styles.playButtontxt}>
                  Quit
                </Text>
              </Pressable>
            </Animated.View>
  )
}

const styles = StyleSheet.create({
  success: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#bd93f9",
    borderRadius: 6,
  },
  successtxt: {
    fontSize: 40,
    color: "#ffffff",
    padding: 10,
  },
  playButton: {
    width: "50%",
    height: 70,
    borderRadius: 70 / 3,
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
    backgroundColor: "#00000055",
  },
  playButtontxt: {
    fontSize: 30,
    color: "#ffffff",
  }
})

// Hide the navbar
// {{{
Success.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};
Success.navigationOptions = {
  headerShown: false,
};
// }}}

export default Success