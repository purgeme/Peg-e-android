
import React from 'react';
import PropTypes from 'prop-types';
import { ImageBackground, StyleSheet, View, Image, Text, Button, Pressable } from 'react-native';

const HomeScreen = ({ navigation }) => {

    const image = require("../assets/BG.png")
    const logo = require("../assets/Peg-e2.png")

  return (
        <ImageBackground
        source={image}
        style={styles.background} >
            <View style={styles.logo_container} >
                <Image style={styles.logo} source={logo} />
            </View>
            <Pressable
              style={styles.loginButton}
              onPress={() => navigation.navigate('GameScreen')} >
              <Text
                // onPress={() => navigation.navigate('ProfileScreen')}
              >
                Test
              </Text>
            </Pressable>
            <View style={styles.registerButton} >
                <Text> Options </Text>
            </View>
        </ImageBackground>
  );
};
HomeScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};

HomeScreen.navigationOptions = {
  headerShown: false,
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    loginButton: {
        width: "50%",
        height: 70,
        marginBottom: 100,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#00000055",
    },
    registerButton: {
        width: "50%",
        height: 70,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#4ecdc4aa",
    },
    logo: {
        width: 150,
        height: 150,
    },
    logo_container: {
        position: "absolute",
        alignItems: "center",
        top: "10%",
    },
})

export default HomeScreen;