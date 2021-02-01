import { StatusBar } from 'expo-status-bar';
import React from 'react';
import {
    StyleSheet,
    Text,
    TouchableNativeFeedback,
    View,
    Image,
    SafeAreaView,
    Button,
    Alert,
    Platform,
    Dimensions,
    ImageBackground,
  } from 'react-native';
import { useDimensions, useDeviceOrientation } from '@react-native-community/hooks';

export default function App() {

  const logo = require("./app/assets/adaptive-icon.png")

  return (
    <View
      style={styles.container} >
        <ImageBackground
          // source={require("./assets/splash.png")}
          source={{ uri: "https://picsum.photos/200/300"}}
          style={styles.bg_image} >
            <View style={{ paddingTop: "10%"}} >
            <Image source={logo} style={styles.home_logo} />
            <Text style={styles.text} >Sell What You Need!!!</Text>
            </View>
        </ImageBackground>
        <View
          style={{
            height: "10%",
            backgroundColor: "#fc5c65",
          }}
        ></View>
        <View
          style={{
            height: "10%",
            backgroundColor: "#4ecdc4",
          }}
        ></View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  bg_image: {
    flex: 1,
  },
  home_logo: {
    // paddingTop: Platform.OS === 'android' ? 0: 0,
    width: 150,
    height: 150,
    alignSelf: "center",
  },
  text: {
    justifyContent: "center",
    alignSelf: "center",
  }
});

// export default BackupApp;