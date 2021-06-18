import React, { Component, useState } from "react";
import PropTypes from "prop-types";
import {
  StyleSheet,
  View,
  BackHandler,
} from "react-native";
import { useFocusEffect } from '@react-navigation/native';

import CircleButton from "./circle_button";
import Puzzle from "./puzzle";

import { difficulty } from "./variables";
import { size } from "./variables";
import { direction_s } from "./variables";
import { selected_pos } from "./variables";
import { peg_positions } from "./variables";

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
    this.route = props.route;
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
        if ( this.board[i][t] == 1 ) {
          this.props.peg_pos_push({ x: i, y: t});
        }
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

  peg_pos_push = (obj) => {
    console.log("Pushing: ")
    console.log(obj)
    peg_positions.push(obj);
  }
  peg_pos_pop = (obj) => {
    // peg_positions.push(obj);
    console.log("Poping: ")
    console.log(obj)
    for( var i = 0; i < peg_positions.length; i++){
        if ( peg_positions[i].x === obj.x && peg_positions[i].y == obj.y) {
            peg_positions.splice(i, 1);
            i--;
        }
    }
  }

  failCheck = () => {
    // Iterate over the peg_positions array ( first localize it ) and find if there is at least one move from at least on position in that array
    console.log("Fail checking")
  }

  whenhighPress = (a, b) => {
    // De select the previous one
    this.whenSelected(this.selected_pos.x, this.selected_pos.y, false);

    // Set the value of the current one to be 1 in the board
    this.props.peg_pos_push({ x: a, y: b })
    this.board[a][b] = 1;

    this.num_pegs_left -= 1;
    this.props.nnpegs();
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
    this.props.peg_pos_pop({ x: this.selected_pos.x, y: this.selected_pos.y });
    this.board[this.selected_pos.x][this.selected_pos.y] = 0;
    var dx = (this.selected_pos.x - a) / 2;
    var dy = (this.selected_pos.y - b) / 2;
    this.refers[a + dx][b + dy].current.setState({
      val: 0,
      is_selected: false,
      is_highlighted: false,
    });
    this.props.peg_pos_pop({ x: a + dx, y: b + dy });
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
  var npegs = difficulty+5;
  const [game, setgame] = React.useState(newGame());
  const opacity = useSharedValue(0);
  opacity.value = withTiming(1, { duration: 2000, easing: Easing.ease });


  // For whenever the screen is showed
  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      console.log(peg_positions)
      // if (times !== 0 && npegs == 0)
      if (times !== 0 && route.params.button === "restart")
      {
        setgame(newGame());
      }
      navigation.setParams({button: "none"})
      times++;
      opacity.value = withTiming(1, { duration: 2500, easing: Easing.ease });

    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    // return unsubscribe;
  }, [navigation]);

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        if (npegs !== 0) {
          navigation.navigate("Pause")
          return true;
        } else {
          return false;
        }
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [])
  );


  function newGame() {
    const opctzero = () => {
      opacity.value = 0;
    }
    const nnpegs = () => {
      npegs -= 1;
    }
    const peg_pos_push = (obj) => {
      console.log("Pushing: ")
      console.log(obj)
      peg_positions.push(obj);
    }
    const peg_pos_pop = (obj) => {
      // peg_positions.push(obj);
      console.log("Poping: ")
      console.log(obj)
      for( var i = 0; i < peg_positions.length; i++){
          if ( peg_positions[i].x === obj.x && peg_positions[i].y == obj.y) {
              peg_positions.splice(i, 1);
              i--;
          }
      }
      console.log(peg_positions)
    }
    var nkey = Math.random();
    return <Game nnpegs={nnpegs} peg_pos_pop={peg_pos_pop} peg_pos_push={peg_pos_push} set_opacity={opctzero} key={nkey} navigation={navigation} route={route} difficulty={difficulty} size={size} direction_s={direction_s} selected_pos={selected_pos}></Game>
  }

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

  return(
    <View style={{ position: "absolute", backgroundColor: "#282a36", top: 0, bottom: 0, left: 0, right: 0, alignItems: "center", justifyContent: "center"}} >
      <Animated.View style={style} >
        {game}
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
