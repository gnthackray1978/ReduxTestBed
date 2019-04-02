import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { connect } from "react-redux";
import {setLayout,setContext,toggleGraphRunning} from "../actions/creators.jsx";
import {AncGraphCreator} from "../DataLoader/AncGraphCreator.js";
import {DescGraphCreator} from "../DataLoader/DescGraphCreator.js";
import {AncTree} from "../DataLoader/AncTree.js";
import {DescTree} from "../DataLoader/DescTree.js";
import {GraphEventConnector} from "../DataLoader/GraphEventConnector.js";
import {ForceDirect} from "../ForceDirected/ForceDirect.js";
import GraphContainer from "./Canvas/GraphContainer.jsx";


const styles = {

  label: {

    textAlign: 'center',

  },

};

class VisualisationHandler extends Component {

  constructor(props) {
     super(props);

     this._tree =null;
     this._forceDirect =null;

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
            this.initAncestors(this.props.graphActiveSelection);
          }
          if(this.props.graphActiveLayout== 'descendents'){
            this.props.toggleGraphRunning(true);
            this.initDescendents(this.props.graphActiveSelection);
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



   initDescendents(selectedId){
     let context = this.props.context;
     context.canvas.style.top=0;
     context.canvas.style.left=0;

     context.canvas.width = window.innerWidth;
     context.canvas.height = window.innerHeight;

     var loader = new DescGraphCreator(this.props.families,this.props.persons);
     loader.GetGenerations(selectedId,(data)=>{
       this._tree = new DescTree();
       this._tree.SetInitialValues(data.Generations,selectedId, this.props.context, this.props.staticSettings, ()=>{
         this.rAF = requestAnimationFrame(this.updateAnimationState);
       });
     });

   }

   initAncestors(selectedId){

     let context = this.props.context;
     context.canvas.style.top=0;
     context.canvas.style.left=0;

     context.canvas.width = window.innerWidth;
     context.canvas.height = window.innerHeight;

     var loader = new AncGraphCreator(this.props.families,this.props.persons);

     loader.GetGenerations(selectedId,(data)=>{
       this._tree = new AncTree();
       this._tree.SetInitialValues(data.Generations,selectedId, this.props.context, this.props.staticSettings, ()=>{
         this.rAF = requestAnimationFrame(this.updateAnimationState);
       });
     });


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
    staticSettings :state.staticSettings,
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
