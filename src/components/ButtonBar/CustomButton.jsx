import React, { Component } from 'react';
import Nav from 'react-bootstrap/Nav';
import NavItem from 'react-bootstrap/NavItem';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar';
import {PropTypes,func} from 'prop-types';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import ControlIcon from '@material-ui/icons/OpenWith';
import InfoIcon from '@material-ui/icons/FeedBack';
import './CustomButton.css';

class CustomButton extends Component {

  constructor(props) {
     super(props);

   }

   static defaultProps = {
     isData: true
   };


  render() {

    let buttons;

    if(this.props.isData){
      buttons = <Nav.Link><div onClick={()=>{
           this.props.modeChanged('data');
         }}>Data</div></Nav.Link>;
    }
    else{
      buttons = <ButtonToolbar>
                    <IconButton aria-label="Info" >
                      <InfoIcon  onClick={()=>{ this.props.modeChanged('info'); }}/>
                    </IconButton>
                    <IconButton aria-label="Controls">
                      <ControlIcon  onClick={()=>{ this.props.modeChanged('controls'); }}/>
                    </IconButton>
                </ButtonToolbar>;
    }

     return (
       <Nav className ="mr-auto">
         {buttons}
       </Nav>
     )
   }

}

export default CustomButton;
