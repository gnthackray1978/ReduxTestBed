
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


export const gedParseComplete = (persons, range) => {
  if(persons == undefined || persons == null || persons.length ==0){
    return async dispatch  => {
      dispatch({
        type: "NO_GED_DATA",
        gedLoaded:false,
        gedError : 'No Data'
      });

    };
  }

  return async dispatch  => {
    dispatch({
      type: "GED_DATA_LOADED",
      timerStartYear : Number(range.s)+50,
      gedLoaded : true,
      getError : '',
      rawGed : persons
    });

  };

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
      orderBy : orderby
    });
  };
}

// export const testcreator = (order,orderBy,selected,data,page,rowsPerPage) =>{
//   return async dispatch  => {
//     dispatch({
//       type: "TEST",
//       order : order,
//       orderBy : orderBy,
//       selected : selected,
//       rawData : data,
//       page : page,
//       rowsPerPage : rowsPerPage
//
//     });
//   };
// }

// order: 'asc',
// orderBy: 'calories',
// selected: [],
// data: [
//   createData('Cupcake', 305, 3.7, 67, 4.3),
//   createData('Donut', 452, 25.0, 51, 4.9),
//   createData('Eclair', 262, 16.0, 24, 6.0),
//   createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
//   createData('Gingerbread', 356, 16.0, 49, 3.9),
//   createData('Honeycomb', 408, 3.2, 87, 6.5),
//   createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
//   createData('Jelly Bean', 375, 0.0, 94, 0.0),
//   createData('KitKat', 518, 26.0, 65, 7.0),
//   createData('Lollipop', 392, 0.2, 98, 0.0),
//   createData('Marshmallow', 318, 0, 81, 2.0),
//   createData('Nougat', 360, 19.0, 9, 37.0),
//   createData('Oreo', 437, 18.0, 63, 4.0),
// ],
// page: 0,
// rowsPerPage: 5,

// export const initPersonList = (order,orderBy,selected,data,page,rowsPerPage) =>{
//   return async dispatch  => {
//     dispatch({
//       type: "INIT_PERSON_LIST",
//       order : order,
//       orderBy : orderBy,
//       selected : selected,
//       rawData : data,
//       page : page,
//       rowsPerPage : rowsPerPage
//     });//'asc','calories',d,[],0,5
//   };
// }

export const setData = (rawData) =>{
  return async dispatch  => {
    dispatch({
      type: "SET_DATA",
      rawData : rawData
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
