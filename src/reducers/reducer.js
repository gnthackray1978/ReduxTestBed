export default (state = {}, action) => {
  switch (action.type) {
    case "TEST":
      return {
        ...state,
        order : action.order,
        orderBy: action.orderBy,
        selected : action.selected,
        rawData: action.rawData,
        page : action.page,
        rowsPerPage: action.rowsPerPage,
    //    test: action.test
      };

    case "BEGIN_SEARCH":
      return {
        ...state,
        term: action.term,
        images: [],
        status: "searching"
      };
    case "DONE_SEARCH":
      return {
        ...state,
        images: action.images,
        status: "done"
      };
    case "ERROR_SEARCH":
      return {
        ...state,
        status: "error"
      };
    case "RUBBISH_SEARCH":
        return {
          ...state,
          status: "rubbish"
        };

    case "CONTROLS_OPEN":
        return {
          ...state,
          controlVisible: true
        };

    case "CONTROLS_CLOSE":
        return {
          ...state,
          controlVisible: false
        };

    // case "NO_GED_DATA":
    //       return {
    //         ...state,
    //         gedLoaded: action.gedLoaded,
    //         gedError : action.gedError
    //       };
    //
    // case "GED_DATA_LOADED":
    //       return {
    //         ...state,
    //         timerStartYear : action.timerStartYear,
    //         gedLoaded : action.gedLoaded,
    //       };

    case "YEAR_INCREMENT_INIT":
          return {
            ...state,
            incrementSize : action.incrementSize,
            timeSpeed : action.timeSpeed
          };

    case "GED_LOAD_STATUS":
          return {
            ...state,
            gedLoadingMessage : action.gedLoadingMessage,
            gedLoadingMessagesDisplayed : action.gedLoadingMessagesDisplayed
          };
    case "GED_LOAD_ERROR":
          return {
            ...state,
            gedLoaded :action.gedLoaded,
            gedError :action.gedError
          };

    case "SET_ROWSPERPAGE":
          return {
            ...state,
            rowsPerPage : action.rowsPerPage
          };

    case "SET_PAGE":
          return {
            ...state,
            page : action.page
          };

    case "SET_SELECTED":
          return {
            ...state,
            selection : action.selection
          };

    case "SET_ORDER":
          return {
            ...state,
            order : action.order,
            orderBy: action.orderBy
          };

    case "SET_DATA":
          return {
            ...state,
            persons : action.persons,
            families: action.families,
            gedDataRange: action.gedDataRange,
            gedLoaded :true
          };

    // case "INIT_PERSON_LIST" :
    //       console.log("INIT_PERSON_LIST" );
    //       return {
    //         ...state,
    //         order : action.order,
    //         orderBy: action.orderBy,
    //         selected : action.selected,
    //         rawData: action.rawData,
    //         page : action.page,
    //         rowsPerPage: action.rowsPerPage,
    //
    //       };

    default:
      return state;
  }
};
