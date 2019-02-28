import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { Jumbotron, Grid, Row, Col, Image, Button ,Container} from 'react-bootstrap';
import GraphControl from './MapControls/GraphControl.jsx';
import TopButtons from './ButtonBar/TopButtons.jsx';



import './graph.css';


export default class Graph extends Component {

  constructor(props) {
     super(props);
     this.state = {
         modalShow: false
     };


   }

  handleInput = (e) => {
    console.log('Graph mode changed ' + e);
    this.setState({mode: e});
    this.setState({modalShow: !this.state.modalShow});

  }


  render() {



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
              <p>Graph!!</p>
            </Col>
            <Col xs={6} md={4}>

            </Col>
          </Row>

          <Row className="my-row">
              <GraphControl modalShow={this.state.modalShow}/>
          </Row>


        </Container>

      </div>
    )
  }
}
