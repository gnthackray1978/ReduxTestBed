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

const styles = {

  formControl: {
    marginTop: 15,
    marginLeft:10
  },



  label: {

    textAlign: 'center',

  },



};

const cStyle = {
  position: 'absolute'
};


class GraphContainer extends React.Component {
  constructor(props) {
    super(props);
    this.saveContext = this.saveContext.bind(this);
  }

  saveContext(ctx) {
    this.props.contextCreated(ctx);
  }

  componentDidUpdate() {
    this.props.drawFrame();
  }

  render() {
    return <PureCanvas contextRef={this.saveContext}></PureCanvas>;
  }
}

class PureCanvas extends React.Component {
  shouldComponentUpdate() { return false; }

  render() {
    return (
      <canvas style={cStyle}
        ref={node => node ? this.props.contextRef(node.getContext('2d')) : null}
      />
    )
  }
}



class VisualisationHandler extends Component {

  // import {AncTree} from "../../DataLoader/AncTree.js";
  // import {DescTree} from "../../DataLoader/DescTree.js";
  // import {GedLib} from "../../DataLoader/GedLib.js";
  // import {AncGraphCreator} from "../../DataLoader/AncGraphCreator.js";
  // import {TreeUI} from "../../DataLoader/TreeUI.js";
  constructor(props) {
     super(props);

     //state
     this._tree =null;
     this._moustQueue = [];
     this.updateAnimationState = this.updateAnimationState.bind(this);


   }

   validTree(){
     if(this._tree== undefined || this._tree == null) return false;

     return true;
   }

   updateAnimationState(_point) {
     if(_point!=undefined)
      this._tree.SetCentrePoint(_point[0], _point[1]);
     else
      this._tree.SetCentrePoint();

     this._tree.DrawTree();
   }

   canvasclick(clientX , boundingrecleft, clientY , boundingrectop){

      //  if(!this.validtree) return;

       this._tree.PerformClick(clientX- boundingrecleft, clientY - boundingrectop);

       this._tree.UpdateGenerationState();

       // if (this._tree.bt_refreshData) {
       //     getData(this._tree.selectedPersonId, this._tree.selectedPersonX, this._tree.selectedPersonY);
       // }

       this.updateAnimationState();
   }

   canvasmove(clientX , boundingrecleft, clientY , boundingrectop){

     let _point = [clientX - boundingrecleft, clientY- boundingrectop];

     if(this._tree!= null && this._tree!=undefined)
      this._tree.SetMouse(_point[0], _point[1]);

     if (this._mouseDown) {
         this.updateAnimationState(_point);
     }

   }

   canvasmousedown(){

     this._mouseDown = true;
   }

   canvasmouseup(){

     this._mouseDown = false;

  //   var _point = new Array(1000000, 1000000);
  //   this._moustQueue[this._moustQueue.length] = _point;
   }

   movebuttondown(_dir){

     if(!this.validTree()) return;

     console.log('movebuttondown: ' + _dir);

     this._moveTimer = setInterval( () =>{ this._tree.MoveTree(_dir); }, 100);
   }
   movebuttonup(){

     if(!this.validTree()) return;

     clearInterval(this._moveTimer);
   }


    componentDidUpdate(){
      console.log('VisualisationHandler componentDidUpdate' );

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
            this.runGraphDirected();
          }
        }

        this.processButtonClicks();
      }



    }



    drawFrame(ctx){
      // if(this._tree!=null){
      //   console.log('drawing tree');
      //   this._tree.DrawTree();
      // }
    }
    contextCreated (ctx){
     console.log('context created');



     this.props.setContext(ctx);

     this.WireUp(ctx);

    }

    processButtonClicks(){
      let dir ='';

      if(!this.props.zoomin &&
        !this.props.zoomout &&
        !this.props.mapleft &&
        !this.props.mapright &&
        !this.props.mapup &&
        !this.props.mapdown){
        this.movebuttonup();
        return;
      }


      if(this.props.zoomin) dir ='DOWN';
      if(this.props.zoomout) dir ='UP';
      if(this.props.mapleft) dir ='EAST';
      if(this.props.mapright) dir ='RIGHT';
      if(this.props.mapup) dir ='NORTH';
      if(this.props.mapdown) dir ='SOUTH';

      this.movebuttondown(dir);

    }

    WireUp(ctx){

      ctx.canvas.addEventListener('mousedown', (evt) => {
        evt.preventDefault();

        this.canvasmousedown();
      });

      ctx.canvas.addEventListener('mouseup', (evt) => {
        evt.preventDefault();
        this.canvasmouseup();
      });

      ctx.canvas.addEventListener('click', (evt) => {
        var boundingrec =  ctx.canvas.getBoundingClientRect();
        this.canvasclick(evt.clientX ,boundingrec.left, evt.clientY , boundingrec.top);
      });

      ctx.canvas.addEventListener('mousemove', (evt) => {
        var boundingrec =  ctx.canvas.getBoundingClientRect();
        this.canvasmove(evt.clientX ,boundingrec.left, evt.clientY , boundingrec.top);
      });



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

   runGraphDirected(nextProps) {


   }

   stopAll(){
     console.log('clear all ');
   }

 render() {
    return <GraphContainer drawFrame = {this.drawFrame.bind(this)}  contextCreated = {this.contextCreated.bind(this)}/>
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
    layoutDefaults :state.layoutDefaults
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
