import React, { Component } from 'react';
import { connect } from "react-redux";
import { beginSearch,reset } from "../actions/creators.jsx";

import Graph from './Graph';
import Data from './Data';
import mitt from 'mitt';

class App extends Component {
  constructor(props) {
     super(props);
   }

   componentDidMount() {
     console.log('APP -componentDidMount:');
     this.props.beginSearch_i("mountain");
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

  let beginSearch_i = term => {
    dispatch(beginSearch(term));
  };

  let test = term => {
    dispatch(reset(term));
  };


  return {
    beginSearch_i :test
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
