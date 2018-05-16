import * as React from "react";
import * as ReactDOM from "react-dom";

export class Wheel extends React.Component {
  render() {
    const { symbolImages, currentSymbol } = this.props
    const image = symbolImages[currentSymbol]

    return <div className="wheel">
      {
        image != null &&
        <img
          src={image}
          alt={`slot-image-${currentSymbol}`}
          />
      }
    </div>
  }
}