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

   class Options extends Component {

     constructor(props) {
        super(props);

     }

     componentDidMount() {

     }


     render() {

       // stiffness :state.stiffness,
       // repulsion :state.repulsion,
       // damping : state.damping,
       // speed :state.speed,
       // increment :state.increment,
       // year : state.year,
       // sublayoutZoom:state.sublayoutZoom,
       // sublayoutNodeThreshold :state.sublayoutNodeThreshold

      const { classes,gedRange ,stiffness,repulsion,damping,speed,increment,
        year,sublayoutZoom,sublayoutNodeThreshold} = this.props;

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
                     label="Start Year"
                     className={classes.textField}
                     InputLabelProps ={{
                       shrink: true,
                     }}
                     InputProps ={{
                       classes: { input: classes.input1 }
                     }}
                     value = {gedRange.s}
                     margin="normal"
                     variant="outlined"
                   />
                 </Grid>
                 <Grid item xs={5}>
                   <TextField
                     id="filled-name"
                     label="End Year"
                     className={classes.textField}
                     InputLabelProps ={{
                      shrink: true,
                     }}
                     InputProps ={{
                      classes: { input: classes.input1 }
                     }}
                     value = {gedRange.e}
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
                  label="Run From Year"
                  ref = "runfromyear"
                  className={classes.textField}
                  InputLabelProps ={{
                    shrink: true,
                  }}
                  InputProps ={{
                    classes: { input: classes.input1 }
                  }}
                  defaultValue = {year}
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
                  label="Set Speed"
                  ref = "speed"
                  className={classes.textField}
                  InputLabelProps ={{
                    shrink: true,
                  }}
                  InputProps ={{
                    classes: { input: classes.input1 }
                  }}
                  defaultValue = {speed}
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
                   label="Increment"
                   ref = "increment"
                   className={classes.textField}
                   InputLabelProps ={{
                     shrink: true,
                   }}
                   InputProps ={{
                     classes: { input: classes.input1 }
                   }}
                   defaultValue = {increment}
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
                    label="Zoom Threshold"
                    ref = "zoomthreshold"
                    className={classes.textField}
                    InputLabelProps ={{
                      shrink: true,
                    }}
                    InputProps ={{
                      classes: { input: classes.input1 }
                    }}

                    defaultValue ={sublayoutZoom}
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
                    label="Node Threshold"
                    ref = "threshold"
                    className={classes.textField}
                    InputLabelProps ={{
                      shrink: true,
                    }}
                    InputProps ={{
                      classes: { input: classes.input1 }
                    }}
                    defaultValue ={sublayoutNodeThreshold}
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
                    Stiffness
                  </Typography>
                  <TextField
                    id="filled-name"
                    ref = "stiffness"
                    label="Stiffness"
                    className={classes.textField}
                    InputLabelProps ={{
                      shrink: true,
                    }}
                    InputProps ={{
                      classes: { input: classes.input1 }
                    }}
                    defaultValue ={stiffness}
                    margin="normal"
                    variant="outlined"
                  />
                 </Grid>
                <Grid item xs={5}>
                  <Typography variant="subtitle1" gutterBottom>
                    Repulsion
                  </Typography>
                  <TextField
                    id="filled-name"
                    ref ="repulsion"
                    label="Repulsion"
                    className={classes.textField}
                    InputLabelProps ={{
                      shrink: true,
                    }}
                    InputProps ={{
                      classes: { input: classes.input1 }
                    }}
                    defaultValue ={repulsion}
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
                     Damping
                   </Typography>
                   <TextField
                     id="filled-name"
                     ref ="damping"
                     label="Damping"
                     className={classes.textField}
                     InputLabelProps ={{
                       shrink: true,
                     }}
                     InputProps ={{
                       classes: { input: classes.input1 }
                     }}
                     value ={damping}
                     margin="normal"
                     variant="outlined"
                   />
                  </Grid>

               </Grid>
               </div>


             <div className = {classes.buttonContainer}>
               <Button variant="contained" color="secondary" onClick={(evt)=>{
                    this.props.setSubsetFDParams(this.refs.runfromyear.props.value || this.refs.runfromyear.props.defaultValue,
                                                 this.refs.speed.props.value || this.refs.speed.props.defaultValue,
                                                 this.refs.increment.props.value || this.refs.increment.props.defaultValue,
                                                 this.refs.zoomthreshold.props.value || this.refs.zoomthreshold.props.defaultValue,
                                                 this.refs.threshold.props.value || this.refs.threshold.props.defaultValue,
                                                 this.refs.stiffness.props.value || this.refs.stiffness.props.defaultValue,
                                                 this.refs.repulsion.props.value || this.refs.repulsion.props.defaultValue,
                                                 this.refs.damping.props.value || this.refs.damping.props.defaultValue,
                    );
                   }} >Update Params</Button>
            </div>

        </div>
      );
    }
  }




  const mapStateToProps = state => {
    return {
      status: state.status,
      gedRange : state.gedDataRange,
      stiffness :state.fdSettings.stiffness,
      repulsion :state.fdSettings.repulsion,
      damping : state.fdSettings.damping,
      speed :state.fdSettings.speed,
      increment :state.fdSettings.increment,
      year : state.fdSettings.year,
      sublayoutZoom:state.fdSettings.sublayoutZoom,
      sublayoutNodeThreshold :state.fdSettings.sublayoutNodeThreshold

    };
  };

  const mapDispatchToProps = dispatch => {
    return {
      setSideDrawerOptionsVisible :visible=>{
        dispatch(setSideDrawerOptionsVisible(visible))
      },
      setSubsetFDParams : (runfrom, speed, increment, zoomthreshold,nodethreshold, stiffness, repulsion, damping) =>{
        dispatch(setSubsetFDParams(runfrom, speed, increment, zoomthreshold,nodethreshold, stiffness, repulsion, damping))
      }
    };
  };

  export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Options));
