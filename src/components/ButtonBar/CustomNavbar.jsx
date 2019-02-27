import React, { Component } from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import {PropTypes,func} from 'prop-types';
import GraphControl from '../MapControls/GraphControl.jsx';
import CustomButton from './CustomButton.jsx';
import './CustomNavbar.css';

class CustomNavbar extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
        <Navbar className="justify-content-end  fixed-top" >
            <Nav className ="mr-auto">
              <CustomButton  isData = {true} modeChanged = { this.props.modeChanged }/>
            </Nav>

        </Navbar>
    )
  }
}

export default CustomNavbar;
