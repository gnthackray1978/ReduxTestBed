
export const beginSearch = term => {

  return async dispatch  => {
    dispatch({
      type: "BEGIN_SEARCH",
      term
    });

  };

};


export const reset = term => {

  return async dispatch  => {
    dispatch({
      type: "DONE_SEARCH",
      term
    });

  };

};
