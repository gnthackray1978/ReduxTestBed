import React, { Component } from 'react';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import {PropTypes,func} from 'prop-types';


import NavButton from './NavButton.jsx';
import './GraphControl.css';
import { connect } from "react-redux";
import { switchControlVisbility,mapUp,mapDown,mapLeft,mapRight,zoomIn,zoomOut} from "../../actions/creators.jsx";



class GraphControl extends Component {

  constructor(props) {
     super(props);


   }

   onClick(){

   }

   onMouseDown(evt,type){
     console.log('mouse down' + type);
//all down
      switch(type){
        case "ZOOMOUT":
        this.props.zoomOut(true);
        break;
        case "ZOOMIN":
        this.props.zoomIn(true);
        break;
        case "UP":
        this.props.mapUp(true);
        break;
        case "DOWN":
        this.props.mapDown(true);
        break;
        case "LEFT":
        this.props.mapLeft(true);
        break;
        case "RIGHT":
        this.props.mapRight(true);
        break;

      }
   }
   onMouseUp(evt,type){
     console.log('mouse up' + type);

     //all down
      switch(type){
        case "ZOOMOUT":
        this.props.zoomOut(false);
        break;
        case "ZOOMIN":
        this.props.zoomIn(false);
        break;
        case "UP":
        this.props.mapUp(false);
        break;
        case "DOWN":
        this.props.mapDown(false);
        break;
        case "LEFT":
        this.props.mapLeft(false);
        break;
        case "RIGHT":
        this.props.mapRight(false);
        break;

      }
   }

   componentDidMount() {
  //   console.log('-componentDidMount:');
    // this.props.setClick(this.displayControls, this);
    // this.setState({ modalShow: false });
   }

   render(){
     let  result =  <Container className="row-container mt-auto"></Container>;

     if(this.props.modalShow){
       result = <Container className="row-container mt-auto">
         <div className ="board-container">
         <Row className="board-row">
           <Col className="navGridSquare"><NavButton onClick = {this.onClick.bind(this)} onMouseDown ={this.onMouseDown.bind(this)} onMouseUp = {this.onMouseUp.bind(this)} type = 'ZOOMIN'/></Col>
           <Col className="navGridSquare"></Col>
           <Col className="navGridSquare"><NavButton onClick = {this.onClick.bind(this)} onMouseDown ={this.onMouseDown.bind(this)} onMouseUp = {this.onMouseUp.bind(this)} type = 'UP'/></Col>
           <Col className="navGridSquare"></Col>
         </Row>
         <Row className="board-row">
           <Col className="navGridSquare"></Col>
           <Col className="navGridSquare"><NavButton onClick = {this.onClick.bind(this)} onMouseDown ={this.onMouseDown.bind(this)} onMouseUp = {this.onMouseUp.bind(this)} type = 'LEFT'/></Col>
           <Col className="navGridSquare"></Col>
           <Col className="navGridSquare"><NavButton onClick = {this.onClick.bind(this)} onMouseDown ={this.onMouseDown.bind(this)} onMouseUp = {this.onMouseUp.bind(this)} type = 'RIGHT'/></Col>
         </Row>
         <Row className="board-row">
           <Col className="navGridSquare"><NavButton onClick = {this.onClick.bind(this)} onMouseDown ={this.onMouseDown.bind(this)} onMouseUp = {this.onMouseUp.bind(this)} type = 'ZOOMOUT'/></Col>
           <Col className="navGridSquare"></Col>
           <Col className="navGridSquare"><NavButton onClick = {this.onClick.bind(this)} onMouseDown ={this.onMouseDown.bind(this)} onMouseUp = {this.onMouseUp.bind(this)} type = 'DOWN'/></Col>
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

const mapStateToProps = state => {
  return {
    zoomin : state.zoomin,
    zoomout: state.zoomout,
    mapleft: state.mapleft,
    mapright: state.mapright,
    mapup: state.mapup,
    mapdown:state.mapdown,
    status: state.status,

  };
};

const mapDispatchToProps = dispatch => {

  return {

    switchControlVisbility: controlVisible => {
      dispatch(switchControlVisbility(controlVisible));
    },

    zoomIn: isSet=>{
      dispatch(zoomIn(isSet));
    },
    zoomOut: isSet=>{
      dispatch(zoomOut(isSet));
    },
    mapUp : isSet =>{
      dispatch(mapUp(isSet));
    },
    mapDown : isSet =>{
      dispatch(mapDown(isSet));
    },
    mapLeft : isSet =>{
      dispatch(mapLeft(isSet));
    },
    mapRight : isSet =>{
      dispatch(mapRight(isSet));
    }



  };
};

//export default GraphControl;
export default connect(mapStateToProps, mapDispatchToProps)(GraphControl);
