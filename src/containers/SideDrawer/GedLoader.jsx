import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import {GedLib} from "../../DataLoader/GedLib.js";

import { connect } from "react-redux";
import { switchControlVisbility,reset,gedLoadingStatus,initYearIncrementor,setGedData ,gedLoadFailed} from "../../actions/creators.jsx";


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


class GedLoader extends Component {
  constructor(props) {
     super(props);
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

     let defaultGed = '../../Assets/test.ged';



     let tp = this;

      fetch(defaultGed)
      .then(response => response.text())
       .then(data => {
         const _applicationGedLoader = new GedLib();
              _applicationGedLoader.processFile(data,(message, show)=>{
                tp.props.gedLoadingStatus(message, show);
              },
                  function (families, persons,range) {
                    if(persons == undefined || persons == null || persons.length ==0){
                      tp.props.gedLoadFailed('No Data');
                    }
                    else{
                      tp.props.setGedData(persons, families,range);
                    }

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
     <Grid container spacing={24} className={classes.mygrid}>
       <Grid item xs={4}>
         <Button onClick={()=>{ this.loadGedDefault();}}  className ={classes.label}>Default</Button>
       </Grid>
       <Grid item xs={4}>
         <Button onClick={()=>{ }} className ={classes.label}>Select</Button>
       </Grid>
       <Grid item xs={4}/>
     </Grid>

   );
 }

}


const mapStateToProps = state => {
  return {
    timerStartYear : state.timerStartYear,
    gedLoaded : state.gedLoaded,
    getError :  state.gedError,
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

    gedLoadFailed: (message) => {
      dispatch(gedLoadFailed(message));
    },

    initYearIncrementor: (increment,speed) => {
      dispatch(initYearIncrementor(increment,speed));
    },

    gedLoadingStatus: (message, show) => {
      dispatch(gedLoadingStatus(message, show));
    },

    setGedData: (persons, families,range) => {
      dispatch(setGedData(persons, families,range));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(GedLoader));
