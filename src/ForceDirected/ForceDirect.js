
/**
Copyright (c) 2010 Dennis Hotson

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:
The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.
*/

import {LayoutList} from "./LayoutList.js";
import {Graph} from "./Graph.js";
import {RenderLib} from "./RenderLib.js";
import {RenderingHandler} from "./RenderingHandler.js";
import mitt from 'mitt';

//test
export function ForceDirect(settings, gedPreLoader, context, callback) {

    this._context = context;

    this.channel  = mitt();

    this._layoutList =null;

    this.settings = settings;

    this.renderingHandler = null;

    this.gedPreLoader = gedPreLoader;

    this.yearTimer=null;


    this.channel.on("nodeHighlighted", function(data, envelope) {
      console.log("nodeHighlighted");
      callback("nodeHighlighted", data.value);
    });

    this.channel.on("nodeSelected", function(data, envelope) {
      console.log("nodeSelected");
      callback("nodeSelected", data.value);
    });

    this.channel.on("mapyear", function(data, envelope) {
      console.log("mapyear: " +data.value);
      callback("mapyear", data.value);
    });

    this.channel.on("graphChanged", function(data, envelope) {
      console.log("graphChanged");
      callback("graphChanged", data.value);
    });

    // this.channel.on("mapyear", function(data, envelope) {
    //   console.log("mapyear: " +data.value);
    //   callback("mapyear", data.value);
    // });

    this.channel.on("graphChanged", function(data, envelope) {
      console.log("graphChanged");
      callback("graphChanged", data.value);
    });
//
    this.channel.on("cameradebug", function(data, envelope) {
      console.log("cameradebug");
      callback("cameradebug", data.value);
    });

}

ForceDirect.prototype = {
    init: function(id) {

        var that = this;

        this.gedPreLoader.GetGenerations(id, function(data){
            that.run(data);
        });
    },

    kill: function() {

        if(this.gedPreLoader){
            this.gedPreLoader.generations =[];
            this.gedPreLoader.searchDepth = 0;
        }

        this.gedPreLoader = undefined;

        this.graph = null;
        this.treeLinker = null;
        this.renderingHandler = null;
        this.layout = null;


        if(this.yearTimer)
            clearInterval(this.yearTimer);
    },

    run: function(data) {


        var that = this;

        let graph = new Graph(that.channel);

        that._layoutList = new LayoutList(that.channel, graph, that.context, that.settings, data);

        that._layoutList.Init();

        that.yearTimer = setInterval(myTimer, that.settings.speed);


        function myTimer() {

            that.channel.emit( "mapyear",  {value: that.settings.year});

            that._layoutList.populateGraph(that.settings.year);

            that.settings.year += that.settings.increment;

            if (Number(that.settings.year) > that._layoutList.topYear) clearInterval(that.yearTimer);
        }

        that.renderingHandler = new RenderingHandler(that.channel, that._layoutList, new RenderLib(graph, that._context));

        that.renderingHandler.start();

        return this;
    },


    mouseDoubleClick: function(evt){
      if(this._layoutList){
        this._layoutList.mouseDoubleClick(evt);
      }
    },

    mouseDown: function(evt){
      if(this._layoutList){
        this._layoutList.mouseDown(evt);
      }
      if(this.renderingHandler) // hack until i can be bothered add bus in for the events
          this.renderingHandler.start();
    },

    mouseUp: function(evt){
      if(this._layoutList){
        this._layoutList.mouseUp(evt);
      }
    },

    buttondown: function(evt){
      if(this._layoutList){
        this._layoutList.buttondown(evt);
      }
    },

    buttonup: function(evt){
      if(this._layoutList){
        this._layoutList.buttonup(evt);
      }
    },

    mouseMove: function(evt){
      if(this._layoutList){
        this._layoutList.mouseMove(evt);
      }
      if(this.renderingHandler) // hack until i can be bothered add bus in for the events
          this.renderingHandler.start();
    },

};
