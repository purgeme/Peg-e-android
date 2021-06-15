import React, { Component } from "react";
export class Toggle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
    };
  }
  togglebutton() {
    const { open } = this.state;
    this.setState({
      open: !open,
    });
  }
  render() {
    var { children } = this.props;
    const { open } = this.state;
    return <div>{open && <div>{children}</div>}</div>;
  }
}
export default Toggle;
