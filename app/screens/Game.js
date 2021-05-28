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

import CircleButton from "./circle_button";
import Puzzle from "./puzzle";

import { difficulty } from "./variables";
import { size } from "./variables";
import { direction_s } from "./variables";
import { selected_pos } from "./variables";

const GameScreen = ({ navigation, route }) => {
  var x = new Puzzle();

  // Generate the puzzle board
  var tmp = x.generate(10, difficulty);
  var board = tmp[0];
  var num_pegs_left = tmp[1];

  // Function to run when a peg is selected
  function whenSelected(a, b, test) {
    if (test) {
      // Deselect the previous one
      whenSelected(selected_pos.x, selected_pos.y, false);
      selected_pos.x = a;
      selected_pos.y = b;
      // Select it
      refs[a][b].current.setState({ is_selected: true });

      // Highlight possible moves
      for (let i in direction_s) {
        var direction = direction_s[i];
        var val = { x: direction.x + a, y: direction.y + b };
        var nextval = { x: 2 * direction.x + a, y: 2 * direction.y + b };

        if (board[val.x] != undefined && board[nextval.x] != undefined) {
          if (board[val.x][val.y] == 1) {
            if (board[nextval.x][nextval.y] == 0) {
              refs[nextval.x][nextval.y].current.setState({
                is_highlighted: true,
              });
            }
          }
        }
      }
    } else {
      // Deselect it and unhighlight the moves
      refs[a][b].current.setState({ is_selected: false });

      // Highlight possible moves
      for (let i in direction_s) {
        var direction = direction_s[i];
        var val = { x: direction.x + a, y: direction.y + b };
        var nextval = { x: 2 * direction.x + a, y: 2 * direction.y + b };

        if (board[val.x] != undefined && board[nextval.x] != undefined) {
          if (board[val.x][val.y] == 1) {
            if (board[nextval.x][nextval.y] == 0) {
              refs[nextval.x][nextval.y].current.setState({
                is_highlighted: false,
              });
            }
          }
        }
      }
    }
  }

  function whenhighPress(a, b) {
    // De select the previous one
    whenSelected(selected_pos.x, selected_pos.y, false);

    // Set the value of the current one to be 1 in the board
    board[a][b] = 1;

    num_pegs_left -= 1;
    console.log(num_pegs_left);
    if (num_pegs_left == 0) {
      success();
    }
    // Remove the previous two pegs
    refs[selected_pos.x][selected_pos.y].current.setState({
      val: 0,
      is_selected: false,
      is_highlighted: false,
    });
    board[selected_pos.x][selected_pos.y] = 0;
    var dx = (selected_pos.x - a) / 2;
    var dy = (selected_pos.y - b) / 2;
    refs[a + dx][b + dy].current.setState({
      val: 0,
      is_selected: false,
      is_highlighted: false,
    });
    board[a + dx][b + dy] = 0;
  }

  function success() {
    console.log("SUCCESS!!!");
  }

  var refs = new Array();

  function initMat(mat, size) {
    var size = size + 1;
    for (var i = 0; i < size; i++) {
      var x = new Array();
      for (var j = 0; j < size; j++) {
        x.push(React.createRef());
      }
      mat.push(x);
    }
    return mat;
  }

  refs = initMat(refs, size);

  // Dynamically render the grid
  var collist = [];
  for (let i = 0; i < size; i++) {
    var rowlist = [];
    for (let t = 0; t < size; t++) {
      rowlist.push(
        <CircleButton
          ref={refs[i][t]}
          board={board}
          x={i}
          y={t}
          val={board[i][t]}
          key={t}
          is_selected={false}
          ret_selected={whenSelected}
          ret_highlighted={whenhighPress}
        />
      );
    }
    collist.push(
      <View style={styles.Row} key={i}>
        {rowlist}
      </View>
    );
  }

  return <View style={styles.background}>{collist}</View>;
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#282a36",
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
