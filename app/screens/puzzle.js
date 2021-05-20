import React, { Component } from "react";
import {
  ImageBackground,
  StyleSheet,
  View,
  Image,
  Text,
  Button,
  Pressable,
  PanResponder,
} from "react-native";
import { diff } from "react-native-reanimated";
import parseErrorStack from "react-native/Libraries/Core/Devtools/parseErrorStack";

// import Point from './components'

class Point {
  constructor() {
    var x = 0;
    var y = 0;
  }
}

function randomthing(x) {
  return x;
}

class Puzzle extends Component {
  constructor() {
    super();
    this.direction_s = [
      { x: 0, y: 1 },
      { x: 1, y: 1 },
      { x: 1, y: 0 },
      { x: 1, y: -1 },
      { x: 0, y: -1 },
      { x: -1, y: -1 },
      { x: -1, y: 0 },
      { x: -1, y: 1 },
    ];
    this.board = new Array();
    this.num_pegs = 0;
  }

  initMat = (mat, size) => {
    var size = size + 1;
    for (var i = 0; i < size; i++) {
      var x = new Array();
      for (var j = 0; j < size; j++) {
        x.push(-1);
      }
      mat.push(x);
    }
    return mat;
  };

  shuffleArray = (array) => {
    let curId = array.length;
    // There remain elements to shuffle
    while (0 !== curId) {
      // Pick a remaining element
      let randId = Math.floor(Math.random() * curId);
      curId -= 1;
      // Swap it with the current element.
      let tmp = array[curId];
      array[curId] = array[randId];
      array[randId] = tmp;
    }
    return array;
  };

  setHasPeg = (hole, value) => {
    this.board[hole.x][hole.y] = value ? 1 : 0;
  };

  isAvailable = (point) => {
    if (this.board[point.x] == undefined) {
      return false;
    } else {
      var x = this.board[point.x][point.y] == -1;
      return x;
    }
  };

  findNextMove = (start_hole, jumped_hole, end_hole) => {
    this.shuffleArray(this.direction_s);
    for (let i in this.direction_s) {
      var direction = this.direction_s[i];
      var a1 = new Point();
      a1.x = direction.x + start_hole.x;
      a1.y = direction.y + start_hole.y;
      jumped_hole = a1;
      a1 = new Point();
      a1.x = direction.x * 2 + start_hole.x;
      a1.y = direction.y * 2 + start_hole.y;
      end_hole = a1;
      if (
        this.isAvailable(jumped_hole) === true &&
        this.isAvailable(end_hole) === true
      ) {
        this.setHasPeg(start_hole, false);
        this.setHasPeg(jumped_hole, true);
        this.setHasPeg(end_hole, true);
        return [true, jumped_hole, end_hole];
      }
    }
    return [false];
  };

  findMoves = (start, loops) => {
    var pegs = [];
    pegs.push(start);

    var jumped_hole = new Point();
    var end_hole = new Point();
    for (let i = 0; i < loops; i++) {
      this.shuffleArray(pegs);
      for (let u in pegs) {
        var start_hole = pegs[u];
        var reval = this.findNextMove(start_hole, jumped_hole, end_hole);
        var tof = reval[0];
        if (tof) {
          jumped_hole = reval[1];
          end_hole = reval[2];
          pegs.pop(start_hole);
          pegs.push(jumped_hole);
          pegs.push(end_hole);
          break;
        }
      }
    }
  };

  generate = (seed, difficulty) => {
    var startx = Math.random();
    var starty = Math.random();
    difficulty += 5;
    this.num_pegs = difficulty;
    this.board = this.initMat(this.board, this.num_pegs);
    var start = { x: this.num_pegs / 2, y: this.num_pegs / 2 };
    this.findMoves(start, this.num_pegs);

    return this.board;
  };
}

export default Puzzle;
