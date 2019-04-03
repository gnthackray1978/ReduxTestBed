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
import './SideDrawer.css';

import {GedLib} from "../../DataLoader/GedLib.js";
import PersonList from "./PersonList.jsx";
import GedLoader from "./GedLoader.jsx";
import LayoutSelect from "./LayoutSelect.jsx";

import { connect } from "react-redux";
import { switchControlVisbility,reset,gedLoadingStatus,initYearIncrementor,setGedData ,
  gedLoadFailed,activateLayout,toggleGraphRunning,setRowsPerPage} from "../../actions/creators.jsx";




const styles = theme => ({

  root: {
    paddingRight: theme.spacing.unit,
  },

  list: {
    width: 420,
  },

  fullList: {
    width: 'auto',
  },
  mygrid:{
    margin:'0px'
  },

  label: {

    textAlign: 'center',

  },
  toolBar: {
    paddingLeft :'12px',
    minHeight: '0px'
  }

});




 class SideDrawer extends Component {

   constructor(props) {
      super(props);
       this.state = {
         modalShow: this.props.show ,
       };
   }

   componentDidMount() {

     this.props.onOpenClick(()=>{
       this.setState({ modalShow: true });
     });

     this.props.initYearIncrementor(5,3000);

   }

   toggleDrawer(state){
     if(this.state.modalShow != state){
      this.setState({ modalShow: state });

    }
      this.props.setRowsPerPage();
   }

   drawLayout(event){
     this.props.toggleGraphRunning(false);
     //nothing has changed

     if(this.props.graphActiveLayout == this.props.layout &&
       this.props.graphActiveSelection == this.props.selection){

       return;
     }

     this.props.activateLayout(true,this.props.layout,this.props.selection);

   }

   clearLayout(event){
    this.props.activateLayout(false);
   }

   render() {

    const { classes } = this.props;

    return (
      <div>
        <Drawer open={this.state.modalShow} >

          <Paper className={classes.root}>
            <div className = "inner">
              <Toolbar className={classes.toolBar}>
                <Button onClick={()=>{ this.toggleDrawer(false);}}
                  className ={classes.label}>Close</Button>
                <GedLoader></GedLoader>
                  <Button onClick={()=>{ this.drawLayout();}}
                    className ={classes.label}>Draw</Button>
              </Toolbar>

              <Toolbar className={classes.toolBar}>
                <LayoutSelect></LayoutSelect>
              </Toolbar>


              <PersonList></PersonList>

            </div>



          </Paper>
        </Drawer>



      </div>
    );
  }
}

SideDrawer.defaultProps = {
  show: false,

};

SideDrawer.propTypes = {
  classes: PropTypes.object.isRequired,
};


const mapStateToProps = state => {
  return {

    status: state.status,
    controlVisible: state.controlVisible,
    timerStartYear : state.timerStartYear,
    gedLoaded : state.gedLoaded,
    getError :  state.gedError,
    incrementSize :  state.incrementSize,
    timeSpeed :  state.timeSpeed,
    gedLoadingMessage :  state.gedLoadingMessage,
    gedLoadingMessagesDisplayed :  state.gedLoadingMessagesDisplayed,
    gedDataRange: state.gedDataRange,
    graphActive : state.graphActive,
    graphActiveLayout: state.graphActiveLayout,
    graphActiveSelection : state.graphActiveSelection,
    layout: state.layout,
    selection: state.selection
  };
};

const mapDispatchToProps = dispatch => {

  return {

    switchControlVisbility: controlVisible => {
      dispatch(switchControlVisbility(controlVisible));
    },
    initYearIncrementor: (increment,speed) => {
      dispatch(initYearIncrementor(increment,speed));
    },
    activateLayout: (isActive, graphActiveLayout,graphActiveSelection) => {
      dispatch(activateLayout(isActive, graphActiveLayout,graphActiveSelection));
    },

    toggleGraphRunning : isSet =>{
      dispatch(toggleGraphRunning(isSet))
    },
    setRowsPerPage : () =>{
      dispatch(setRowsPerPage())
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(SideDrawer));
