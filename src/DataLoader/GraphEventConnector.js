export class GraphEventConnector{

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
