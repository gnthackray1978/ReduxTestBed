import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { Jumbotron, Grid, Row, Col, Image, Button ,Container} from 'react-bootstrap';
import GraphControl from './MapControls/GraphControl.jsx';
import TopButtons from './ButtonBar/TopButtons.jsx';
import { connect } from "react-redux";
import { switchControlVisbility,beginSearch,reset,setRowsPerPage  } from "../actions/creators.jsx";
import VisualisationHandler from "./VisualisationHandler.jsx";

import './graph.css';


class Graph extends Component {

  constructor(props) {
     super(props);

   }

  topButtonClicked = (e) => {
 

    if(e == "controls"){
      if(this.props.controlVisible)
        this.props.switchControlVisbility(false);
      else
        this.props.switchControlVisbility(true);
    }


  }

  componentWillReceiveProps(nextProps) {

  //  console.log('Graph componentWillReceiveProps' );

    if (nextProps.loading !== this.props.loading &&
        nextProps.success !== this.props.success &&
        !nextProps.loading && nextprops.success) {

    }
  }

  render() {
//    console.log('Graph render');


    return (
      <div>
        <VisualisationHandler></VisualisationHandler>

        <TopButtons isData = {false} modeChanged = { this.topButtonClicked }/>

        <Container className="cont-width">


            <Row className="my-row">
              </Row>

              <Row className="my-row">
                </Row>

                <Row className="my-row">
                    <GraphControl modalShow={this.props.controlVisible}/>
                </Row>

        </Container>

      </div>
    )
  }
}


const mapStateToProps = (state, ownProps) => {
  return {
   term: state.term,
   images: state.images,
   status: state.status,
   controlVisible: state.controlVisible,
   ...ownProps
 };
};


const mapDispatchToProps = dispatch => {
  return {
    beginSearch: term => {
      dispatch(beginSearch(term));
    },
    switchControlVisbility: controlVisible => {
      dispatch(switchControlVisbility(controlVisible));
    },
    setRowsPerPage: rowsPerPage => {
      dispatch(setRowsPerPage(rowsPerPage));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Graph);
