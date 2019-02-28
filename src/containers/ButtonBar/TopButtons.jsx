import React, { Component } from 'react';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavItem from 'react-bootstrap/NavItem';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar';
import {PropTypes,func} from 'prop-types';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import ControlIcon from '@material-ui/icons/OpenWith';
import InfoIcon from '@material-ui/icons/FeedBack';
import './TopButtons.css';

class TopButtons extends Component {

  constructor(props) {
     super(props);

   }

   static defaultProps = {
     isData: true
   };


  render() {

    let buttons;


    let navBarClass = "justify-content-end fixed-top toolbar-offset";
    let navClass = "ml-auto";

    if(this.props.isData){
       navBarClass = "justify-content-end fixed-top";
       navClass = "mr-auto";
    }


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
       <Navbar className={navBarClass} >
           <Nav className ={navClass}>
             <Nav className ="mr-auto">
               {buttons}
             </Nav>
           </Nav>
       </Navbar>
     )
   }

}

export default TopButtons;
