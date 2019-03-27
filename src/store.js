import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";

import reducer from "./reducers/reducer.js";

export default createStore(
  reducer,
  {
    term: "",
    status: "initial",
    order : 'asc',
    orderBy : 'date',
    selection : [],
    rawData : [],
    persons :[],
    families :[],
    gedDataRange: {s:0, e:2000},
    page : 0,
    rowsPerPage : 8,
    layout : 'descendents',
    gedLoaded :true,
    gedError :'',
    gedLoadingMessage : '',
    gedLoadingMessagesDisplayed : false,
    graphRunning : false,
    graphActive : false,
    graphActiveLayout  : 'descendents',
    graphActiveSelection :[],
    context : null,
    zoomin:false,
    zoomout:false,
    mapup:false,
    mapdown: false,
    mapleft :false,
    mapright :false,
    layoutDefaults :{
      topSpan :20.0,
      middleSpan :40.0,
      lowerSpan :20.0,
      distancesbetfam :100.0,
      boxHeight :70.0,
      boxWidth :70.0,
      distanceBetweenGens :170.0,
      distanceBetweenBoxs :30.0,
      zoomLevel :Number(100),
      zoomPercentage : 100.0,
      halfBoxWidth : 35.0,
      halfBoxHeight :35.0
    }

  },
  applyMiddleware(thunk)
);
