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
    rowsPerPage : 9,
    gedLoaded :true,
    gedError :'',
    gedLoadingMessage : '',
    gedLoadingMessagesDisplayed : false
  },
  applyMiddleware(thunk)
);
