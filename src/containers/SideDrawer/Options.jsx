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
import StatefullTextField from "./StatefullTextField.jsx";
import {DateFunctions} from "../../DateFunctions.js";
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

     changed (val, type){
       console.log(type + ' ' + val);
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
                 <StatefullTextField label = 'Start Date' value = {this.props.year} changed = {(val,type)=>this.setState({year: DateFunctions.YearDate(val)})}>
                 </StatefullTextField>
               </Grid>
              <Grid item xs={5}>
                <StatefullTextField label = 'Speed' value = {this.props.speed} changed = {(val,type)=>this.setState({speed: Number(val)})}>
                </StatefullTextField>
              </Grid>
            </Grid>
            </div>

            <div className = {classes.outerContainer}>
              <Grid container className = {classes.container}>
                <Grid item xs={5}>
                  <StatefullTextField label = 'Increment' value = {this.props.increment} changed = {(val,type)=>this.setState({increment:  Number(val)})}>
                  </StatefullTextField>
                </Grid>
             </Grid>
             </div>



             <div className = {classes.outerContainer}>
               <Grid container className = {classes.container}>
                 <Grid item xs={5}>
                   <StatefullTextField label = 'Zoom Threshold' value = {this.props.sublayoutZoom} changed = {(val,type)=>this.setState({sublayoutZoom: Number(val)})}>
                   </StatefullTextField>
                 </Grid>
                <Grid item xs={5}>
                  <StatefullTextField label = 'Node Threshold' value = {this.props.sublayoutNodeThreshold} changed = {(val,type)=>this.setState({sublayoutNodeThreshold: Number(val)})}>
                  </StatefullTextField>
                </Grid>
               </Grid>
             </div>


             <div className = {classes.outerContainer}>
               <Grid container className = {classes.container}>
                 <Grid item xs={5}>
                   <StatefullTextField label = 'Stiffness' value = {this.props.stiffness} changed = {(val,type)=>this.setState({stiffness:  Number(val)})}>
                   </StatefullTextField>
                 </Grid>
                <Grid item xs={5}>
                  <StatefullTextField label = 'Repulsion' value = {this.props.repulsion} changed = {(val,type)=>this.setState({repulsion:  Number(val)})}>
                  </StatefullTextField>
                </Grid>
              </Grid>
              </div>


              <div className = {classes.outerContainer}>
                <Grid container className = {classes.container}>
                  <Grid item xs={5}>
                    <StatefullTextField label = 'Damping' value = {this.props.damping} changed = {(val,type)=>this.setState({damping: parseFloat(val)})}>
                    </StatefullTextField>
                  </Grid>

               </Grid>
               </div>


             <div className = {classes.buttonContainer}>
               <Button variant="contained" color="secondary" onClick={(evt)=>{
                   //setSubsetFDParams(runfrom, speed, increment,
                   // zoomthreshold,nodethreshold, stiffness, repulsion, damping)
                   if(this.state != null){
                    this.props.setSubsetFDParams(this.state.year || this.props.year,
                                                 this.state.speed || this.props.speed,
                                                 this.state.increment || this.props.increment,
                                                 this.state.sublayoutZoom || this.props.sublayoutZoom,
                                                 this.state.sublayoutNodeThreshold || this.props.sublayoutNodeThreshold,
                                                 this.state.stiffness || this.props.stiffness,
                                                this.state.repulsion || this.props.repulsion,
                                                this.state.damping || this.props.damping,
                    );
                  }

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
