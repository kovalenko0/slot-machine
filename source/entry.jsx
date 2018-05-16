import * as React from "react";
import * as ReactDOM from "react-dom";

class Hello extends React.Component {
  render() {
    return <div>{this.props.message}</div>
  }
}

ReactDOM.render(
    <Hello message="Hello, World!" />,
    document.getElementById("root")
);