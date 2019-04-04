export default (state = {}, action) => {
  switch (action.type) {
    case "SET_SDLOADVISIBLE":
      return {
      ...state,
      SideDrawerLoaderVisible : action.visible,
    };
    case "SET_SDLAYVISIBLE":
      return {
      ...state,
      SideDrawerLayoutOptionsVisible : action.visible,
    };
    case "SET_SDOPTSVISIBLE":
      return {
        ...state,
        SideDrawerOptionsVisible : action.visible,
    };




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

    case "SET_LAYOUT":
          return {
            ...state,
            layout : action.layout,

          };

    case "SET_CONTEXT":
          return {
            ...state,
            context : action.context,
          };

    case "SET_LAYOUTDEFAULT":
          return {
            ...state,
            layoutDefaults : action.layoutDefaults,
          };

    case "ACTIVATE_GRAPH":
          return {
            ...state,
            graphActive : action.graphActive,
            graphActiveLayout :action.graphActiveLayout,
            graphActiveSelection :action.graphActiveSelection
          };



    case "SET_DATA":
          return {
            ...state,
            persons : action.persons,
            families: action.families,
            gedDataRange: action.gedDataRange,
            gedLoaded :true
          };

    case "ZOOMIN_DOWN":
          return {
            ...state,
            zoomin : action.isSet,
          };

    case "ZOOMOUT_DOWN":
          return {
            ...state,
            zoomout : action.isSet,
          };

    case "MAPUP_DOWN":
          return {
            ...state,
            mapup : action.isSet,
          };

    case "MAPDOWN_DOWN":
          return {
            ...state,
            mapdown : action.isSet,
          };

    case "MAPLEFT_DOWN":
          return {
            ...state,
            mapleft : action.isSet,
          };

    case "MAPRIGHT_DOWN":
          return {
            ...state,
            mapright : action.isSet,
          };

    case "TOGGLE_GRAPHRUNNING":
          return {
            ...state,
            graphRunning : action.isSet,
          };

    default:
      return state;
  }
};
