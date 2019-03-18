import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";

import reducer from "./reducers/reducer.js";

export default createStore(
  reducer,
  {
    term: "",
    status: "initial",
    order : 'asc',
    orderBy : 'calories',
    selection : [],
    rawData : [],
    page : 0,
    rowsPerPage : 5
  },
  applyMiddleware(thunk)
);
