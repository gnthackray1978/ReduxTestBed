import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';


const cStyle = {
  position: 'absolute'
};

 class PureCanvas extends React.Component {
  shouldComponentUpdate() { return false; }

  render() {
    return (
      <canvas style={cStyle}
        ref={node => node ? this.props.contextRef(node.getContext('2d')) : null}
      />
    )
  }
}

export default withStyles(cStyle)(PureCanvas);
