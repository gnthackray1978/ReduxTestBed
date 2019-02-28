import React, { Component } from 'react';
 import Graph from './Graph';
import Data from './Data';
import mitt from 'mitt';

class App extends Component {
  constructor(props) {
     super(props);
   }

   render() {

    return (
        <div >
          <Data/>
          <Graph/>
      
        </div>
    );
  }
}

export default App;
