import * as React from "react";
import * as ReactDOM from "react-dom";
import { Wheel } from "./wheel"

export class MachineView extends React.Component {
  wheelSymbolImages = [
    '/media/slot-images/strawberry.png',
    '/media/slot-images/banana.png',
    '/media/slot-images/orange.png',
    '/media/slot-images/monkey.png'
  ] 

  render() {
    return <div className="slot-machine">
      <div className="body">
        <div className="wheels">
          {
            this.props.wheels.map(wheel => (
              <Wheel
                key={wheel.id}
                currentSymbol={wheel.currentSymbol}
                symbolImages={this.wheelSymbolImages}
              />
            ))
          }
        </div>
        <div className="controls">
          <button
            disabled={this.props.isSpinning}
            onClick={this.props.onStartClick}
          >
            Start
          </button>
          <button
            disabled={!this.props.isSpinning}
            onClick={this.props.onStopClick}
          >
            Stop
          </button>
        </div>
      </div>
      {
        this.props.reward != null &&
        this.props.resultMessage != null && 
        <div className="result-message">
          <div>{this.props.resultMessage}</div>
          <div>Reward: {this.props.reward}</div>
        </div>
      }
    </div>
  }
}