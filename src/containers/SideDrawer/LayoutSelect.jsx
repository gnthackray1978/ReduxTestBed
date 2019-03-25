import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import { connect } from "react-redux";
import {setLayout} from "../../actions/creators.jsx";


const styles = {

  formControl: {
    marginTop: 15,
    marginLeft:10
  },



  label: {

    textAlign: 'center',

  },
};


class LayoutSelect extends Component {
  constructor(props) {
     super(props);
   }

   handleChange = event => {
     this.props.setLayout(event.target.value);
   };


 render() {

   const { classes } = this.props;

   return (
     <FormControl  className={classes.formControl} component="fieldset">
        <FormLabel component="legend">Select Layout</FormLabel>
         <RadioGroup
            aria-label="position"
            name="position"
            value={this.props.layout}
            onChange={this.handleChange}
            row
          >
            <FormControlLabel
              value="forceDirect"
              control={<Radio color="primary" />}
              label="Force Direct"
              labelPlacement="top"
            />
            <FormControlLabel
              value="ancestors"
              control={<Radio color="primary" />}
              label="Ancestors"
              labelPlacement="top"
            />
            <FormControlLabel
              value="descendents"
              control={<Radio color="primary" />}
              label="Descendents"
              labelPlacement="top"
            />

          </RadioGroup>
    </FormControl>
   );
 }

}


const mapStateToProps = state => {
  return {
    layout : state.layout,
  };
};

const mapDispatchToProps = dispatch => {

  return {
    setLayout: (layout) => {
      dispatch(setLayout(layout));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(LayoutSelect));
