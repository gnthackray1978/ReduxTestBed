import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';

import PureCanvas from "./PureCanvas.jsx";


export default class GraphContainer extends React.Component {
  constructor(props) {
    super(props);
    this.saveContext = this.saveContext.bind(this);
  }

  saveContext(ctx) {
    this.props.contextCreated(ctx);
  }

  componentDidUpdate() {
    this.props.drawFrame();
  }

  render() {
    return <PureCanvas contextRef={this.saveContext}></PureCanvas>;
  }
}
