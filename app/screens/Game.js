import React, { Component, useState } from "react";
import PropTypes from "prop-types";
import {
  StyleSheet,
  View,
} from "react-native";

import CircleButton from "./circle_button";
import Puzzle from "./puzzle";

import { difficulty } from "./variables";
import { size } from "./variables";
import { direction_s } from "./variables";
import { selected_pos } from "./variables";

import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';


class Game extends Component {

  constructor(props){
    super(props);

    var x = new Puzzle();
    this.navigation = props.navigation;
    this.difficulty = props.difficulty;
    this.size = props.size;
    this.selected_pos = props.selected_pos;
    this.tmp = x.generate(10, this.difficulty)
    this.board = this.tmp[0];
    this.num_pegs_left = this.tmp[1];
    this.refers = new Array(this.size);
    this.refers = this.refMat(this.refers, this.size);
    this.direction_s = props.direction_s;

    this.collist = [];
    for (let i = 0; i < this.size; i++) {
      var rowlist = [];
      for (let t = 0; t < this.size; t++) {
        rowlist.push(
          <CircleButton
            ref={this.refers[i][t]}
            x={i}
            y={t}
            val={this.board[i][t]}
            key={t}
            is_selected={false}
            ret_selected={this.whenSelected}
            ret_highlighted={this.whenhighPress}
          />
        );
      }
      this.collist.push(
        <View style={styles.Row} key={i}>
          {rowlist}
        </View>
      );
    }
  }

  refMat = (mat, size) => {
    var size = size + 1;
    for (var i = 0; i < size; i++) {
      var x = Array(size);
      for (var j = 0; j < size; j++) {
        x[j] = React.createRef();
      }
      mat[i] = x;
    }
    return mat;
  }

  whenhighPress = (a, b) => {
    // De select the previous one
    this.whenSelected(this.selected_pos.x, this.selected_pos.y, false);

    // Set the value of the current one to be 1 in the board
    this.board[a][b] = 1;

    this.num_pegs_left -= 1;
    console.log(this.num_pegs_left);
    if (this.num_pegs_left == 0) {
      console.log("SUCCESS!!")
      this.props.set_opacity();
      this.navigation.navigate("Success")
    }
    // Remove the previous two pegs
    this.refers[this.selected_pos.x][this.selected_pos.y].current.setState({
      val: 0,
      is_selected: false,
      is_highlighted: false,
    });
    this.board[this.selected_pos.x][this.selected_pos.y] = 0;
    var dx = (this.selected_pos.x - a) / 2;
    var dy = (this.selected_pos.y - b) / 2;
    this.refers[a + dx][b + dy].current.setState({
      val: 0,
      is_selected: false,
      is_highlighted: false,
    });
    this.board[a + dx][b + dy] = 0;
  }

  whenSelected = (a, b, test ) => {
    if (test) {
      // Deselect the previous one
      this.whenSelected(this.selected_pos.x, this.selected_pos.y, false);
      this.selected_pos.x = a;
      this.selected_pos.y = b;
      // Select it
      this.refers[a][b].current.setState({ is_selected: true });

      // Highlight possible moves
      for (let i in this.direction_s) {
        var direction = this.direction_s[i];
        var val = { x: direction.x + a, y: direction.y + b };
        var nextval = { x: 2 * direction.x + a, y: 2 * direction.y + b };

        if (this.board[val.x] != undefined && this.board[nextval.x] != undefined) {
          if (this.board[val.x][val.y] == 1) {
            if (this.board[nextval.x][nextval.y] == 0) {
              this.refers[nextval.x][nextval.y].current.setState({
                is_highlighted: true,
              });
            }
          }
        }
      }
    } else {
      // Deselect it and unhighlight the moves
      this.refers[a][b].current.setState({ is_selected: false });

      // Highlight possible moves
      for (let i in this.direction_s) {
        var direction = this.direction_s[i];
        var val = { x: direction.x + a, y: direction.y + b };
        var nextval = { x: 2 * direction.x + a, y: 2 * direction.y + b };

        if (this.board[val.x] != undefined && this.board[nextval.x] != undefined) {
          if (this.board[val.x][val.y] == 1) {
            if (this.board[nextval.x][nextval.y] == 0) {
              this.refers[nextval.x][nextval.y].current.setState({
                is_highlighted: false,
              });
            }
          }
        }
      }
    }
  }

  render() {
    return(
    <View style={styles.background}>
        <View>{this.collist}</View>
    </View>
    )
  }
}

const GameScreen = ({ navigation, route }) => {
  var times = 0;
  const [game, setgame] = React.useState(newGame());
  React.useEffect(() => {
    const unsubscribe = navigation.addListener('didFocus', () => {
      if (times !== 0)
      {
        setgame(newGame());
        opacity.value = withTiming(1, { duration: 2000, easing: Easing.ease });
      }
      times++;

    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);

  function newGame() {
    var nkey = Math.random();
    return <Game key={nkey} navigation={navigation} difficulty={difficulty} size={size} direction_s={direction_s} selected_pos={selected_pos}></Game>
  }

  const opctzero = () => {
    opacity.value = 0
  }

  const opacity = useSharedValue(0);

  // Set the opacity value to animate between 0 and 1
  opacity.value = withTiming(1, { duration: 2000, easing: Easing.ease });

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value ,
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: "center",
    backgroundColor: "#262a36",
    justifyContent: "center",
  }), []);
  console.log(opacity)

  return(
    // <View>
    //   {game}
    // </View>
    <View style={{ backgroundColor: "#282a36"}} >
      <Animated.View style={style} >
        <Game set_opacity={opctzero} key={Math.random()} navigation={navigation} difficulty={difficulty} size={size} direction_s={direction_s} selected_pos={selected_pos}>
        </Game>
      </Animated.View>
    </View>
  )
}


const styles = StyleSheet.create({
  wait: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#282a36",
    zIndex: 1
  },
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#282a36",
    zIndex: 0
  },
  Column: {
    flexDirection: "column",
    paddingLeft: 20,
    paddingRight: 20,
  },
  Row: {
    flexDirection: "row",
  },
});

// Hide the navbar
// {{{
GameScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};
GameScreen.navigationOptions = {
  headerShown: false,
};
// }}}

export default GameScreen;
