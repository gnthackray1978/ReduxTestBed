/*global requestAnimationFrame*/

import {TreeBase} from "./TreeBase.js";
import {TreeUI} from "./TreeUI.js";


export function DescTree() {
    console.log('tree created');


    this._qryString = '';
    this.bt_refreshData =false;
    this.bt_screenHeight = 0.0;
    this.bt_screenWidth = 0.0;

    this.bt_buttonLinks = [];
    this.bt_links = [];

  //  this.inLink = false;

    this.generations = [];
  //  this.familiesPerGeneration = [];
    this.familySpanLines = [];
    this.childlessMarriages = [];

    this.centrePoint = 750.0;
    this.centreVerticalPoint = 0.0;
    this.zoomLevel = 0.0;
    this.centrePointXOffset = 0.0;
    this.centrePointYOffset = 0.0;

    this.original_distanceBetweenBoxs = 0.0;
    this.original_distanceBetweenGens = 0.0;
    this.original_boxWidth = 0.0;
    this.original_boxHeight = 0.0;
    this.original_distancesbetfam = 0.0;
    this.original_lowerStalkHeight = 0.0;

    this.original_middleSpan = 40.0;
    this.original_topSpan = 20.0;



    this.zoomPercentage = 0.0;
    this.distanceBetweenBoxs = 0.0;
    this.distanceBetweenGens = 0.0;
    this.halfBox = 0.0;
    this.halfBoxHeight = 0.0;


    this.mouse_x = 0; //int
    this.mouse_y = 0; //int

//    this.initial_mouse_x = 0; //int
//    this.initial_mouse_y = 0; //int

  //  this.xFromCentre = 0.0;
  //  this.yFromCentre = 0.0;

    this.drawingX1 = 0.0;
    this.drawingX2 = 0.0;
    this.drawingY1 = 0.0;
    this.drawingY2 = 0.0;

    this.drawingCentre = 0.0;
    this.drawingWidth = 0.0;
    this.drawingHeight = 0.0;

    this.mouseXPercLocat = 0.0;
    this.mouseYPercLocat = 0.0;

    this.zoomAmount = 8; //int

    this.boxWidth = 0.0;
    this.boxHeight = 0.0;
    this.sourceId = null;


    this.selectedPersonId = '';
    this.selectedPersonX = 0;
    this.selectedPersonY = 0;
    this.treeUI;

    this.distancesbetfam = 0.0;
    this.lowerSpan = 0.0;
    this.middleSpan = 0.0;
    this.topSpan = 0.0;




    this.startx1 = 0.0;
    //this.endx2 = 0.0;


    this.firstPX = 0.0;
    this.secondPX = 0.0;
    this.percX1 = 0.0;
    this.percY1 = 0.0;

  //  this.BaseSetZoom = this.SetZoom;
}


DescTree.prototype = {

    LinkContainingPoint :function(list, mx,my){

     for (var i = 0; i < list.length; i++) {

         if ((list[i].x1 <= mx && list[i].x2 >= mx)  && (list[i].y1 <= my && list[i].y2 >= my))
         {
             return list[i];
         }
     }

     return null;

    },


    ContainsPerson : function (value) {
       for (var i = 0; i < this.length; i++) {

           if (this[i].PersonId == value.PersonId) {
               return true;
           }
       }
       return false;
    },

    SetZoom: function (p_percentage) {


        var workingtp = this.original_lowerStalkHeight / 100;

        this.lowerSpan = workingtp * this.zoomPercentage; // (int)original_lowerStalkHeight;

        workingtp = this.original_middleSpan / 100;

        this.middleSpan = workingtp * this.zoomPercentage; //(int)original_middleSpan;

        workingtp = this.original_topSpan / 100;

        this.topSpan = workingtp * this.zoomPercentage; //(int)original_topSpan;


        //this.BaseSetZoom(Number(p_percentage));

        let percentage =Number(p_percentage);

        if (percentage !== 0.0) {
            var _workingtp = 0.0;
            var _percLocal_x = 0.0;
            var _percLocal_y = 0.0;

            //zoom drawing components
            this.zoomPercentage += percentage;
            this.zoomLevel += percentage;
            _workingtp = this.original_distanceBetweenBoxs / 100;
            this.distanceBetweenBoxs = _workingtp * this.zoomPercentage;
            _workingtp = this.original_boxWidth / 100;
            this.boxWidth = _workingtp * this.zoomPercentage;
            this.halfBox = this.boxWidth / 2;
            _workingtp = this.original_distancesbetfam / 100;
            _workingtp = this.original_distanceBetweenGens / 100;
            this.distanceBetweenGens = _workingtp * this.zoomPercentage;
            _workingtp = this.original_boxHeight / 100;
            this.boxHeight = _workingtp * this.zoomPercentage;

            this.halfBoxHeight = this.boxHeight / 2;

            this.ComputeLocations();

            this.GetPercDistances();
            _percLocal_x = this.percX1;
            _percLocal_y = this.percY1;


            this.centreVerticalPoint += (this.drawingHeight / 100) * (_percLocal_y - this.mouseYPercLocat);

            this.centrePoint += (this.drawingWidth / 100) * (_percLocal_x - this.mouseXPercLocat);

            this.ComputeLocations();
        } //end percentage ==0.0)



        this.DrawTree();
    },

    DrawTree: function () {
       this.DrawTreeInner();
    },

    DrawTreeInner: function () {

        this.ComputeLocations();

        this.treeUI.ClearContext();

        var _genidx = 0;
        var _personIdx = 0;
       
        try {
            this.treeUI.UpdateUI(this.bt_screenWidth, this.bt_screenHeight, this.boxWidth, this.boxHeight);
        } catch(e) {
            console.log('error UpdateUI ' + e);
        }





        this.bt_links = [];
        this.bt_buttonLinks = [];

        //      $("#body").remove(".tree_Links");

        //html('<span>Downloading Descendant Tree</span>');


        // try {

            while (_genidx < this.generations.length) {
                _personIdx = 0;

                while (_personIdx < this.generations[_genidx].length) {

                    var _person = this.generations[_genidx][_personIdx];

                    var personLink = this.treeUI.DrawPerson(_person, this.sourceId, this.zoomPercentage);

                    if (personLink !== null)
                        this.bt_links.push(personLink);

                    if (_person.GenerationIdx != 0) {
                        var buttonLink = this.treeUI.DrawButton(_person, this.GetChildDisplayStatus(_person));

                        if (buttonLink !== null)
                            this.bt_buttonLinks.push(buttonLink);
                    }

                    _personIdx++;
                }
                _genidx++;
            }

        //
        // } catch (e) {
        //     console.log('error drawing person or button: idx ' + _genidx + ' ' + _personIdx);
        // }






        var _fslOuter = 0;
        var _fslInner = 0;
        //   var _pointIdx = 0;


        try {
            while (_fslOuter < this.familySpanLines.length) {
                _fslInner = 0;
                while (_fslInner < this.familySpanLines[_fslOuter].length) {

                    //if (_fslOuter == 7 && _fslInner == 15) {
                    this.treeUI.DrawLine(this.familySpanLines[_fslOuter][_fslInner]);
                    // }
                    _fslInner++;


                } // end familySpanLines[_fslOuter].length

                _fslOuter++;
            } // end this.familySpanLines.length


        } catch (e) {
            console.log('error drawing familySpanLines: familySpanLines idx ' + _fslOuter + ' ' + _fslInner);
        }



        _fslOuter = 0;

        try {
            while (_fslOuter < this.childlessMarriages.length) {

                this.treeUI.DrawLine(this.childlessMarriages[_fslOuter]);

                _fslOuter++;
            }
        } catch (e) {
            console.log('error drawing childless marriages: marriage idx ' + _fslOuter);
        }


    },

    ComputeLocations: function () {

        if (this.generations.length === 0) {
            return;
        }

        // unused
        var _displayGenCount = 0;
        var _genIdx = 0;

        this.childlessMarriages = [];

        this.drawingX2 = 0.0;


        this.familySpanLines = [];


        //initialize familyspan array
     //   while (_genIdx < this.generations.length) {

     //       this.familySpanLines.push([]);

     //       _genIdx++;
     //   }





        _genIdx = 0;

        var lastPersonY2 = 0.0;

        while (_genIdx < this.generations.length) {
            this.familySpanLines.push([]);

            //IsGenerationDisplayed
      //      var tp = this.IsGenerationDisplayed(_genIdx);
        //    if (tp != this.generations[_genIdx].GenerationVisible) {
         //       console.log('gen visible wrong');
        //    }



            if (this.generations[_genIdx].GenerationVisible) {
                _displayGenCount++;

                this.startx1 = this.SetScheduleVars(_genIdx, this.startx1);

                this.fillGenXs(_genIdx);



                var _current_gen_upper_y = (_genIdx * this.boxHeight) + (_genIdx * this.distanceBetweenGens) + this.centreVerticalPoint;



                var _increment_temp = 0.0;

                var _famIdx = 0;

                var familydirectionCounts = this.createFamilyCountArray(_genIdx);

                var _familyIdx = -1;
                var _personIdx = 0;

                while (_personIdx < this.generations[_genIdx].length) {

                    var genPerson = this.generations[_genIdx][_personIdx];



                    if (genPerson.IsDisplayed) {
                        //  console.log('displaying: ' + genPerson.Name);

                        genPerson.X2 = genPerson.X1 + this.boxWidth;

                        var _isDoubleSpouseEnd = false;
                        var _isSpouse = genPerson.IsHtmlLink;

                        if (_isSpouse) {

                            if ((this.generations[_genIdx].length > _personIdx + 1) && this.generations[_genIdx][_personIdx + 1].IsHtmlLink) {
                                _isDoubleSpouseEnd = true;
                                //  console.log('double spouse: ' + _genIdx + ',' + _personIdx);
                            }

                        }

                        var _parent_gen_lower_y = 0.0;
                        if (genPerson.IsFamilyStart) {
                            _familyIdx++;
                            // this.familySpanLines[_genIdx][_familyIdx] = [];
                            this.familySpanLines[_genIdx].push([]);
                        }



                        if (genPerson.SpouseIdxLst.length > 0 && genPerson.ChildCount === 0 && !_isSpouse) {
                            var spouseIdx = genPerson.SpouseIdxLst[0];
                            var tp = this.generations[_genIdx][spouseIdx].X1;

                            if (Math.abs(spouseIdx - _personIdx) <= 2) {
                                if (this.generations[_genIdx][spouseIdx].ChildCount === 0) {

                                    var marriagePoints = new Array();

                                    var myArray = new Array((genPerson.X1 + this.halfBox), (_current_gen_upper_y + this.boxHeight));
                                    marriagePoints.push(myArray);
                                    myArray = new Array((genPerson.X1 + this.halfBox), (_current_gen_upper_y + this.boxHeight + this.topSpan));
                                    marriagePoints.push(myArray);
                                    myArray = new Array((tp + this.halfBox), (_current_gen_upper_y + this.boxHeight + this.topSpan));
                                    marriagePoints.push(myArray);
                                    myArray = new Array((tp + this.halfBox), (_current_gen_upper_y + this.boxHeight));
                                    marriagePoints.push(myArray);

                                    this.childlessMarriages.push(marriagePoints);
                                }
                            }

                        } //end genPerson.SpouseIdxLst.length > 0 && genPerson.ChildCount


                        var _middleParents = 0.0;
                        //   var firstPX = 0.0;
                        //   var secondPX = 0.0;

                        var _thirdStorkX = 0.0;

                        if (_genIdx > 0){
                            if( this.generations[_genIdx - 1][genPerson.FatherIdx] == undefined){
                              console.log('error');
                            }
                            _parent_gen_lower_y = this.generations[_genIdx - 1][genPerson.FatherIdx].Y2;
                        }
                        var _firstRow = _current_gen_upper_y - this.lowerSpan;
                        var _secondRow = _parent_gen_lower_y + this.middleSpan; // changed with increment later on - need to calculate the maximum and minimum this increment will be
                        var _thirdRow = _parent_gen_lower_y + this.middleSpan;
                        var _fourthRow = _parent_gen_lower_y + this.topSpan;

                        if ((!(genPerson.IsFamilyEnd && _isSpouse)) && _genIdx > 0) {
                            if (!_isDoubleSpouseEnd) {
                                var _family = this.familySpanLines[_genIdx][_familyIdx];

                                //  console.log(genPerson.Name);

                                _family.push(new Array((genPerson.X1 + this.halfBox), _firstRow));

                                if (!_isSpouse)
                                    _family.push(new Array((genPerson.X1 + this.halfBox), _current_gen_upper_y));

                                _family.push(new Array((genPerson.X1 + this.halfBox), _firstRow));
                            }
                        }



                        if (genPerson.IsParentalLink && _genIdx > 0) {



                            _middleParents = this.MiddleParents(_genIdx, genPerson.FatherIdx, genPerson.MotherIdx);

                            var _nextParentLink = this.GetFirst(_genIdx, genPerson.FatherIdx, genPerson.MotherIdx);
                            var _prevParentLink = this.GetPrev(_genIdx, genPerson.FatherIdx, genPerson.MotherIdx);

                            this.GetParentXs(_genIdx, genPerson.FatherIdx, genPerson.MotherIdx);

                            var incSize = 0;

                            incSize = this.distanceBetweenGens - this.middleSpan - this.lowerSpan;
                            incSize = incSize / familydirectionCounts[_famIdx];


                            if (_famIdx === 0) {
                                if (genPerson.X1 > _middleParents)
                                    _increment_temp = this.distanceBetweenGens - this.middleSpan - this.lowerSpan;
                                else
                                    _increment_temp = 0.0;
                            }


                            if (genPerson.X1 > _middleParents) {
                                _increment_temp -= incSize; //original

                                if (_nextParentLink > genPerson.X2)
                                    _thirdStorkX = genPerson.X2;
                                else
                                    _thirdStorkX = _nextParentLink;

                                if ((genPerson.X1 > _middleParents) && (_thirdStorkX > genPerson.X1)) {
                                    _thirdStorkX = genPerson.X1;
                                }
                            }
                            else {
                                _increment_temp += incSize; //original

                                if (_prevParentLink < genPerson.X1)
                                    _thirdStorkX = genPerson.X1;
                                else
                                    _thirdStorkX = _prevParentLink;

                                if ((genPerson.X1 < _middleParents) && (_thirdStorkX < genPerson.X1)) {
                                    _thirdStorkX = genPerson.X1;
                                }
                            }


                            _secondRow += _increment_temp;


                            //tweak start of rows
                            //(Math.abs(double1 - double2) <= precision)

                            if (Math.abs(_firstRow - _secondRow) <= 1) {
                                _secondRow -= (incSize / 2);
                            }





                            var _secondStorkX = genPerson.X1;

                            if (genPerson.IsFamilyStart && genPerson.IsFamilyEnd) {
                                // only child with no spouses!
                                if (_personIdx === 0) {
                                    var _nextFamilyStart = 0;


                                    if (this.generations[_genIdx].Count > 1) {
                                        _nextFamilyStart = this.generations[_genIdx][_personIdx + 1].X1;
                                    }
                                    else {
                                        _nextFamilyStart = this.generations[_genIdx][_personIdx].X2;
                                    }

                                    if (_middleParents < _nextFamilyStart && _middleParents > this.generations[_genIdx][_personIdx].X1) {
                                        _secondStorkX = _middleParents;
                                        _thirdStorkX = _middleParents;
                                    }

                                }
                            }
                            else {
                                // handles situations where lines are overlapping the next or prev
                                // family
                                // happens when there are just 1 or 2 families
                                // and one of them is unusually large or something like that.

                                if (genPerson.IsFamilyStart) {
                                    // tidy up the link to the parents

                                    var _sizeToAdd = this.halfBox;

                                    if (!genPerson.IsFamilyEnd) {
                                        _sizeToAdd = this.boxWidth;
                                    }

                                    if (_secondStorkX == _thirdStorkX) {
                                        _thirdStorkX += _sizeToAdd;
                                    }


                                    _secondStorkX += _sizeToAdd;


                                }

                            }

                            //endregion
                            var _family0 = this.familySpanLines[_genIdx][_familyIdx];


                            _family0.push(new Array(_secondStorkX, _firstRow));
                            _family0.push(new Array(_secondStorkX, _secondRow));
                            _family0.push(new Array(_thirdStorkX, _secondRow));
                            _family0.push(new Array(_thirdStorkX, _thirdRow));
                            _family0.push(new Array(_middleParents, _thirdRow));
                            _family0.push(new Array(_middleParents, _fourthRow));
                            _family0.push(new Array(this.firstPX, _fourthRow));
                            _family0.push(new Array(this.firstPX, _parent_gen_lower_y));
                            _family0.push(new Array(this.firstPX, _fourthRow));

                            _family0.push(new Array(this.secondPX, _fourthRow));
                            _family0.push(new Array(this.secondPX, _parent_gen_lower_y));
                            _family0.push(new Array(this.secondPX, _fourthRow));
                            _family0.push(new Array(_middleParents, _fourthRow));
                            _family0.push(new Array(_middleParents, _thirdRow));

                            _family0.push(new Array(_thirdStorkX, _thirdRow));
                            _family0.push(new Array(_thirdStorkX, _secondRow));

                            _family0.push(new Array(_secondStorkX, _secondRow));
                            _family0.push(new Array(_secondStorkX, _firstRow));

                            _famIdx++;
                        } //end (genPerson.IsParentalLink && _genIdx > 0)


                        genPerson.Y1 = _current_gen_upper_y;
                        genPerson.Y2 = _current_gen_upper_y + this.boxHeight;

                        lastPersonY2 = genPerson.Y2;

                        this.CalcTPZoom(_genIdx, _personIdx);







                    } // end (genPerson.IsDisplayed)


                    _personIdx++;
                } //end while

            }


            _genIdx++;
        }

        if (this.generations.length > 0) {
            this.drawingY1 = this.generations[0][0].Y1;
        }

        if (this.generations[_displayGenCount - 1].length > 0) {
            this.drawingY2 = lastPersonY2;
        }
        //drawingCentreVertical = drawingY2 - drawingY1;
        this.drawingCentre = (this.drawingX2 - this.drawingX1) / 2;
        this.drawingHeight = this.drawingY2 - this.drawingY1;
        this.drawingWidth = this.drawingX2 - this.drawingX1;

    },

    //run when generation is loaded
    //run when visibility changed
    UpdateGenerationState: function () {

        //console.log('DescTree.UpdateGenerationState');

        var familyCount = 0;
        var personCount = 0;
        var isDisplayed = true;
        var genIdx = 0;
        var personIdx = 0;
        var firstVisibleIdx = -1;
        var lastVisibleIdx = -1;
        var firstFamilyIdx = -1;
        var lastFamilyIdx = -1;

        this.childlessMarriages = [];

        this.familySpanLines = [];
        // initialize familyspan array
        // set generation variables
        // visible family count
        // visible person count
        // generation displayed
        while (genIdx < this.generations.length) {
            this.familySpanLines.push([]);

            personIdx = 0;
            isDisplayed = false;
            familyCount = 0;
            personCount = 0;
            firstVisibleIdx = -1; // there might not be anything visible so we need this to be -1
            lastVisibleIdx = -1;
            firstFamilyIdx = 0; //should always be a family
            lastFamilyIdx = 0;

            while (personIdx < this.generations[genIdx].length) {
                if (this.generations[genIdx][personIdx].IsDisplayed) {
                    if (this.generations[genIdx][personIdx].IsFamilyStart) {
                        familyCount++;
                    }

                    personCount++;

                    isDisplayed = true;

                    lastVisibleIdx = personIdx;

                    if (this.generations[genIdx][personIdx].ChildLst.length > 0) {

                        lastFamilyIdx = personIdx;

                        if (firstFamilyIdx == -1) firstFamilyIdx = personIdx;
                    }


                    if (firstVisibleIdx == -1) firstVisibleIdx = personIdx;


                }
                personIdx++;
            }

            this.generations[genIdx].VisibleFamilyCount = familyCount;
            this.generations[genIdx].VisiblePersonCount = personCount;
            this.generations[genIdx].GenerationVisible = isDisplayed;
            this.generations[genIdx].FirstVisibleIdx = firstVisibleIdx;
            this.generations[genIdx].LastVisibleIdx = lastVisibleIdx;
            this.generations[genIdx].FirstFamilyIdx = firstFamilyIdx;
            this.generations[genIdx].LastFamilyIdx = lastFamilyIdx;


            genIdx++;
        }



    },


    SetScheduleVars: function (genidx, currentRowX1) {
      //  var idx = 0;
        var prevGenX1 = 0.0;
        var prevGenX2 = 0.0;
      //  var innercount = 0;

        //var currentRowX1 = 0;
      //  var tp = currentRowX1;

        try {



            if (genidx === 0) {
                this.drawingX1 = currentRowX1;
                currentRowX1 = this.centrePoint - (((this.generations[genidx].length * this.boxWidth) + ((this.generations[genidx].length - 1) * this.distanceBetweenBoxs)) / 2);
            }
            else {
                prevGenX1 = this.generations[genidx - 1][this.generations[genidx - 1].FirstFamilyIdx].X1;
                prevGenX2 = this.generations[genidx - 1][this.generations[genidx - 1].LastFamilyIdx].X1 + this.boxWidth;

                currentRowX1 = prevGenX1 + (this.boxWidth / 2);
                var endx2 = prevGenX2 - (this.boxWidth / 2);

                var _prevGenLen = endx2 - currentRowX1;

                var _curGenLen = (this.generations[genidx].VisiblePersonCount * (this.boxWidth + this.distanceBetweenBoxs)) - (this.distanceBetweenBoxs * this.generations[genidx].VisibleFamilyCount);
                if (_prevGenLen > _curGenLen) {
                    this.distancesbetfam = (_prevGenLen - _curGenLen) / this.generations[genidx].VisibleFamilyCount;
                }
                else {
                    this.distancesbetfam = (this.original_distancesbetfam / 100) * this.zoomPercentage;
                }
                //add in the distances between the families
                _curGenLen = _curGenLen + (this.distancesbetfam * (this.generations[genidx].VisibleFamilyCount - 1));
                // middle of the families of the previous generation
                var _desiredMidPoint = ((endx2 - currentRowX1) / 2) + currentRowX1;
                // set new start point by subtracting half the total space required for the generation
                currentRowX1 = _desiredMidPoint - (_curGenLen / 2);

            }

        } catch (e) {
            console.log('SetScheduleVars: ' + genidx + ' exception: ' + e);

            if (this.generations.length > genidx - 1) {
                console.log('SetScheduleVars ffidx: ' + this.generations[genidx - 1].FirstFamilyIdx + ' lfidx: ' + this.generations[genidx - 1].LastFamilyIdx);
            }
        }

      //  console.log('SetScheduleVars:' + (currentRowX1-tp) + ' ' + tp + ' ' + currentRowX1);
        return currentRowX1;

    },

    fillGenXs: function (genidx) {

        var idx = 0;
        var _currentDistanceBetweenBoxes = 0.0;
        var innerIdx = 0;
        var prevPerson = null;

       // console.log('moved diagram to: ' + this.startx1 + ' from ' + this.generations[genidx][idx].X1 + ' (' + (this.generations[genidx][idx].X1 - this.startx1) + ')');

        while (idx < this.generations[genidx].length) {

            if (this.generations[genidx][idx].IsDisplayed) {

                if (innerIdx === 0) {
                    this.generations[genidx][idx].X1 = this.startx1;
                    this.generations[genidx][idx].X2 = this.startx1 + this.boxWidth;
                }
                else {
                    if (this.generations[genidx][idx].IsFamilyStart) {
                        _currentDistanceBetweenBoxes = this.distancesbetfam;
                    }
                    else {
                        _currentDistanceBetweenBoxes = this.distanceBetweenBoxs;
                    }

                    this.generations[genidx][idx].X1 = prevPerson.X1 + this.boxWidth + _currentDistanceBetweenBoxes;
                    this.generations[genidx][idx].X2 = this.generations[genidx][idx].X1 + this.boxWidth;
                }
                prevPerson = this.generations[genidx][idx];
                innerIdx++;

            }

            idx++;
        }
    },

    createFamilyCountArray: function (genidx) {

        var newswitchs = Array();
        var leftCounter = 0.0;
        var rightCounter = 0.0;
        var idx = 0;

        if (genidx !== 0) {
            while (idx < this.generations[genidx].length) {
                var _tp = this.generations[genidx][idx];
                if (_tp.IsParentalLink &&
                        _tp.IsDisplayed) {
                    newswitchs.push(0.0);
                    if (_tp.X1 > this.MiddleParents(genidx, _tp.FatherIdx, _tp.MotherIdx)) {
                        rightCounter++;
                        if (leftCounter > 0)
                            newswitchs[newswitchs.length - 2] = leftCounter;
                        leftCounter = 0;
                    }
                    else {
                        leftCounter++;
                        if (rightCounter > 0)
                            newswitchs[newswitchs.length - 2] = rightCounter;
                        rightCounter = 0;
                    }
                }
                idx++;
            }
            if (leftCounter !== 0) newswitchs[newswitchs.length - 1] = leftCounter;
            if (rightCounter !== 0) newswitchs[newswitchs.length - 1] = rightCounter;
            idx = newswitchs.length - 1;
            while (idx > 0) {
                if (newswitchs[idx - 1] === 0)
                    newswitchs[idx - 1] = newswitchs[idx];
                idx--;
            }
        }
        return newswitchs;
    },

    MiddleParents: function (genidx, fatIdx, motIdx) {
        // return
        var middleParents = 0.0;


        // returns 1 less than the furthest parent to the right!

        // midx = 22
        // fidx = 25 // F25 M24

        // midx = 25
        // fidx = 22 // 24 25

        // if the parent had more than 1 spouse then 2 parents might not be next to each other in the generation.
        if (Math.abs(fatIdx - motIdx) > 1) {
            if (fatIdx < motIdx) {
                middleParents = (this.generations[genidx - 1][motIdx - 1].X1 + this.generations[genidx - 1][motIdx].X2) / 2;
            }
            else {
                middleParents = (this.generations[genidx - 1][fatIdx - 1].X1 + this.generations[genidx - 1][fatIdx].X2) / 2;
            }
        }
        else {
            middleParents = (this.generations[genidx - 1][fatIdx].X1 + this.generations[genidx - 1][motIdx].X2) / 2;
        }

        return middleParents;
    },

    GetParentXs: function (genidx, fatIdx, motIdx) {

        if (genidx < 1) {
            this.secondPX = this.centrePoint;
            this.firstPX = this.centrePoint;
        }
        else {
            if (this.generations[genidx - 1][fatIdx].X1 > this.generations[genidx - 1][motIdx].X1) {
                this.secondPX = this.generations[genidx - 1][fatIdx].X1 + this.halfBox;
                this.firstPX = this.generations[genidx - 1][motIdx].X1 + this.halfBox;

            }
            else {
                this.secondPX = this.generations[genidx - 1][motIdx].X1 + this.halfBox;
                this.firstPX = this.generations[genidx - 1][fatIdx].X1 + this.halfBox;
            }
        }

    },

    GetFirst: function (genidx, fatIdx, motIdx) {
        var middleParents = this.MiddleParents(genidx, fatIdx, motIdx);
        var nextParentLink = middleParents;
        var idxParentLink = motIdx;

        // if we only have 1 parent, but that parent
        // later remarries we want the next nextparent setting to the current parents edge
        if (fatIdx == motIdx) {
            //remember fatidx and motidx are the same!
            if (this.generations[genidx - 1][fatIdx].SpouseIdLst.length > 0) {
                return this.generations[genidx - 1][fatIdx].X2;
            }
        }

        // if multiple spouses set next parent as end of first one
        if (this.generations[genidx - 1][fatIdx].SpouseIdLst.length > 1) {
            if (Math.abs(fatIdx - motIdx) == 1) {
                return nextParentLink;
            }
        }

        if (fatIdx > motIdx) idxParentLink = fatIdx;

        var rightX2OfCurrentParent = this.generations[genidx - 1][idxParentLink].X2;

        var idx = 0;

        var _treePerson = null;

        var isFound = false;
        while (idx < this.generations[genidx - 1].length) {
            if (this.generations[genidx - 1][idx].IsDisplayed
                && this.generations[genidx - 1][idx].ChildCount > 0
                && this.generations[genidx - 1][idx].X1 > rightX2OfCurrentParent) {
                isFound = true;
                _treePerson = this.generations[genidx - 1][idx];
                break;
            }
            idx++;
        }

        if (isFound)
            nextParentLink = this.generations[genidx - 1][idx].X1;

        return nextParentLink;
    },

    GetPrev: function (genidx, fatIdx, motIdx) {

        var middleParents = (this.generations[genidx - 1][fatIdx].X1 + this.generations[genidx - 1][motIdx].X2) / 2;

        var prevParentLink = middleParents;

        //left parent
        var idxParentLink = fatIdx;
        if (fatIdx > motIdx) idxParentLink = motIdx;

        var currentParentsLeft = this.generations[genidx - 1][idxParentLink].X1;

        if (this.generations[genidx - 1][fatIdx].SpouseIdLst.length > 1) {

            if (Math.abs(fatIdx - motIdx) == 2) {
                return prevParentLink;
            }

        }


        var idx = 0;

        var _treePerson = null;

        while (idx < this.generations[genidx - 1].length) {
            if (this.generations[genidx - 1][idx].IsDisplayed
                    && this.generations[genidx - 1][idx].ChildCount > 0
                    && this.generations[genidx - 1][idx].X1 < currentParentsLeft) {
                _treePerson = this.generations[genidx - 1][idx];

            }
            idx++;
        }

        // if(_treePerson != null)
        //   console.log('last person ' + _treePerson.Name);

        if (_treePerson != null)
            prevParentLink = _treePerson.X2;


        return prevParentLink;
    },

    SetInitialValues: function (zoomPerc,
                                        dist_bet_box,
                                        dist_bet_gen,
                                        box_wid,
                                        box_hig,
                                        dist_bet_fam,
                                        low_stalk_hi,
                                        mid_span,
                                        top_span,
                                        screen_width,
                                        screen_height
                                        ) {

            this.centrePoint = 750.0;
            this.centreVerticalPoint = 0.0;
            this.zoomLevel = 0.0;
            this.centrePointXOffset = 0.0;
            this.centrePointYOffset = 0.0;
            this.mouse_x = 0; //int
            this.mouse_y = 0; //int
            this.mouseXPercLocat = 0.0;
            this.mouseYPercLocat = 0.0;

            this.bt_screenHeight = screen_height;
            this.bt_screenWidth = screen_width;

            this.zoomPercentage = zoomPerc;
            this.original_distanceBetweenBoxs = dist_bet_box;
            this.original_distanceBetweenGens = dist_bet_gen;
            this.original_boxWidth = box_wid;
            this.original_boxHeight = box_hig;
            this.original_distancesbetfam = dist_bet_fam;
            this.original_lowerStalkHeight = low_stalk_hi;
            this.original_middleSpan = mid_span;
            this.original_topSpan = top_span;


            this.distanceBetweenBoxs = this.original_distanceBetweenBoxs;
            this.distanceBetweenGens = this.original_distanceBetweenGens;
            this.boxWidth = this.original_boxWidth;
            this.boxHeight = this.original_boxHeight;
            this.distancesbetfam = this.original_distancesbetfam;
            this.halfBox = this.boxWidth / 2;
            this.halfBoxHeight = this.boxHeight / 2;

            this.lowerSpan = this.original_lowerStalkHeight;

            this.middleSpan = this.original_middleSpan;

            this.topSpan = this.original_topSpan;




        },

        _GetTreePerson: function (graph, personId) {


            var _genidx = 0;
            var _personIdx = 0;

            while (_genidx < graph.length) {
                _personIdx = 0;

                while (_personIdx < graph[_genidx].length) {

                    if (graph[_genidx][_personIdx].PersonId == personId) {
                        return graph[_genidx][_personIdx];
                    }
                    _personIdx++;
                }
                _genidx++;
            }

            return null;
        },

        SetVisibility: function (parent, isDisplay) {

            var personStack = [];

            parent.Children.forEach((child)=>{
              personStack.push(child);
            });

            var currentTP = parent;
            while (personStack.length > 0) {
                currentTP = personStack.pop();
                currentTP.IsDisplayed = isDisplay;

                currentTP.Spouses.forEach((spouse)=>{
                  spouse.IsDisplayed = isDisplay;
                });

                currentTP.Children.forEach((child)=>{
                  personStack.push(child);
                });

              }

        },


        MoveTree: function (direction) {
            // console.log('move tree' + direction);

            if (direction == 'SOUTH') this.centreVerticalPoint -= 1;
            if (direction == 'NORTH') this.centreVerticalPoint += 1;
            if (direction == 'EAST') this.centrePoint += 1;
            if (direction == 'WEST') this.centrePoint -= 1;


            if (direction == 'UP' || direction == 'DOWN') {

                var x = this.bt_screenWidth / 2;
                var y = this.bt_screenHeight / 2;

                this.SetMouse(x, y);


                this.SetZoomStart();

                this.SetCentrePoint(1000000, 1000000);


                if (direction == 'UP') {
                    this.ZoomIn();
                }
                else {
                    this.ZoomOut();
                }


            }
            else {
                this.DrawTree();
            }

        },
        // SetZoom: function (percentage) {
        //
        //
        //     if (percentage !== 0.0) {
        //         var _workingtp = 0.0;
        //         var _percLocal_x = 0.0;
        //         var _percLocal_y = 0.0;
        //
        //         //zoom drawing components
        //         this.zoomPercentage += percentage;
        //         this.zoomLevel += percentage;
        //         _workingtp = this.original_distanceBetweenBoxs / 100;
        //         this.distanceBetweenBoxs = _workingtp * this.zoomPercentage;
        //         _workingtp = this.original_boxWidth / 100;
        //         this.boxWidth = _workingtp * this.zoomPercentage;
        //         this.halfBox = this.boxWidth / 2;
        //         _workingtp = this.original_distancesbetfam / 100;
        //         _workingtp = this.original_distanceBetweenGens / 100;
        //         this.distanceBetweenGens = _workingtp * this.zoomPercentage;
        //         _workingtp = this.original_boxHeight / 100;
        //         this.boxHeight = _workingtp * this.zoomPercentage;
        //
        //         this.halfBoxHeight = this.boxHeight / 2;
        //
        //         this.ComputeLocations();
        //
        //         this.GetPercDistances();
        //         _percLocal_x = this.percX1;
        //         _percLocal_y = this.percY1;
        //
        //
        //         this.centreVerticalPoint += (this.drawingHeight / 100) * (_percLocal_y - this.mouseYPercLocat);
        //
        //         this.centrePoint += (this.drawingWidth / 100) * (_percLocal_x - this.mouseXPercLocat);
        //
        //         this.ComputeLocations();
        //     } //end percentage ==0.0)
        //
        //
        //
        //     this.DrawTree();
        //
        // },
        SetZoomStart: function () {
            this.GetPercDistances();
            this.mouseXPercLocat = this.percX1;
            this.mouseYPercLocat = this.percY1;
        },
        GetPercDistances: function () {


            var _distanceFromX1 = 0.0;
            var _distanceFromY1 = 0.0;
            var _onePercentDistance = 0.0;

            this.percX1 = 0.0;
            this.percY1 = 0.0;


            this.drawingWidth = this.drawingX2 - this.drawingX1;
            this.drawingHeight = this.drawingY2 - this.drawingY1;

            if (this.drawingWidth !== 0 && this.drawingHeight !== 0) {
                if (this.drawingX1 > 0) {
                    _distanceFromX1 = this.mouse_x - this.drawingX1; //;
                }
                else {
                    _distanceFromX1 = Math.abs(this.drawingX1) + this.mouse_x;
                }

                _onePercentDistance = this.drawingWidth / 100;
                this.percX1 = _distanceFromX1 / _onePercentDistance;

                if (this.drawingY1 > 0) {
                    _distanceFromY1 = this.mouse_y - this.drawingY1; // ;
                }
                else {
                    _distanceFromY1 = Math.abs(this.drawingY1) + this.mouse_y;
                }

                _onePercentDistance = this.drawingHeight / 100;
                this.percY1 = _distanceFromY1 / _onePercentDistance;

            }

        },

        SetMouse: function (x, y, mousestate) {
        //    console.log('mouse set: ' + x + ' , ' + y);
            this.mouse_x = x;
            this.mouse_y = y;

            if (mousestate == undefined) mousestate = false;

            var mouseLink = this.LinkContainingPoint(this.bt_links,this.mouse_x, this.mouse_y);

            var buttonLink = this.LinkContainingPoint(this.bt_buttonLinks,this.mouse_x, this.mouse_y);

            if (mouseLink !== null || buttonLink !== null) {
                document.body.style.cursor = 'pointer';
             //   console.log(mouseLink.action);
            }
            else {
                if (mousestate == false)
                    document.body.style.cursor = 'default';
                else
                    document.body.style.cursor = 'move';
            }

        },
        GetChildDisplayStatus: function (person) {

            var isDisplayed = true;

            if (this.generations.length > person.GenerationIdx) {
                var _genidx = 0;
                while (_genidx < this.generations[person.GenerationIdx].length) {

                    if (this.generations[person.GenerationIdx][_genidx].PersonId == person.ChildLst[0]) {
                        var _person = this.generations[person.GenerationIdx][_genidx];
                        isDisplayed = _person.IsDisplayed;
                        break;
                    }

                    _genidx++;
                }
            }

            return isDisplayed;
        },

        // move this up to the derived classes

        PerformClick: function (x, y) {

            var mouseLink = this.LinkContainingPoint(this.bt_links,x, y);

            if (mouseLink !== null) {

                var selectedPerson = this._GetTreePerson(this.generations,mouseLink.action);

           //     var zoomReq = this.zoomPercentage; //-100
             //   var xpos = selectedPerson.X1;
             //   var ypos = selectedPerson.Y1;


                this.selectedPersonId = selectedPerson.PersonId;
                this.selectedPersonX = selectedPerson.X1;
                this.selectedPersonY = selectedPerson.Y1;

                //var queryStr = '?sid=' + '00000000-0000-0000-0000-000000000000' + '&id=' + selectedPerson.PersonId;
                //queryStr += '&xpos=' + xpos + '&ypos=' + ypos + '&zoom=' + zoomReq;
                //this._qryString = queryStr;
                this.bt_refreshData = true;
            }
            else {

                var buttonLink = this.LinkContainingPoint(this.bt_buttonLinks,x, y);

                if (buttonLink !== null) {

                    var parts = buttonLink.action.split(',');

                    var clickedPerson = this._GetTreePerson(this.generations, parts[0]);

                    var isVis = true;

                    if (parts[1] == 'false') {
                        isVis = true;
                    }
                    else {
                        isVis = false;
                    }

                    this.SetVisibility(clickedPerson, isVis);


                }

            }



        },

        SetCentrePoint: function (param_x, param_y) {

            if (param_x == 1000000 && param_y == 1000000) {
                this.centrePointXOffset = 0;
                this.centrePointYOffset = 0;
            }
            else {

                if (this.centrePointXOffset === 0) {

                    this.centrePointXOffset = this.centrePoint - param_x;
                }
                else {

                    this.centrePoint = param_x + this.centrePointXOffset;
                }


                if (this.centrePointYOffset === 0) {
                    this.centrePointYOffset = this.centreVerticalPoint - param_y;
                }
                else {

                    this.centreVerticalPoint = param_y + this.centrePointYOffset;
                }

            }

            // console.log('setcentrepoint: '+ this.centrePointXOffset + ' ' + this.centrePoint);
        }, //end set centre point
        ResetOffset: function () {

            this.centrePointXOffset = 0;
            this.centrePointYOffset = 0;
        },
        ZoomIn: function () {
            this.zoomAmount++;
            this.SetZoom(this.zoomAmount);
        },
        ZoomOut: function () {
            if (this.zoomAmount > 7)
                this.zoomAmount--;

            this.SetZoom(this.zoomAmount - (this.zoomAmount * 2));
            //  SetZoom(zoomAmount - (zoomAmount * 2));
        },
        CalcZoomLevel: function (zoomPercentage) {
            var _retVal = 0;

            if (zoomPercentage > 0 && zoomPercentage < 40) {
                _retVal = 1;
            }
            else if (zoomPercentage >= 40 && zoomPercentage < 60) {
                _retVal = 2;
            }
            else if (zoomPercentage >= 60 && zoomPercentage <= 150) {
                _retVal = 3;
            }
            else if (zoomPercentage > 150 && zoomPercentage <= 200) {
                _retVal = 4;
            }
            else if (zoomPercentage > 200 && zoomPercentage <= 250) {
                _retVal = 5;
            }
            else if (zoomPercentage > 250 && zoomPercentage <= 300) {
                _retVal = 6;
            }
            else if (zoomPercentage > 300) {
                _retVal = 7;
            }

            return _retVal;
        },
        CalcAreaLevel: function (area) {
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
        },
        CalcTPZoom: function (genidx, personIdx) {
            var _tp = this.generations[genidx][personIdx];

            var _boxarea = (_tp.X2 - _tp.X1) * (_tp.Y2 - _tp.Y1);

            _tp.zoom = this.CalcAreaLevel(_boxarea);
        },
        RelocateToSelectedPerson: function () {


            var personId = this.selectedPersonId;
            var _xpos = this.selectedPersonX;
            var _ypos = this.selectedPersonY;

            this.ComputeLocations();


            var distanceToMove = 0.0;
            var currentPersonLocation = 0;
            var _temp = this._GetTreePerson(this.generations, personId);

            var x = 0.0;
            var y = 0.0;

            if (_temp !== null) {
                if (_xpos === 0.0) {
                    currentPersonLocation = (this.generations[0][0].X1 + this.generations[0][0].X2) / 2;
                    var requiredLocation = this.bt_screenWidth / 2;
                    distanceToMove = requiredLocation - currentPersonLocation;

                    this.centrePoint += distanceToMove;
                }
                else {
                    currentPersonLocation = _temp.X1;

                    if (currentPersonLocation < 0.0) {
                        distanceToMove = _xpos - currentPersonLocation;
                    }

                    if (currentPersonLocation > this.bt_screenWidth) {
                        distanceToMove = 0.0 - ((this.bt_screenWidth - _xpos) + (_xpos - this.bt_screenWidth));
                    }

                    if (currentPersonLocation >= 0 && currentPersonLocation <= this.bt_screenWidth) {   //100 - 750
                        distanceToMove = _xpos - currentPersonLocation;
                        // 800 - 100
                    }

                    this.centrePoint += distanceToMove;
                }

                if (_ypos === 0.0) {
                    var _currentPersonLocation = (this.generations[0][0].Y1 + this.generations[0][0].Y2) / 2;
                    var _requiredLocation = this.boxHeight;
                    var _distanceToMove = _requiredLocation - _currentPersonLocation;
                    this.centreVerticalPoint -= _distanceToMove;
                }
                else {

                    if (_temp === null) {
                        currentPersonLocation = 0.0;
                    }
                    else {
                        currentPersonLocation = _temp.Y1;

                        if (currentPersonLocation > this.bt_screenHeight) {
                            distanceToMove = currentPersonLocation - _ypos;
                        }
                        if (currentPersonLocation >= 0 && currentPersonLocation <= this.bt_screenHeight) {
                            distanceToMove = currentPersonLocation - _ypos;
                        }
                        if (currentPersonLocation < 0) {
                            distanceToMove = _ypos - currentPersonLocation;
                        }
                    }

                    this.centreVerticalPoint -= distanceToMove;
                }

                this.ComputeLocations();

                if (_ypos === 0) {
                    y = 0 - this.bt_screenHeight / 2;
                }
                else {
                    y = (_temp.Y2 + _temp.Y1) / 2;
                }

                if (_xpos === 0) {
                    x = this.bt_screenWidth / 2;
                }
                else {
                    x = (_temp.X2 + _temp.X1) / 2;
                }

                this.SetMouse(x, y);
                this.SetZoomStart();
                this.SetCentrePoint(1000000, 1000000);


                this.DrawTree();
            }
        },
        Debug: function () {
            console.log('debugging');

            var idx = 0;

            while (this.generations.length > idx) {



                var cid = 0;
                var cife = 0;
                var cipl = 0;
                var cifs = 0;
                var cihl = 0;

                var personidx = 0;

                while (this.generations[idx].length > personidx) {

                    if (this.generations[idx][personidx].RecordLink.Name == "Jane Thackray") {
                        console.log("Jane Thackray X1 Y2");
                        console.log(this.generations[idx][personidx].X1);
                        console.log(this.generations[idx][personidx].Y1);

                    }

                    if (this.generations[idx][personidx].RecordLink.Name == "William Talbot") {
                        console.log("William Talbot X1 Y2");
                        console.log(this.generations[idx][personidx].X1);
                        console.log(this.generations[idx][personidx].Y1);
                    }

                    personidx++;
                }

                idx++;
            }

        }

};
