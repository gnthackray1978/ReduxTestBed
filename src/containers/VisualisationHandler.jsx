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
import {setLayout,setContext,toggleGraphRunning} from "../actions/creators.jsx";

import {AncGraphCreator} from "../DataLoader/AncGraphCreator.js";
import {DescGraphCreator} from "../DataLoader/DescGraphCreator.js";
import {TreeUI} from "../DataLoader/TreeUI.js";
import {AncTree} from "../DataLoader/AncTree.js";
import {DescTree} from "../DataLoader/DescTree.js";
import {ForceDirect} from "../ForceDirected/ForceDirect.js";
import GraphContainer from "./Canvas/GraphContainer.jsx";


const styles = {

  formControl: {
    marginTop: 15,
    marginLeft:10
  },



  label: {

    textAlign: 'center',

  },



};




// class GraphContainer extends React.Component {
//   constructor(props) {
//     super(props);
//     this.saveContext = this.saveContext.bind(this);
//   }
//
//   saveContext(ctx) {
//     this.props.contextCreated(ctx);
//   }
//
//   componentDidUpdate() {
//     this.props.drawFrame();
//   }
//
//   render() {
//     return <PureCanvas contextRef={this.saveContext}></PureCanvas>;
//   }
// }
//
// class PureCanvas extends React.Component {
//   shouldComponentUpdate() { return false; }
//
//   render() {
//     return (
//       <canvas style={cStyle}
//         ref={node => node ? this.props.contextRef(node.getContext('2d')) : null}
//       />
//     )
//   }
// }


class GraphEventConnector{

  constructor(){
    this._connected=false;
    this._mouseDown =false;
  }

  Connect(ctx,props, callback){

  //  let mouseDown =false;
  //  this.callback = callback;

    this.parseMapButtonState(props,callback);

    // dont subscribe to the events over and over
    if(!this._connected)
    {
        ctx.canvas.addEventListener('mousedown', (evt) => {
          evt.preventDefault();
          this._mouseDown =true;
          callback('canvas_mousedown',evt);
        });

        ctx.canvas.addEventListener('mouseup', (evt) => {
          evt.preventDefault();
          this._mouseDown = false;
          callback('canvas_mouseup',evt);
        });

        ctx.canvas.addEventListener('dblclick', (evt) => {
          evt.preventDefault();
          callback('canvas_dblclick',evt);
        });

        ctx.canvas.addEventListener('click', (evt) => {
          var boundingrec =  ctx.canvas.getBoundingClientRect();
          //  this._tree.PerformClick(clientX- boundingrecleft, clientY - boundingrectop);

          let point ={
            x: (evt.clientX - boundingrec.left),
            y: ( evt.clientY  - boundingrec.top),
            evt : evt
          };

          callback('canvas_click', point);

        });

        ctx.canvas.addEventListener('mousemove', (evt) => {
          var boundingrec =  ctx.canvas.getBoundingClientRect();
        //  this.canvasmove(evt.clientX ,boundingrec.left, evt.clientY , boundingrec.top);

          let point ={
            x: (evt.clientX - boundingrec.left),
            y: ( evt.clientY  - boundingrec.top),
            mouseDown: this._mouseDown,
            evt: evt
          };

          callback('canvas_mousemove', point);
        });

        this._connected =true;
    }

  }

  parseMapButtonState(buttonState,callback){
    let dir ='';

    if(!buttonState.zoomin &&
      !buttonState.zoomout &&
      !buttonState.mapleft &&
      !buttonState.mapright &&
      !buttonState.mapup &&
      !buttonState.mapdown)
      {
        clearInterval(this._moveTimer);
        return;
      }


    if(buttonState.zoomin) dir ='DOWN';
    if(buttonState.zoomout) dir ='UP';
    if(buttonState.mapleft) dir ='EAST';
    if(buttonState.mapright) dir ='RIGHT';
    if(buttonState.mapup) dir ='NORTH';
    if(buttonState.mapdown) dir ='SOUTH';

    this._moveTimer = setInterval( () =>{ callback('control_down',dir); }, 100);
  }


}

class VisualisationHandler extends Component {

  constructor(props) {
     super(props);

     //state
     this._tree =null;
     this._forceDirect =null;
  //   this._moustQueue = [];
     this.updateAnimationState = this.updateAnimationState.bind(this);

     this._graphEventConnnector = new GraphEventConnector();

   }

   validTree(){
     if(this._tree== undefined || this._tree == null) return false;

     return true;
   }

   updateAnimationState(_point) {


     if(_point!=undefined)
      this._tree.SetCentrePoint(_point.x, _point.y);
     else
      this._tree.SetCentrePoint();

     this._tree.DrawTree();
   }

   componentDidUpdate(){
      console.log('VisualisationHandler componentDidUpdate' );

      this._graphEventConnnector.Connect(this.props.context,this.props,  (actionName, data)=>{
        switch (actionName) {
          case 'canvas_mousedown':
            if(this._forceDirect && this.props.graphActiveLayout == 'forceDirect')
              this._forceDirect.mouseDown(data);
          break;
          case 'canvas_mouseup':
          if(this._forceDirect && this.props.graphActiveLayout == 'forceDirect')
            this._forceDirect.mouseUp(data);
          break;
          case 'canvas_mousemove':
            if(this.props.graphActiveLayout != 'forceDirect'){
              if(this.validTree())
                this._tree.SetMouse(data.x,data.y);
              if(data.mouseDown)
                this.updateAnimationState(data);
            }
            else{
              if(this._forceDirect && this.props.graphActiveLayout == 'forceDirect')
                this._forceDirect.mouseMove(data.evt);
            }

          break;
          case 'canvas_dblclick':
            if(this._forceDirect && this.props.graphActiveLayout == 'forceDirect')
              this._forceDirect.mouseDoubleClick(data);
          break;
          case 'canvas_click':
            if(this.props.graphActiveLayout != 'forceDirect'){
              if(this.validTree()){
                this._tree.PerformClick(data.x,data.y);
                this._tree.UpdateGenerationState();
                this.updateAnimationState();
              }
            }
            else{
              if(this._forceDirect && this.props.graphActiveLayout == 'forceDirect')
                this._forceDirect.mouseMove(data.evt);
            }

          break;
          case 'control_down':
            if(this.props.graphActiveLayout != 'forceDirect'){
              if(this.validTree()){
                this._tree.MoveTree(data);

              }
            }
            else{

            }

          break;


          default:

        }
      });




      if(this.props.graphActive){
        if(!this.props.graphRunning){
          if(this.props.graphActiveLayout== 'ancestors'){
            this.props.toggleGraphRunning(true);
            this.initAncestors(this.props.graphActiveSelection, (selectedId, data, treeUI)=>{
              this.runAncestors(selectedId, data, treeUI);
            });
          }
          if(this.props.graphActiveLayout== 'descendents'){
            this.props.toggleGraphRunning(true);
            this.initDescendents(this.props.graphActiveSelection, (selectedId, data, treeUI)=>{
              this.runDescendants(selectedId, data, treeUI);
            });


          }
          if(this.props.graphActiveLayout== 'forceDirect'){
            this.props.toggleGraphRunning(true);
            this.runGraphDirected(this.props.graphActiveSelection);
          }
        }

      //  this.processButtonClicks();
      }



    }

    contextCreated (ctx){
     console.log('context created');
     this.props.setContext(ctx);
    }



   initDescendents(selectedId, complete){
     let context = this.props.context;
     var loader = new DescGraphCreator(this.props.families,this.props.persons);
     loader.GetGenerations(selectedId,function(data){

       console.log(data.Generations.length);

       let treeUI = new TreeUI();
       context.canvas.style.top=0;
       context.canvas.style.left=0;

       context.canvas.width = window.innerWidth;
       context.canvas.height = window.innerHeight;


       treeUI.Init(1,context, (instance)=>{
      //   console.log('tree ui loaded');
         complete(selectedId, data, treeUI);
       });

     });
   }

   initAncestors(selectedId, complete){

     let context = this.props.context;

     var loader = new AncGraphCreator(this.props.families,this.props.persons);

     loader.GetGenerations(selectedId,function(data){

       //console.log(data.Generations.length);

       let treeUI = new TreeUI();
       context.canvas.style.top=0;
       context.canvas.style.left=0;

       context.canvas.width = window.innerWidth;
       context.canvas.height = window.innerHeight;


       treeUI.Init(1,context, (instance)=>{
      //   console.log('tree ui loaded');
         complete(selectedId, data, treeUI);
       });

     });
   }

   runAncestors(selectedId, data, treeUI) {
     //   TreeUI.WireUp(_treeRunner);
     //   _treeRunner.run(selectedId,data, new AncTree(),treeUI);
     console.log('running ancs: '+selectedId );

     var _zoomLevel = 100;

     this._tree = new AncTree();

     this._tree.selectedPersonId = selectedId;
     this._tree.selectedPersonX = 0;
     this._tree.selectedPersonY = 0;

     this._tree.SetInitialValues(this.props.layoutDefaults, window.innerWidth, window.innerHeight);

     this._tree.treeUI = treeUI;

     this._tree.generations = data.Generations;

     this._tree.UpdateGenerationState();

     this._tree.RelocateToSelectedPerson();

     this._tree.bt_refreshData = false;

     this.rAF = requestAnimationFrame(this.updateAnimationState);

   }

   runDescendants(selectedId, data, treeUI) {

     this._tree = new DescTree();

     this._tree.selectedPersonId = selectedId;
     this._tree.selectedPersonX = 0;
     this._tree.selectedPersonY = 0;


     this._tree.SetInitialValues(this.props.layoutDefaults, window.innerWidth, window.innerHeight);

     this._tree.treeUI = treeUI;

     this._tree.generations = data.Generations;

     this._tree.UpdateGenerationState();

     this._tree.RelocateToSelectedPerson();

     this._tree.bt_refreshData = false;

     this.rAF = requestAnimationFrame(this.updateAnimationState);
   }

   runGraphDirected(selectedId) {

     let context = this.props.context;

     context.canvas.style.top=0;
     context.canvas.style.left=0;

     context.canvas.width = window.innerWidth;
     context.canvas.height = window.innerHeight;

     let loader = new DescGraphCreator(this.props.families,this.props.persons);

     this._forceDirect = new ForceDirect(this.props.fdSettings,loader,context,(name,value)=>{

      });

      this._forceDirect.init(selectedId);


   }

   stopAll(){
     console.log('clear all ');
   }

    render() {
      return <GraphContainer drawFrame = {(ctx)=>{}}  contextCreated = {this.contextCreated.bind(this)}/>
    }

}


const mapStateToProps = state => {

  return {
    graphActive :state.graphActive,
    graphActiveLayout: state.graphActiveLayout,
    graphActiveSelection : state.graphActiveSelection,
    persons: state.persons,
    families: state.families,
    context :state.context,
    zoomin : state.zoomin,
    zoomout: state.zoomout,
    mapleft: state.mapleft,
    mapright: state.mapright,
    mapup: state.mapup,
    mapdown:state.mapdown,
    status: state.status,
    graphRunning : state.graphRunning,
    layoutDefaults :state.layoutDefaults,
    fdSettings: state.fdSettings
  };
};

const mapDispatchToProps = dispatch => {

  return {
    setContext: context => {
      dispatch(setContext(context));
    },
    toggleGraphRunning : isSet =>{
      dispatch(toggleGraphRunning(isSet))
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(VisualisationHandler));
