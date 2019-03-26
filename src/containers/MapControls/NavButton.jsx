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

function NavButton({ onClick,onMouseDown, onMouseUp, type = 'LEFT' }){
  let directionClass = <IconButton ><ArrowBackward onClick = {onClick}/></IconButton>;

 
  switch(type){
    case 'LEFT':
      directionClass = <IconButton ><ArrowBackward
        onClick ={(evt)=>onClick(evt,'LEFT')}
        onMouseDown ={(evt)=>onMouseDown(evt,'LEFT')}
        onMouseUp={(evt)=>onMouseUp(evt,'LEFT')}/>
    </IconButton>;
      break;
    case 'RIGHT':
      directionClass = <IconButton ><ArrowForward
        onClick ={(evt)=>onClick(evt,'RIGHT')}
        onMouseDown ={(evt)=>onMouseDown(evt,'RIGHT')}
        onMouseUp={(evt)=>onMouseUp(evt,'RIGHT')}/>
    </IconButton>;
      break;
    case 'UP':
      directionClass = <IconButton ><ArrowUpward
        onClick ={(evt)=>onClick(evt,'UP')}
        onMouseDown ={(evt)=>onMouseDown(evt,'UP')}
        onMouseUp={(evt)=>onMouseUp(evt,'UP')}/>
    </IconButton>;
      break;
    case 'DOWN':
      directionClass = <IconButton ><ArrowDownward
        onClick ={(evt)=>onClick(evt,'DOWN')}
        onMouseDown ={(evt)=>onMouseDown(evt,'DOWN')}
        onMouseUp={(evt)=>onMouseUp(evt,'DOWN')}/>
    </IconButton>;
      break;
    case 'ZOOMIN':
      directionClass = <IconButton ><ZoomIn
        onClick ={(evt)=>onClick(evt,'ZOOMIN')}
        onMouseDown ={(evt)=>onMouseDown(evt,'ZOOMIN')}
        onMouseUp={(evt)=>onMouseUp(evt,'ZOOMIN')}/>
    </IconButton>;
      break;
    case 'ZOOMOUT':
      directionClass = <IconButton ><ZoomOut
        onClick ={(evt)=>onClick(evt,'ZOOMOUT')}
        onMouseDown ={(evt)=>onMouseDown(evt,'ZOOMOUT')}
        onMouseUp={(evt)=>onMouseUp(evt,'ZOOMOUT')}/>
    </IconButton>;
      break;
  }


  return (
    directionClass
  )
}

export default NavButton;
