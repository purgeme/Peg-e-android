import React from 'react';
import { ImageBackground, StyleSheet, View, Image, Text, Button } from 'react-native';

const WelcomScreen = ({ navigation}) => {

    const image = require("../assets/BG.png")
    const logo = require("../assets/Peg-e2.png")

    return (
        <ImageBackground
        // source={require("../assets/icon.png")}
        source={image}
        style={styles.background} >
            <View style={styles.logo_container} >
                <Image style={styles.logo} source={logo} />
            </View>
            <View style={styles.loginButton} >
                <Text> Play </Text>
                <Button
                title="Test"
                onPress={() => navigation.navigate('ProfileScreen')}
                />
            </View>
            <View style={styles.registerButton} >
                <Text> Options </Text>
            </View>
        </ImageBackground>
    );
}

const ProfileScreen = ({ navigation, route }) => {
  return <Text>This is s profile</Text>;
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

export default WelcomScreen