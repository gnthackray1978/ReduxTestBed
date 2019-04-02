export const LayoutBoundaries ={
    drawingCentre : 0.0,
    drawingHeight : 0.0,
    drawingWidth : 0.0,
    drawingX1 : 0.0,
    drawingX2 : 0.0,
    drawingY1 : 0.0,
    drawingY2 : 0.0
};

export class PureFunctions{
   static GetPercDistances(bounds, mouse_x, mouse_y) {


      let _distanceFromX1 = 0.0;
      let _distanceFromY1 = 0.0;
      let _onePercentDistance = 0.0;


      let relativeCursorPosition = {x:0,y:0};

      if (bounds.drawingWidth !== 0 && bounds.drawingHeight !== 0) {
          if (bounds.drawingX1 > 0) {
              _distanceFromX1 = mouse_x - bounds.drawingX1; //;
          }
          else {
              _distanceFromX1 = Math.abs(bounds.drawingX1) + mouse_x;
          }

          _onePercentDistance = bounds.drawingWidth / 100;
          relativeCursorPosition.x = _distanceFromX1 / _onePercentDistance;

          if (bounds.drawingY1 > 0) {
              _distanceFromY1 = mouse_y - bounds.drawingY1; // ;
          }
          else {
              _distanceFromY1 = Math.abs(bounds.drawingY1) + mouse_y;
          }

          _onePercentDistance = bounds.drawingHeight / 100;
          relativeCursorPosition.y = _distanceFromY1 / _onePercentDistance;

      }

      return relativeCursorPosition;

  }

  static LinkContainingPoint(list, mx,my){
    for (var i = 0; i < list.length; i++) {

        if ((list[i].x1 <= mx && list[i].x2 >= mx)  && (list[i].y1 <= my && list[i].y2 >= my))
        {
            return list[i];
        }
    }

    return null;
  }

  static ContainsPerson(personList, person){
    for (var i = 0; i < personList.length; i++) {

        if (personList[i].PersonId == person.PersonId) {
            return true;
        }
    }
    return false;
  }

  static GetBounds(graph){
    let genidx = 0;
    let bounds = LayoutBoundaries;

    bounds.drawingX1 = graph[0][0].X1;
    bounds.drawingX2 = graph[0][0].X2;

    while (genidx < graph.length) {
        if (bounds.drawingX1 > graph[genidx][0].X1)
            bounds.drawingX1 = graph[genidx][0].X1;

        if (bounds.drawingX2 < graph[genidx][graph[genidx].length - 1].X2)
            bounds.drawingX2 = graph[genidx][graph[genidx].length - 1].X2;

        genidx++;
    }

    // top of the screen
    bounds.drawingY1 = graph[graph.length - 1][0].Y2;

    //bottom of the screen
    bounds.drawingY2 = graph[0][0].Y1;

    bounds.drawingHeight = graph[0][0].Y1 - graph[graph.length - 1][0].Y2;

    bounds.drawingCentre = (bounds.drawingX2 - bounds.drawingX1) / 2;
    bounds.drawingWidth = bounds.drawingX2 - bounds.drawingX1;

    return bounds;

  }

  static CalcZoomLevel (zoomPercParam) {
      var _retVal = 0;

      if (zoomPercParam > 0 && zoomPercParam < 40) {
          _retVal = 1;
      }
      else if (zoomPercParam >= 40 && zoomPercParam < 60) {
          _retVal = 2;
      }
      else if (zoomPercParam >= 60 && zoomPercParam <= 150) {
          _retVal = 3;
      }
      else if (zoomPercParam > 150 && zoomPercParam <= 200) {
          _retVal = 4;
      }
      else if (zoomPercParam > 200 && zoomPercParam <= 250) {
          _retVal = 5;
      }
      else if (zoomPercParam > 250 && zoomPercParam <= 300) {
          _retVal = 6;
      }
      else if (zoomPercParam > 300) {
          _retVal = 7;
      }

      return _retVal;
  }
  
  static CalcAreaLevel(area) {
      var _returnVal = 0;

      if (area > 0 && area < 1000) {
          _returnVal = 1;
      }
      else if (area >= 1000 && area < 2500) {
          _returnVal = 2;
      }
      else if (area >= 2500 && area <= 5000) {
          _returnVal = 3;
      }
      else if (area > 5000 && area <= 10000) {
          _returnVal = 4;
      }
      else if (area > 10000 && area <= 15000) {
          _returnVal = 5;
      }
      else if (area > 15000 && area <= 20000) {
          _returnVal = 6;
      }
      else if (area > 20000) {
          _returnVal = 7;
      }

      return _returnVal;
  }

}
