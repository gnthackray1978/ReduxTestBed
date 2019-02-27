import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Graph from './Graph';
import Data from './Data';
import Navbar from './ButtonBar/CustomNavbar';
import mitt from 'mitt';
 
class App extends Component {
  constructor(props) {
     super(props);

    this.state = {

       mode: 'graph'
     };
   }

   handleInput = (e) => {
     console.log('mode changed ' + e);
     this.setState({mode: e});
     this.dataClick();
   }



   render() {

    return (
        <div >
          <Navbar modeChanged = { this.handleInput }/>
          <Graph/>
          <Data setClick={click => this.dataClick = click}/>
        </div>
    );
  }
}

export default App;
