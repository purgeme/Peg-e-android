import React, { Component, useState } from "react";
import PropTypes from "prop-types";
import {
  StyleSheet,
  View,
  Text,
  Pressable,
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
// import { steps } from "./variables";

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
    this.peg_positions = props.peg_positions;
    this.steps = new Array();
    this.refers = new Array(this.size);
    this.refers = this.refMat(this.refers, this.size);
    this.direction_s = props.direction_s;

    this.collist = [];
    for (let i = 0; i < this.size; i++) {
      var rowlist = [];
      for (let t = 0; t < this.size; t++) {
        if ( this.board[i][t] == 1 ) {
          this.peg_pos_push({ x: i, y: t});
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
    this.peg_positions.push(obj);
  }
  peg_pos_pop = (obj) => {
    // peg_positions.push(obj);
    for( var i = 0; i < this.peg_positions.length; i++){
        if ( this.peg_positions[i].x === obj.x && this.peg_positions[i].y == obj.y) {
            this.peg_positions.splice(i, 1);
            i--;
        }
    }
  }

  failCheck = () => {
    // Iterate over the peg_positions array ( first localize it ) and find if there is at least one move from at least on position in that array
    for ( var u = 0; u < this.peg_positions.length; u++){
      var start_hole = peg_positions[u];
      for ( let i in this.direction_s){
        var direction = this.direction_s[i];
        var a1 = {x:0,y:0};
        a1.x = direction.x + start_hole.x;
        a1.y = direction.y + start_hole.y;
        if ( this.board[a1.x] != undefined) {
          if ( this.board[a1.x][a1.y] == 1) {
            var a2 = {x:0,y:0};
            a2.x = direction.x*2 + start_hole.x;
            a2.y = direction.y*2 + start_hole.y;
            if ( this.board[a2.x] != undefined){
              if ( this.board[a2.x][a2.y] == 0){
                return false;
              }
            }
          }
        }
      }
    }
    return true;
  }

  undo = () => {
    console.log("Undoing")
    var tstep = this.steps.pop()
    if( tstep != undefined ){
      this.board[tstep[0].x][tstep[0].y] = 1;
      this.refers[tstep[0].x][tstep[0].y].current.setState({
        val: 1,
        is_selected: false,
        is_highlighted: false,
      });
      this.whenSelected(tstep[0].x, tstep[0].y, true);
      this.board[tstep[1].x][tstep[1].y] = 1;
      this.refers[tstep[1].x][tstep[1].y].current.setState({
        val: 1,
        is_selected: false,
        is_highlighted: false,
      });
      this.board[tstep[2].x][tstep[2].y] = 0;
      this.refers[tstep[2].x][tstep[2].y].current.setState({
        val: 0,
        is_selected: false,
        is_highlighted: true,
      });
      this.num_pegs_left++;
    }
  }

  whenhighPress = (a, b) => {
    var tmp = new Array();
    // De select the previous one
    this.whenSelected(this.selected_pos.x, this.selected_pos.y, false);

    // Set the value of the current one to be 1 in the board
    this.peg_pos_push({ x: a, y: b })
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
    this.peg_pos_pop({ x: this.selected_pos.x, y: this.selected_pos.y });
    this.board[this.selected_pos.x][this.selected_pos.y] = 0;
    var dx = (this.selected_pos.x - a) / 2;
    var dy = (this.selected_pos.y - b) / 2;
    this.refers[a + dx][b + dy].current.setState({
      val: 0,
      is_selected: false,
      is_highlighted: false,
    });
    this.peg_pos_pop({ x: a + dx, y: b + dy });
    this.board[a + dx][b + dy] = 0;
    if (this.failCheck() && this.num_pegs_left != 0){
      console.log("FAILED!!")
      this.props.set_opacity();
      this.navigation.navigate("Failure");
    }
    tmp.push({ x: this.selected_pos.x, y: this.selected_pos.y})
    tmp.push({ x: a+dx, y: b+dy})
    tmp.push({ x: a, y: b})
    console.log(tmp)
    this.steps.push(tmp)
    console.log("This is the steps variable outside of the game class")
    console.log(this.steps)
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

      // Unhighlight possible moves
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
        {/* <View style={{ flex: 5}} >{this.collist}</View> */}
        <View>{this.collist}</View>
    </View>
    )
  }
}

const GameScreen = ({ navigation, route }) => {
  var times = 0;
  var npegs = difficulty+5;
  var ngame = newGame();
  const [game, setgame] = React.useState(ngame[0]);
  const [newref, setnewref] = React.useState(ngame[1]);
  const opacity = useSharedValue(0);
  opacity.value = withTiming(1, { duration: 2000, easing: Easing.ease });


  // For whenever the screen is showed
  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // if (times !== 0 && npegs == 0)
      if (times !== 0 && route.params.button === "restart")
      {
        var ngame = newGame();
        setgame(ngame[0]);
        setnewref(ngame[1]);
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
    var nref = React.createRef();
    var nkey = Math.random();
    // return <Game nnpegs={nnpegs} steps={steps} peg_positions={peg_positions} set_opacity={opctzero} key={nkey} navigation={navigation} route={route} difficulty={difficulty} size={size} direction_s={direction_s} selected_pos={selected_pos}></Game>
    return [ <Game nnpegs={nnpegs} ref={nref} peg_positions={peg_positions} set_opacity={opctzero} key={nkey} navigation={navigation} route={route} difficulty={difficulty} size={size} direction_s={direction_s} selected_pos={selected_pos}></Game> , nref ]
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
      <View style={{ flex: 1, backgroundColor: "#282a36", padding: 0}}/>
      <View style={{ flex: 1, margin: 10, alignItems: "center", justifyContent: "center"}}>
        <Pressable
          style={styles.playButton}
          onPress={() => {
            newref.current.undo();
          }}
          // onPress={() => navigation.navigate("GameScreen", {button: "start"})}
        >
          <Text style={{ padding: 20}}>
            Undo
          </Text>
        </Pressable>
        {/* Testing shit out */}
      </View>
      <Animated.View style={{ flex: 5 }} >
        {game}
      </Animated.View>
      {/* This is going to be the undo button */}
      <View style={{ flex: 1, margin: 10, alignItems: "center", justifyContent: "center"}}>
        <Pressable
          style={styles.playButton}
          onPress={() => navigation.navigate("Pause")}
        >
          <Text style={{ padding: 20}}>
            Pause
          </Text>
        </Pressable>
        {/* Testing shit out */}
      </View>
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
    // flex: 1,
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
  playButton: {
    width: "50%",
    height: 70,
    marginBottom: 100,
    borderRadius: 70 / 3,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff55",
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
