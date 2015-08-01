/*global document:false*/
import React from "react";
import {VictoryChart} from "../src/index";
import _ from "lodash";

const twoLinesData = [
  _.range(0, 100, 1).map((x) => {return {x, y: Math.sin(x)}}),
  _.range(0, 100, 1).map((x) => {return {x, y: Math.sin(x + 5)}}),
  _.range(0, 100, 1).map((x) => {return {x, y: Math.sin(x + 10)}})
];

class App extends React.Component {

  render() {
    return (
      <div className="demo">
        <p>
          <VictoryChart />
          <VictoryChart y={(x) => Math.sin(x)}/>
          <VictoryChart y={[(x) => Math.sin(x),
                            (x) => Math.sin(x + 5)
                            (x) => Math.sin(x + 10)]}
                        sample={25} />
          <VictoryChart data={twoLinesData}/>
        </p>
      </div>
    );
  }
}

const content = document.getElementById("content");

React.render(<App/>, content);
