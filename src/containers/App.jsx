import React, { Component } from 'react';
import { connect } from "react-redux";
import { switchControlVisbility,beginSearch,reset } from "../actions/creators.jsx";
import { withStyles } from '@material-ui/core/styles';

import Graph from './Graph';
import Data from './Data';



const styles = theme => ({

});


class App extends Component {
  constructor(props) {
     super(props);
   }

   componentDidMount() {
     console.log('APP -componentDidMount:');
     this.props.switchControlVisbility(false);
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
    status: state.status,
    controlVisible: state.controlVisible,
  };
};

const mapDispatchToProps = dispatch => {

  return {
    beginSearch_i :term => {
      dispatch(reset(term));
    },
    switchControlVisbility: controlVisible => {
      dispatch(switchControlVisbility(controlVisible));
    },
  };
};

//export default connect(mapStateToProps, mapDispatchToProps)(App);
export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(App));
