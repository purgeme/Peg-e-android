// The screen shown when a puzzle is solved
import React, { Component } from "react"; import PropTypes from "prop-types";
import { CommonActions } from '@react-navigation/native';
import {
  ImageBackground,
  StyleSheet,
  View,
  Image,
  Text,
  Button,
  Pressable,
} from "react-native";

const Pause = ({ navigation, route }) => {

  return(
          <View style={styles.success}>
            <Pressable
              style={styles.playButton}
              // onPress={() => navigation.navigate("GameScreen", {button: "from pause resume"})}
              onPress={() => {
                // navigation.dispatch(CommonActions.setParams({button: "from pause resume"}))
                navigation.goBack()
                // navigation.navigate("GameScreen", {button: "from pause restart"})
                // navigation.push("GameScreen", {button: "resume"})
              }}
            >
              <Text style={styles.playButtontxt}>
                Resume
              </Text>
            </Pressable>
            <Pressable
              style={styles.playButton}
              onPress={() => {
                // navigation.dispatch(CommonActions.setParams({button: "from pause restart"}))
                // navigation.pop()
                navigation.push("GameScreen", {button: "restart"})
                // navigation.navigate("GameScreen", {button: "from pause restart"})
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
          </View>
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
    backgroundColor: "#bd93f9aa",
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
Pause.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};
Pause.navigationOptions = {
  headerShown: false,
};
// }}}

export default Pause