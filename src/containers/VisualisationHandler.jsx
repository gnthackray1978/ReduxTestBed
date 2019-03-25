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
import {setLayout,setContext} from "../actions/creators.jsx";

import {AncGraphCreator} from "../DataLoader/AncGraphCreator.js";
import {DescGraphCreator} from "../DataLoader/DescGraphCreator.js";
import {TreeUI} from "../DataLoader/TreeUI.js";
import {AncTree} from "../DataLoader/AncTree.js";

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


   updateAnimationState() {

     while (this._moustQueue.length > 0) {
         var _point = this._moustQueue.shift();

          console.log(_point[0] + ","+ _point[1]);

      //   this.props.context.canvas.width = window.innerWidth;
      //   this.props.context.canvas.height = window.innerHeight;


         this._tree.SetCentrePoint(_point[0], _point[1]);

         this._tree.DrawTree();

         this.rAF = requestAnimationFrame(this.updateAnimationState);



     }


   }

   canvasclick(clientX , boundingrecleft, clientY , boundingrectop){

      //  if(!this.validtree) return;

         this._tree.PerformClick(clientX- boundingrecleft, clientY - boundingrectop);

         this._tree.UpdateGenerationState();

         // if (this._tree.bt_refreshData) {
         //     getData(this._tree.selectedPersonId, this._tree.selectedPersonX, this._tree.selectedPersonY);
         // }
         //
         this._moustQueue[this._moustQueue.length] = new Array(1000000, 1000000);

   }

   canvasmove(clientX , boundingrecleft, clientY , boundingrectop){

         var _point = new Array(clientX - boundingrecleft, clientY- boundingrectop);

         if(this._tree!= null && this._tree!=undefined)
          this._tree.SetMouse(_point[0], _point[1]);


         if (this._mouseDown) {
             this._moustQueue.push(_point);

             this.updateAnimationState();
         }

   }

   canvasmousedown(){

     this._mouseDown = true;
   }

   canvasmouseup(){

     this._mouseDown = false;

     var _point = new Array(1000000, 1000000);
     this._moustQueue[this._moustQueue.length] = _point;
   }



   // componentDidMount(){
   //
   //    console.log('VisualisationHandler componentDidMount' );
   //
   //    if(this.props.graphActiveLayout== 'ancestors'){
   //      this.runAncestors(this.props.graphActiveSelection);
   //
   //    }
   //    if(this.props.graphActiveLayout== 'descendents'){
   //      this.runDescendants(this.props.graphActiveSelection);
   //    }
   //    if(this.props.graphActiveLayout== 'forceDirect'){
   //      this.runGraphDirected();
   //    }
   //
   //
   // }

    componentDidUpdate(){
      console.log('VisualisationHandler componentDidUpdate' );

      if(this.props.graphActiveLayout== 'ancestors'){
        this.initAncestors(this.props.graphActiveSelection, (selectedId, data, treeUI)=>{
          this.runAncestors(selectedId, data, treeUI);
        });
      }
      if(this.props.graphActiveLayout== 'descendents'){
        this.runDescendants(this.props.graphActiveSelection);
      }
      if(this.props.graphActiveLayout== 'forceDirect'){
        this.runGraphDirected();
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

    WireUp(ctx){
      // $("#myCanvas").unbind();
      // $(".button_box").unbind();
      //
      // $(".button_box").mousedown(function (evt) {
      //     var _dir = '';
      //
      //     if (evt.target.id == "up") _dir = 'UP';
      //     if (evt.target.id == "dn") _dir = 'DOWN';
      //     if (evt.target.id == "we") _dir = 'WEST';
      //     if (evt.target.id == "no") _dir = 'NORTH';
      //     if (evt.target.id == "es") _dir = 'EAST';
      //     if (evt.target.id == "so") _dir = 'SOUTH';
      //     if (evt.target.id == "de") _dir = 'DEBUG';
      //
      //     runner.movebuttondown(_dir);
      //
      // }).mouseup(function () {
      //     runner.movebuttonup();
      // });

      // $("#myCanvas").mousedown(function (evt) {
      //     evt.preventDefault();
      //     evt.originalEvent.preventDefault();
      //     runner.canvasmousedown();
      // });

      ctx.canvas.addEventListener('mousedown', (evt) => {
        evt.preventDefault();
        //evt.originalEvent.preventDefault();
        this.canvasmousedown();
      });


      // $("#myCanvas").mouseup(function (evt) {
      //   evt.preventDefault();
      //   runner.canvasmouseup();
      // });

      ctx.canvas.addEventListener('mouseup', (evt) => {
        evt.preventDefault();
        this.canvasmouseup();
      });


      // $("#myCanvas").click(function (evt) {
      //   var boundingrec = document.getElementById("myCanvas").getBoundingClientRect();
      //   runner.canvasclick(evt.clientX ,boundingrec.left, evt.clientY , boundingrec.top);
      // });
      ctx.canvas.addEventListener('click', (evt) => {
        var boundingrec =  ctx.canvas.getBoundingClientRect();
        this.canvasclick(evt.clientX ,boundingrec.left, evt.clientY , boundingrec.top);
      });

      // $("#myCanvas").mousemove(function (evt) {
      //    var boundingrec = document.getElementById("myCanvas").getBoundingClientRect();
      //    runner.canvasmove(evt.clientX ,boundingrec.left, evt.clientY , boundingrec.top);
      // });
      ctx.canvas.addEventListener('mousemove', (evt) => {
        var boundingrec =  ctx.canvas.getBoundingClientRect();
        this.canvasmove(evt.clientX ,boundingrec.left, evt.clientY , boundingrec.top);
      });



    }


   initAncestors(selectedId, complete){
     console.log('running ancs: '+selectedId );
     var context = this.props.context;

     var loader = new AncGraphCreator(this.props.families,this.props.persons);

     loader.GetGenerations(selectedId,function(data){

       console.log(data.Generations.length);

       let treeUI = new TreeUI();
       context.canvas.style.top=0;
       context.canvas.style.left=0;
      // context.canvas.style.position = 'absolute';
       context.canvas.width = window.innerWidth;
       context.canvas.height = window.innerHeight;

    //   treeUI.RoundedRect(context,500,100,50,50,2);

       treeUI.Init(1,context, (instance)=>{
         console.log('tree ui loaded');
         complete(selectedId, data, treeUI);
       });

     });
   }

   runAncestors(selectedId, data, treeUI) {
     //   TreeUI.WireUp(_treeRunner);
     //   _treeRunner.run(selectedId,data, new AncTree(),treeUI);

     var _zoomLevel = 100;

     this._tree = new AncTree();

     this._tree.selectedPersonId = selectedId;
     this._tree.selectedPersonX = 0;
     this._tree.selectedPersonY = 0;


     this._tree.SetInitialValues(Number(_zoomLevel), 30.0, 170.0, 70.0, 70.0, 100.0, 20.0, 40.0, 20.0, screen.width, screen.height);

     this._tree.treeUI = treeUI;

     this._tree.generations = data.Generations;

     this._tree.UpdateGenerationState();

     this._tree.RelocateToSelectedPerson();

     this._tree.bt_refreshData = false;

     this.rAF = requestAnimationFrame(this.updateAnimationState);

   }

   runDescendants(selectedId) {
     console.log('running decs: '+selectedId );
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
    context :state.context
  };
};

const mapDispatchToProps = dispatch => {

  return {
    setContext: context => {
      dispatch(setContext(context));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(VisualisationHandler));
