import React, { Component } from 'react';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import {PropTypes,func} from 'prop-types';


import NavButton from './NavButton.jsx';
import './GraphControl.css';

class GraphControl extends Component {

  constructor(props) {
     super(props);


   }

   onClick(){

   }

   componentDidMount() {
     console.log('-componentDidMount:');
    // this.props.setClick(this.displayControls, this);
    // this.setState({ modalShow: false });
   }

   // displayControls() {
   //  console.log('-GraphControl setting modalshow:');
   //    if(this.state.modalShow)
   //      this.setState({ modalShow: false });
   //    else
   //      this.setState({ modalShow: true });
   // }



   render(){
     let  result =  <Container className="row-container mt-auto"></Container>;

     if(this.props.modalShow){
       result = <Container className="row-container mt-auto">
         <div className ="board-container">
         <Row className="board-row">
           <Col className="navGridSquare"><NavButton onClick = {this.onClick} type = 'ZOOMIN'/></Col>
           <Col className="navGridSquare"></Col>
           <Col className="navGridSquare"><NavButton onClick = {this.onClick} type = 'UP'/></Col>
           <Col className="navGridSquare"></Col>
         </Row>
         <Row className="board-row">
           <Col className="navGridSquare"></Col>
           <Col className="navGridSquare"><NavButton onClick = {this.onClick} type = 'LEFT'/></Col>
           <Col className="navGridSquare"></Col>
           <Col className="navGridSquare"><NavButton onClick = {this.onClick} type = 'RIGHT'/></Col>
         </Row>
         <Row className="board-row">
           <Col className="navGridSquare"><NavButton onClick = {this.onClick} type = 'ZOOMOUT'/></Col>
           <Col className="navGridSquare"></Col>
           <Col className="navGridSquare"><NavButton onClick = {this.onClick} type = 'DOWN'/></Col>
           <Col className="navGridSquare"></Col>
         </Row>
         </div>
       </Container>
     }

     return(
       result
     );
   }

}

export default GraphControl;
