import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { Jumbotron, Grid, Row, Col, Image, Button ,Container} from 'react-bootstrap';
import GraphControl from './MapControls/GraphControl.jsx';
import TopButtons from './ButtonBar/TopButtons.jsx';
import { connect } from "react-redux";


import './graph.css';


class Graph extends Component {

  constructor(props) {
     super(props);
//     this.state = {
//         modalShow: false
//     };


   }

  handleInput = (e) => {
    console.log('Graph mode changed ' + e);

  //  this.setState({modalShow: !this.state.modalShow});

  }

  // componentWillReceiveProps(nextProps) {
  //     console.log('Graph- componentWillReceiveProps' + e);
  //     console.log("componentWillReceiveProps triggering...");
  //     console.log("nextProps.objectOfIds ", nextProps);
  //     console.log("nextProps.reduxData.objectOfIds ", nextProps);
  //
  // }

  render() {
    console.log('Graph - render');


    return (
      <div>
        <TopButtons isData = {false} modeChanged = { this.handleInput }/>

        <Container className="cont-width">

        <Row className="my-row">
        </Row>

        <Row className="my-row">
            <Col xs={6} md={4}>

            </Col>
            <Col xs={6} md={4} className="align-self-center">
              <p>{this.props.status}</p>
            </Col>
            <Col xs={6} md={4}>

            </Col>
          </Row>

          <Row className="my-row">
              <GraphControl modalShow={false}/>
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
   ...ownProps
 };
};


const mapDispatchToProps = dispatch => {
  return {
    beginSearch: term => {
      dispatch(beginSearch(term));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Graph);
