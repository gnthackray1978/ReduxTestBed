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
import {etSideDrawerOptionsVisible} from "../../actions/creators.jsx";


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
    }
  });

   class Options extends Component {

     constructor(props) {
        super(props);

     }

     componentDidMount() {

     }


     render() {

      const { classes } = this.props;

      return (
        <div>
          <div className = {classes.outerContainer}>
               <Typography variant="subtitle1" gutterBottom>
                 Dates Between
               </Typography>
               <Grid container className = {classes.container}>
                 <Grid item xs={5}  className = {classes.mygrid}>
                   <TextField
                     id="filled-name"
                     label="Start"
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
                 </Grid>
                 <Grid item xs={5}>
                   <TextField
                     id="filled-name"
                     label="End"
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
                 </Grid>
               </Grid>

           </div>



           <div className = {classes.outerContainer}>
             <Grid container className = {classes.container}>
               <Grid item xs={5}>
                <Typography variant="subtitle1" gutterBottom>
                  Start Date
                </Typography>
                <TextField
                  id="filled-name"
                  label="Speed"
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
               </Grid>
              <Grid item xs={5}>
                <Typography variant="subtitle1" gutterBottom>
                  Set Speed
                </Typography>
                <TextField
                  id="filled-name"
                  label="Speed"
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
              </Grid>
            </Grid>
            </div>

            <div className = {classes.outerContainer}>
              <Grid container className = {classes.container}>
                <Grid item xs={5}>
                 <Typography variant="subtitle1" gutterBottom>
                   Increment
                 </Typography>
                 <TextField
                   id="filled-name"
                   label="Speed"
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
                </Grid>

             </Grid>
             </div>



             <div className = {classes.outerContainer}>
               <Grid container className = {classes.container}>
                 <Grid item xs={5}>
                  <Typography variant="subtitle1" gutterBottom>
                    Zoom Threshold
                  </Typography>
                  <TextField
                    id="filled-name"
                    label="Speed"
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
                 </Grid>
                <Grid item xs={5}>
                  <Typography variant="subtitle1" gutterBottom>
                     Node Threshold
                  </Typography>
                  <TextField
                    id="filled-name"
                    label="Speed"
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
                </Grid>
              </Grid>
              </div>

        </div>
      );
    }
  }



  const mapStateToProps = state => {
    return {
      status: state.status,
    };
  };

  const mapDispatchToProps = dispatch => {
    return {
      setSideDrawerOptionsVisible :visible=>{
        dispatch(setSideDrawerOptionsVisible(visible))
      }
    };
  };

  export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Options));
