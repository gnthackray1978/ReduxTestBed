import React, { Component } from 'react';
import { connect } from "react-redux";
import { beginSearch } from "../actions/creators.jsx";

import Graph from './Graph';
import Data from './Data';
import mitt from 'mitt';

class App extends Component {
  constructor(props) {
     super(props);
   }

   componentDidMount() {
     console.log('APP -componentDidMount:');
     this.props.beginSearch_i("Mountains");
   }

   render() {
     console.log('APP -render:');
     const { term, status, images } = this.props;

    return (
        <div >
          <Data/>
          <Graph/>
         
        </div>
    );
  }
}

//export default App;


const mapStateToProps = state => {
  return {
    term: state.term,
    images: state.images,
    status: state.status
  };
};

const mapDispatchToProps = dispatch => {
  return {
    beginSearch_i: term => {
      dispatch(beginSearch(term));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
