
export const beginSearch = term => {

  return async dispatch  => {
    dispatch({
      type: "BEGIN_SEARCH",
      term
    });

  };

};


export const switchControlVisbility = controlVisible =>{

  if(controlVisible){
    return async dispatch  => {
      dispatch({
        type: "CONTROLS_OPEN",
      });

    };
  }
  else{
    return async dispatch  => {
      dispatch({
        type: "CONTROLS_CLOSE",
      });

    };
  }


};



export const initYearIncrementor = (increment,speed) => {
  return async dispatch  => {
    dispatch({
      type: "YEAR_INCREMENT_INIT",
      incrementSize : increment,
      timeSpeed : speed
    });
  };
};

export const gedLoadingStatus = (message, show) => {
  return async dispatch  => {
    dispatch({
      type: "GED_LOAD_STATUS",
      gedLoadingMessage : message,
      gedLoadingMessagesDisplayed : show
    });
  };
};

export const setContext = (context) => {
  return async dispatch  => {
    dispatch({
      type: "SET_CONTEXT",
      context : context
    });
  };
};

export const gedLoadFailed = (message) => {
  return async dispatch  => {
    dispatch({
      type: "GED_LOAD_ERROR",
      gedLoaded :false,
      gedError :message
    });
  };
};

export const setRowsPerPage = rowsPerPage =>{
  return async dispatch  => {
    dispatch({
      type: "SET_ROWSPERPAGE",
      rowsPerPage : rowsPerPage,

    });
  };
}

export const setPage = page =>{
  return async dispatch  => {
    dispatch({
      type: "SET_PAGE",
      page :page
    });
  };
}

export const setSelected = selection =>{
  return async dispatch  => {
    dispatch({
      type: "SET_SELECTED",
      selection :selection
    });
  };
}

export const setOrder = (order,orderBy) =>{
  return async dispatch  => {
    dispatch({
      type: "SET_ORDER",
      order :order,
      orderBy : orderBy
    });
  };
}

export const setLayout = (layout) =>{
  return async dispatch  => {
    dispatch({
      type: "SET_LAYOUT",
      layout : layout
    });
  };
}

export const activateLayout = (isActive,graphActiveLayout,graphActiveSelection) =>{
  return async dispatch  => {
    dispatch({
      type: "ACTIVATE_GRAPH",
      graphActive : isActive,
      graphActiveLayout : graphActiveLayout,
      graphActiveSelection : graphActiveSelection
    });
  };
}


export const setGedData = (persons, families,range) =>{
  return async dispatch  => {
    dispatch({
      type: "SET_DATA",
      persons : persons,
      families : families,
      gedDataRange :range
    });
  };
}



export const reset = term => {

  if(term =="rubbish"){
    return async dispatch  => {
      dispatch({
        type: "RUBBISH_SEARCH",
        term
      });

    };
  }else {
    return async dispatch  => {
      dispatch({
        type: "DONE_SEARCH",
        term
      });

    };
  }


};
