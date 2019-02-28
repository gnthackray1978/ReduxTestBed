

const beginSearch = term => {

  return async dispatch  => {
    dispatch({
      type: "BEGIN_SEARCH",
      term
    });

  };

};


// term => {
//  dispatch(beginSearch(term));
// }
export { beginSearch };
