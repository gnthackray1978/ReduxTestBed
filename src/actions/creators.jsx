
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
