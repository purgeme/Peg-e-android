import React from 'react';
import PropTypes from 'prop-types';
import { ImageBackground, StyleSheet, View, Image, Text, Button, Pressable } from 'react-native';

// This will be the buffer of moves that the player makes to make undoing a move possible.
// The moves can be stored in a string containing the previous and next position of a ball.
// It could also contain if a ball is removed, if it is removed, the automatically from
// the next position.
// Example: previous position in matrix: 2, 3; Next position in matrix: 5, 4; Ball removed: NILL;
// => "2,3=5,4;0"
// Example: previous position in matrix: 2, 3; Next position in matrix: 5, 4; Ball removed: at 5,4;
// => "2,3=5,4;1"
var moves = [];

var len = 20; // The length of the side of the game square

// Rather than passing a pixel value, it might be better to center it using flex and align style options
var cent = [ 500, 500]; // The center of the square, to be the center of the screen probably

// Use the moves buffer to undo a move
function undoMove(){
  return 0;
}

// Save the current move to the moves buffer
function saveMove(){
  return 0;
}

// This will calculate all the possible moves, useful for things like hints.
function aposMoves(){
  return 0;
}

// This will highlight all the positions that the player can move the current ball to if he/she is holding one.
function sposMoves(){
  return 0;
}

// This will find all the balls and their respective positions in the game.
function findBalls(){
  return 0;
}

// This is responsible to find all the holes in the game.
function findHole(){
  return 0;
}

const GameScreen = ({ navigation, route }) => {

  // Game square is basically the square in which there are smaller squares with each small
  // square capable of holding a ball and a hole.


  return (

    <Text
      onPress={() => navigation.navigate('HomeScreen')}
      style={styles.loginButton}
    >This is s profile</Text>
    );
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

GameScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};

GameScreen.navigationOptions = {
  headerShown: false,
};

export default GameScreen;