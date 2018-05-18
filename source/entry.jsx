import * as React from "react";
import * as ReactDOM from "react-dom";
import { Machine } from './containers/machine'
import { MachineView } from "./components/machine";

ReactDOM.render(
    <Machine render={props => <MachineView {...props} />} />,
    document.getElementById("root")
);