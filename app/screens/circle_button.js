import React, { Component } from "react";
import { StyleSheet, View, Pressable } from "react-native";
import { Dimensions } from "react-native";

import { difficulty } from "./variables";
import { size } from "./variables";

const { width, height } = Dimensions.get("window");

class CircleButton extends Component {
  state = {
    x: this.props.x,
    y: this.props.y,
    val: this.props.val,
    is_selected: this.props.is_selected,
    is_highlighted: this.props.is_highlighted,
    ret_selected: this.props.ret_selected,
    ret_highlighted: this.props.ret_highlighted,
  };

  whenPress = () => {
    // Function to run when the circle is pressed

    // Here is a function to deselect the previous one
    if (this.state.val == 1) {
      if (this.state.is_selected) {
        this.props.ret_selected(this.state.x, this.state.y, false);
      } else {
        this.props.ret_selected(this.state.x, this.state.y, true);
      }
    } else if (this.state.val == 0) {
      if (this.state.is_highlighted) {
        this.props.ret_highlighted(this.state.x, this.state.y);
        this.setState({ is_highlighted: false, val: 1, is_selected: false });
      }
    }
  };

  render() {
    const { x, y, is_selected, is_highlighted, val } = this.state;
    return (
      <Pressable
        onPress={() => {
          this.whenPress();
        }}
      >
        {/* <View style={ isHole?hasPeg?styles.PurpleCircle:styles.WhiteCircle:styles.DarkCircle } /> */}
        <View
          style={
            val == 1
              ? is_selected
                ? styles.PurpleSelectedCircle
                : styles.PurpleCircle
              : val == 0
              ? is_highlighted
                ? styles.WhiteSelectedCircle
                : styles.WhiteCircle
              : styles.DarkCircle
          }
        />
      </Pressable>
    );
  }
}

var margin = 10 / difficulty;
var radius = width < height ? width / size : height / size;
var radius = radius - margin * 2;

const styles = StyleSheet.create({
  PurpleCircle: {
    width: radius,
    height: radius,
    borderRadius: radius / 2,
    backgroundColor: "#ff79c6",
    margin: margin,
  },
  PurpleSelectedCircle: {
    width: radius,
    height: radius,
    borderRadius: radius / 2,
    backgroundColor: "#bd93f9",
    margin: margin,
  },
  WhiteCircle: {
    width: radius,
    height: radius,
    borderRadius: radius / 2,
    backgroundColor: "#f8f8f2",
    margin: margin,
  },
  WhiteSelectedCircle: {
    width: radius,
    height: radius,
    borderRadius: radius / 2,
    backgroundColor: "#ffffc6",
    margin: margin,
  },
  DarkCircle: {
    width: radius,
    height: radius,
    borderRadius: radius / 2,
    backgroundColor: "#28fa36",
    margin: margin,
  },
});

export default CircleButton;
