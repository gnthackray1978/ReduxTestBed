import React, { Component } from 'react';
import {PropTypes,func} from 'prop-types'
import Button from 'react-bootstrap/Button';

import IconButton from '@material-ui/core/IconButton';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import ArrowUpward from '@material-ui/icons/ArrowUpward';
import ArrowBackward from '@material-ui/icons/ArrowBack';
import ArrowForward from '@material-ui/icons/ArrowForward';
import ZoomIn from '@material-ui/icons/UnfoldLess';
import ZoomOut from '@material-ui/icons/UnfoldMore';


import './NavButton.css';

NavButton.propTypes = {
    type: PropTypes.oneOf(['LEFT', 'RIGHT', 'UP', 'DOWN', 'ZOOMIN','ZOOMOUT']),
    onClick: func.isRequired,
}

// NavButton.defaultProps = {
//     type: 'LEFT',
//
// }

function NavButton({ onClick, type = 'LEFT' }){
  let directionClass = <IconButton ><ArrowBackward onClick = {onClick}/></IconButton>;

  switch(type){
    case 'LEFT':
      directionClass = <IconButton ><ArrowBackward onClick = {onClick}/></IconButton>;
      break;
    case 'RIGHT':
      directionClass = <IconButton ><ArrowForward onClick = {onClick}/></IconButton>;
      break;
    case 'UP':
      directionClass = <IconButton ><ArrowUpward onClick = {onClick}/></IconButton>;
      break;
    case 'DOWN':
      directionClass = <IconButton ><ArrowDownward onClick = {onClick}/></IconButton>;
      break;
    case 'ZOOMIN':
      directionClass = <IconButton ><ZoomIn onClick = {onClick}/></IconButton>;
      break;
    case 'ZOOMOUT':
      directionClass = <IconButton ><ZoomOut onClick = {onClick}/></IconButton>;
      break;
  }


  return (
    directionClass
  )
}

export default NavButton;
