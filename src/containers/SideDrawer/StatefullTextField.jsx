import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import Switch from '@material-ui/core/Switch';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Toolbar from '@material-ui/core/Toolbar';
import TextField from '@material-ui/core/TextField';
import FormLabel  from '@material-ui/core/FormLabel';
import Typography from '@material-ui/core/Typography';
import { connect } from "react-redux";
import {etSideDrawerOptionsVisible,setSubsetFDParams} from "../../actions/creators.jsx";

const styles = theme => ({
  toolBar: {

    minHeight: '0px'
  },
  mygrid:{
    margin: 0,
    padding : 0
  },
  container:{
    width: 380,
    margin: 0,
    padding : 0
  },
  textField: {
    height:25,
    width:120,
    marginTop: 3
  },
  input1:{
    height : 5
  },

  outerContainer :{
    marginLeft : 20,
    marginTop:7,
    padding : 0
  },
  buttonContainer :{
    marginLeft : 13,
    marginTop:50,
    padding : 0
  }

});


class StatefullTextField extends React.Component {

      constructor(props) {
        super(props);

        this.state = {
          value: 'Enter text',
        };
      }

      componentWillReceiveProps() {
        console.log('componentWillReceiveProps: ' + this.props.value);

        if(this.state.value == 'Enter text')
          this.setState({value: this.props.value});

      }
      componentDidMount(){
        console.log('componentDidMount: ' + this.props.value);

        this.setState({value: this.props.value});
      }



      render() {
        const { classes} = this.props;

        return (
          <div>
            <Typography variant="subtitle1" gutterBottom>
              {this.props.label}
            </Typography>
            <TextField
              id="option"
              label={this.props.label}

              value={this.state.value}
              onChange={(event)=>{
                this.setState({
                  value: event.target.value,
                });

                this.props.changed(event.target.value, this.props.label);
              }}
              className={classes.textField}
              InputLabelProps ={{
                shrink: true,
              }}
              InputProps ={{
                classes: { input: classes.input1 }
              }}

              margin="normal"
              variant="outlined"
            />

          </div>
        );
      }
    }

export default withStyles(styles)(StatefullTextField);
