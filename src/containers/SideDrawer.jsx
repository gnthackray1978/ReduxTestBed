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
import Grid from '@material-ui/core/Grid';
import './SideDrawer.css';
import {GedLib} from "../DataLoader/GedLib.js";
import PersonList from "./PersonList.jsx";
import { connect } from "react-redux";
import { switchControlVisbility,reset,gedLoadingStatus,initYearIncrementor,gedParseComplete } from "../actions/creators.jsx";



const styles = {
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
};

 class SideDrawer extends Component {

   constructor(props) {
      super(props);
       this.state = {
         modalShow: this.props.show ,
       };
   }

   componentDidMount() {
     console.log('-componentDidMount:');
     this.props.onOpenClick(()=>{
       this.setState({ modalShow: true });
     });

     this.props.initYearIncrementor(5,3000);

   }

   toggleDrawer(state){
     if(this.state.modalShow != state)
      this.setState({ modalShow: state });
   }

   dataParseComplete(persons, range) {

      if(persons == undefined || persons == null || persons.length ==0){
          this.showGedError("Could not obtain list of persons");
          return;
      }

  //    this.showGedContent();
    //  this.showPersonSelectList(persons);
  //    this.setFDDefaults(Number(range.s)+50,5,3000);
      console.log('complete');
   }

   loadGedDefault(){

     let defaultGed = '../../Assets/default.ged';



     let tp = this;

     // $.get(that.defaultGed, function (contents) {
     //           treedate(contents);
     //       }, 'text');

      fetch(defaultGed)
      .then(response => response.text())
       .then(data => {
         const _applicationGedLoader = new GedLib();
              _applicationGedLoader.processFile(data,(message, show)=>{
                tp.props.gedLoadingStatus(message, show);
              },
                      function (families, persons,range) {
                         tp.props.gedParseComplete(persons,range);
                        //_graphLoaderUI.dataParseComplete(persons,range);
                    });
       })
       .catch(error => console.log('error is', error));


   }

   loadGetStandard(){
     var that =this;

     var handleFileSelect = function(evt) {
         var files = evt.target.files; // FileList object
         // Loop through the FileList and render image files as thumbnails.
         for (var i = 0, f; f = files[i]; i++) {
             var reader = new FileReader();
             // Closure to capture the file information.
             reader.onload = (function(theFile) {
                 return function(e) {
                     // loader.processFile(e.target.result);

                     treedate(e.target.result);
                 };
             })(f);
             // Read in the image file as a data URL.
             reader.readAsText(f);
         }
     };


   }




  render() {

    const { classes } = this.props;

    return (
      <div>
        <Drawer open={this.state.modalShow} >
          <div  className={classes.list}>
            <div className = "inner">
            <Grid container spacing={24} className={classes.mygrid}>
              <Grid item xs={12}>
                <b className ={classes.label}>Data Selection</b>
              </Grid>
              <Grid item xs={4}>
                <Button onClick={()=>{ this.loadGedDefault();}}  className ={classes.label}>Default</Button>
              </Grid>
              <Grid item xs={4}>
                <Button onClick={()=>{ }} className ={classes.label}>Select</Button>
              </Grid>
              <Grid item xs={4}>
                <Button onClick={()=>{ this.toggleDrawer(false);}}
                  className ={classes.label}>Close</Button>
              </Grid>
            </Grid>
            <PersonList></PersonList>
            </div>
          </div>
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
    getError :  state.getError,
    rawGed :  state.rawGed,
    incrementSize :  state.incrementSize,
    timeSpeed :  state.timeSpeed,
    gedLoadingMessage :  state.gedLoadingMessage,
    gedLoadingMessagesDisplayed :  state.gedLoadingMessagesDisplayed,
  };
};

const mapDispatchToProps = dispatch => {

  return {

    switchControlVisbility: controlVisible => {
      dispatch(switchControlVisbility(controlVisible));
    },

    gedParseComplete: (persons, range) => {
      dispatch(gedParseComplete(persons, range));
    },

    initYearIncrementor: (increment,speed) => {
      dispatch(initYearIncrementor(increment,speed));
    },

    gedLoadingStatus: (message, show) => {
      dispatch(gedLoadingStatus(message, show));
    },

  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(SideDrawer));
