/*global requestAnimationFrame*/

import {TreeUI} from "./TreeUI.js";
import {PureFunctions,LayoutBoundaries} from "./StaticGraphLib.js";


export function DescTree() {

    console.log('tree created');

    this._qryString = '';
        this.ctx =null;
    this.colourScheme =null;
    this.generations = [];
    this.layoutDefaults=null;
    this.layoutVolatile =null;
    this.selectedPersonId = '';
    this.sourceId = null;


    this.bt_buttonLinks = [];
    this.bt_links = [];
    this.bt_refreshData =false;
    this.childlessMarriages = [];
    this.familySpanLines = [];
    this.treeUI;
      this.firstPX = 0.0;
    this.secondPX = 0.0;
        this.startx1 = 0.0;

    this.relativeCursorPosition = { x:0.0, y:0.0 };
    this.initialRelativeCursorPosition = { x:0.0, y:0.0 };
    //this.relativeCursorPosition.x = 0.0;
    //this.percY1 = 0.0;



    this.centrePoint = 750.0;
    this.centrePointXOffset = 0.0;
    this.centrePointYOffset = 0.0;
    this.centreVerticalPoint = 0.0;

    this.bounds = LayoutBoundaries;



    this.mouseXPercLocat = 0.0;
    this.mouseYPercLocat = 0.0;

    this.mouse_x = 0; //int
    this.mouse_y = 0; //int

    this.zoomAmount = 8; //int

}


DescTree.prototype = {



    SetZoom: function (p_percentage) {


        var workingtp = this.layoutDefaults.lowerSpan / 100;

        this.layoutVolatile.lowerSpan = workingtp * this.layoutVolatile.zoomPercentage; // (int)layoutDefaults.lowerSpan;

        workingtp = this.layoutDefaults.middleSpan / 100;

        this.layoutVolatile.middleSpan = workingtp * this.layoutVolatile.zoomPercentage; //(int)layoutDefaults.middleSpan;

        workingtp = this.layoutDefaults.topSpan / 100;

        this.layoutVolatile.topSpan = workingtp * this.layoutVolatile.zoomPercentage; //(int)layoutDefaults.topSpan;


        let percentage =Number(p_percentage);

        if (percentage !== 0.0) {
            var _workingtp = 0.0;

            //zoom drawing components
            this.layoutVolatile.zoomPercentage += percentage;
            //this.zoomLevel += percentage;
            _workingtp = this.layoutDefaults.distanceBetweenBoxs / 100;
            this.layoutVolatile.distanceBetweenBoxs = _workingtp * this.layoutVolatile.zoomPercentage;
            _workingtp = this.layoutDefaults.boxWidth / 100;
            this.layoutVolatile.boxWidth = _workingtp * this.layoutVolatile.zoomPercentage;
            this.layoutVolatile.halfBoxWidth = this.layoutVolatile.boxWidth / 2;
            _workingtp = this.layoutDefaults.distancesbetfam / 100;
            _workingtp = this.layoutDefaults.distanceBetweenGens / 100;
            this.layoutVolatile.distanceBetweenGens = _workingtp * this.layoutVolatile.zoomPercentage;
            _workingtp = this.layoutDefaults.boxHeight / 100;
            this.layoutVolatile.boxHeight = _workingtp * this.layoutVolatile.zoomPercentage;

            this.layoutVolatile.halfBoxHeight = this.layoutVolatile.boxHeight / 2;

            this.ComputeLocations();

            this.relativeCursorPosition =  PureFunctions.GetPercDistances(this.bounds, this.mouse_x, this.mouse_y);

            this.centreVerticalPoint += (this.bounds.drawingHeight / 100) * (this.relativeCursorPosition.y - this.initialRelativeCursorPosition.y);

            this.centrePoint += (this.bounds.drawingWidth / 100) * (this.relativeCursorPosition.x - this.initialRelativeCursorPosition.x);

            this.ComputeLocations();
        }



        this.DrawTree();
    },

    DrawTree: function () {

        this.ComputeLocations();

        this.treeUI.ClearContext(this.ctx);

        var _genidx = 0;
        var _personIdx = 0;

        this.bt_links = [];
        this.bt_buttonLinks = [];


        while (_genidx < this.generations.length) {
                _personIdx = 0;

                while (_personIdx < this.generations[_genidx].length) {

                    var _person = this.generations[_genidx][_personIdx];

                    var personLink = this.treeUI.DrawPerson(this.ctx,this.colourScheme,_person, this.sourceId, this.layoutVolatile.zoomPercentage);

                    if (personLink !== null)
                        this.bt_links.push(personLink);

                    if (_person.GenerationIdx != 0) {
                        var buttonLink = this.treeUI.DrawButton(this.ctx,this.colourScheme,_person, this.GetChildDisplayStatus(_person));

                        if (buttonLink !== null)
                            this.bt_buttonLinks.push(buttonLink);
                    }

                    _personIdx++;
                }
                _genidx++;
            }

        var _fslOuter = 0;
        var _fslInner = 0;



        try {
            while (_fslOuter < this.familySpanLines.length) {
                _fslInner = 0;
                while (_fslInner < this.familySpanLines[_fslOuter].length) {

                    //if (_fslOuter == 7 && _fslInner == 15) {
                    this.treeUI.DrawLine(this.ctx,this.colourScheme, this.familySpanLines[_fslOuter][_fslInner]);
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

                this.treeUI.DrawLine(this.ctx,this.colourScheme,this.childlessMarriages[_fslOuter]);

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

      //  this.bounds.drawingX2 = 0.0;


        this.familySpanLines = [];

        _genIdx = 0;

        var lastPersonY2 = 0.0;

        while (_genIdx < this.generations.length) {
            this.familySpanLines.push([]);

            if (this.generations[_genIdx].GenerationVisible) {
                _displayGenCount++;

                this.startx1 = this.SetScheduleVars(_genIdx, this.startx1);

                this.fillGenXs(_genIdx);



                var _current_gen_upper_y = (_genIdx * this.layoutVolatile.boxHeight) + (_genIdx * this.layoutVolatile.distanceBetweenGens) + this.centreVerticalPoint;



                var _increment_temp = 0.0;

                var _famIdx = 0;

                var familydirectionCounts = this.createFamilyCountArray(_genIdx);

                var _familyIdx = -1;
                var _personIdx = 0;

                while (_personIdx < this.generations[_genIdx].length) {

                    var genPerson = this.generations[_genIdx][_personIdx];



                    if (genPerson.IsDisplayed) {
                        //  console.log('displaying: ' + genPerson.Name);

                        genPerson.X2 = genPerson.X1 + this.layoutVolatile.boxWidth;

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

                                    var myArray = new Array((genPerson.X1 + this.layoutVolatile.halfBoxWidth), (_current_gen_upper_y + this.layoutVolatile.boxHeight));
                                    marriagePoints.push(myArray);
                                    myArray = new Array((genPerson.X1 + this.layoutVolatile.halfBoxWidth), (_current_gen_upper_y + this.layoutVolatile.boxHeight + this.layoutVolatile.topSpan));
                                    marriagePoints.push(myArray);
                                    myArray = new Array((tp + this.layoutVolatile.halfBoxWidth), (_current_gen_upper_y + this.layoutVolatile.boxHeight + this.layoutVolatile.topSpan));
                                    marriagePoints.push(myArray);
                                    myArray = new Array((tp + this.layoutVolatile.halfBoxWidth), (_current_gen_upper_y + this.layoutVolatile.boxHeight));
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
                        var _firstRow = _current_gen_upper_y - this.layoutVolatile.lowerSpan;
                        var _secondRow = _parent_gen_lower_y + this.layoutVolatile.middleSpan; // changed with increment later on - need to calculate the maximum and minimum this increment will be
                        var _thirdRow = _parent_gen_lower_y + this.layoutVolatile.middleSpan;
                        var _fourthRow = _parent_gen_lower_y + this.layoutVolatile.topSpan;

                        if ((!(genPerson.IsFamilyEnd && _isSpouse)) && _genIdx > 0) {
                            if (!_isDoubleSpouseEnd) {
                                var _family = this.familySpanLines[_genIdx][_familyIdx];

                                //  console.log(genPerson.Name);

                                _family.push(new Array((genPerson.X1 + this.layoutVolatile.halfBoxWidth), _firstRow));

                                if (!_isSpouse)
                                    _family.push(new Array((genPerson.X1 + this.layoutVolatile.halfBoxWidth), _current_gen_upper_y));

                                _family.push(new Array((genPerson.X1 + this.layoutVolatile.halfBoxWidth), _firstRow));
                            }
                        }



                        if (genPerson.IsParentalLink && _genIdx > 0) {



                            _middleParents = this.MiddleParents(_genIdx, genPerson.FatherIdx, genPerson.MotherIdx);

                            var _nextParentLink = this.GetFirst(_genIdx, genPerson.FatherIdx, genPerson.MotherIdx);
                            var _prevParentLink = this.GetPrev(_genIdx, genPerson.FatherIdx, genPerson.MotherIdx);

                            this.GetParentXs(_genIdx, genPerson.FatherIdx, genPerson.MotherIdx);

                            var incSize = 0;

                            incSize = this.layoutVolatile.distanceBetweenGens - this.layoutVolatile.middleSpan - this.layoutVolatile.lowerSpan;
                            incSize = incSize / familydirectionCounts[_famIdx];


                            if (_famIdx === 0) {
                                if (genPerson.X1 > _middleParents)
                                    _increment_temp = this.layoutVolatile.distanceBetweenGens - this.layoutVolatile.middleSpan - this.layoutVolatile.lowerSpan;
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

                                    var _sizeToAdd = this.layoutVolatile.halfBoxWidth;

                                    if (!genPerson.IsFamilyEnd) {
                                        _sizeToAdd = this.layoutVolatile.boxWidth;
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
                        genPerson.Y2 = _current_gen_upper_y + this.layoutVolatile.boxHeight;

                        lastPersonY2 = genPerson.Y2;

                        this.CalcTPZoom(_genIdx, _personIdx);







                    } // end (genPerson.IsDisplayed)


                    _personIdx++;
                } //end while

            }

            _genIdx++;
        }

        this.bounds = PureFunctions.GetBounds(this.generations);
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
            //    this.bounds.drawingX1 = currentRowX1;
                currentRowX1 = this.centrePoint - (((this.generations[genidx].length * this.layoutVolatile.boxWidth) + ((this.generations[genidx].length - 1) * this.layoutVolatile.distanceBetweenBoxs)) / 2);
            }
            else {
                prevGenX1 = this.generations[genidx - 1][this.generations[genidx - 1].FirstFamilyIdx].X1;
                prevGenX2 = this.generations[genidx - 1][this.generations[genidx - 1].LastFamilyIdx].X1 + this.layoutVolatile.boxWidth;

                currentRowX1 = prevGenX1 + (this.layoutVolatile.boxWidth / 2);
                var endx2 = prevGenX2 - (this.layoutVolatile.boxWidth / 2);

                var _prevGenLen = endx2 - currentRowX1;

                var _curGenLen = (this.generations[genidx].VisiblePersonCount * (this.layoutVolatile.boxWidth + this.layoutVolatile.distanceBetweenBoxs)) - (this.layoutVolatile.distanceBetweenBoxs * this.generations[genidx].VisibleFamilyCount);
                if (_prevGenLen > _curGenLen) {
                    this.layoutVolatile.distancesbetfam = (_prevGenLen - _curGenLen) / this.generations[genidx].VisibleFamilyCount;
                }
                else {
                    this.layoutVolatile.distancesbetfam = (this.layoutDefaults.distancesbetfam / 100) * this.layoutVolatile.zoomPercentage;
                }
                //add in the distances between the families
                _curGenLen = _curGenLen + (this.layoutVolatile.distancesbetfam * (this.generations[genidx].VisibleFamilyCount - 1));
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
                    this.generations[genidx][idx].X2 = this.startx1 + this.layoutVolatile.boxWidth;
                }
                else {
                    if (this.generations[genidx][idx].IsFamilyStart) {
                        _currentDistanceBetweenBoxes = this.layoutVolatile.distancesbetfam;
                    }
                    else {
                        _currentDistanceBetweenBoxes = this.layoutVolatile.distanceBetweenBoxs;
                    }

                    this.generations[genidx][idx].X1 = prevPerson.X1 + this.layoutVolatile.boxWidth + _currentDistanceBetweenBoxes;
                    this.generations[genidx][idx].X2 = this.generations[genidx][idx].X1 + this.layoutVolatile.boxWidth;
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
                this.secondPX = this.generations[genidx - 1][fatIdx].X1 + this.layoutVolatile.halfBoxWidth;
                this.firstPX = this.generations[genidx - 1][motIdx].X1 + this.layoutVolatile.c;

            }
            else {
                this.secondPX = this.generations[genidx - 1][motIdx].X1 + this.layoutVolatile.halfBoxWidth;
                this.firstPX = this.generations[genidx - 1][fatIdx].X1 + this.layoutVolatile.halfBoxWidth;
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

    SetInitialValues: function (generations, selectedId,  ctx,  staticSettings , callback) {

        this.treeUI = new TreeUI();
        this.layoutDefaults=staticSettings.layoutDefaults;
        this.layoutVolatile ={...staticSettings.layoutDefaults};
        this.colourScheme = staticSettings.colourScheme.ancestor;

        this.ctx = ctx;

        this.centrePoint = 750.0;
        this.centreVerticalPoint = 0.0;
        this.centrePointXOffset = 0.0;
        this.centrePointYOffset = 0.0;
        this.mouse_x = 0; //int
        this.mouse_y = 0; //int
     this.initialRelativeCursorPosition = { x:0.0, y:0.0 };

         this.selectedPersonId = selectedId;
         this.generations = generations;


         this.treeUI.Init(1,ctx, (instance)=>{
           this.UpdateGenerationState();
           this.RelocateToSelectedPerson(0,0);
           this.bt_refreshData = false;
           callback();
         });

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

                var x = this.ctx.canvas.width / 2;
                var y = this.ctx.canvas.height / 2;

                this.SetMouse(x, y);


                this.SetZoomStart();

                this.SetCentrePoint();


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

        SetZoomStart: function () {
            this.relativeCursorPosition = PureFunctions.GetPercDistances(this.bounds, this.mouse_x, this.mouse_y);
            this.initialRelativeCursorPosition = {...this.relativeCursorPosition};
        },




        SetMouse: function (x, y, mousestate) {
        //    console.log('mouse set: ' + x + ' , ' + y);
            this.mouse_x = x;
            this.mouse_y = y;

            if (mousestate == undefined) mousestate = false;

            var mouseLink = PureFunctions.LinkContainingPoint(this.bt_links,this.mouse_x, this.mouse_y);

            var buttonLink = PureFunctions.LinkContainingPoint(this.bt_buttonLinks,this.mouse_x, this.mouse_y);

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

            var mouseLink = PureFunctions.LinkContainingPoint(this.bt_links,x, y);

            if (mouseLink !== null) {

                var selectedPerson = this._GetTreePerson(this.generations,mouseLink.action);

                this.selectedPersonId = selectedPerson.PersonId;
                this.selectedPersonX = selectedPerson.X1;
                this.selectedPersonY = selectedPerson.Y1;
                this.bt_refreshData = true;
            }
            else {

                var buttonLink = PureFunctions.LinkContainingPoint(this.bt_buttonLinks,x, y);

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

            if (param_x == undefined && param_y == undefined) {
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

        CalcTPZoom: function (genidx, personIdx) {
            var _tp = this.generations[genidx][personIdx];

            var _boxarea = (_tp.X2 - _tp.X1) * (_tp.Y2 - _tp.Y1);

            _tp.zoom = PureFunctions.CalcAreaLevel(_boxarea);
        },
        RelocateToSelectedPerson: function (locx,locy) {


            var personId = this.selectedPersonId;

            var _xpos = locx;
            var _ypos = locy;
            let loc_ctx = this.ctx;


            this.ComputeLocations();


            var distanceToMove = 0.0;
            var currentPersonLocation = 0;
            var _temp = this._GetTreePerson(this.generations, personId);

            var x = 0.0;
            var y = 0.0;

            if (_temp !== null) {
                if (_xpos === 0.0) {
                    currentPersonLocation = (this.generations[0][0].X1 + this.generations[0][0].X2) / 2;
                    var requiredLocation = loc_ctx.canvas.width / 2;
                    distanceToMove = requiredLocation - currentPersonLocation;

                    this.centrePoint += distanceToMove;
                }
                else {
                    currentPersonLocation = _temp.X1;

                    if (currentPersonLocation < 0.0) {
                        distanceToMove = _xpos - currentPersonLocation;
                    }

                    if (currentPersonLocation > loc_ctx.canvas.width) {
                        distanceToMove = 0.0 - ((loc_ctx.canvas.width- _xpos) + (_xpos -loc_ctx.canvas.width));
                    }

                    if (currentPersonLocation >= 0 && currentPersonLocation <= loc_ctx.canvas.width) {   //100 - 750
                        distanceToMove = _xpos - currentPersonLocation;
                        // 800 - 100
                    }

                    this.centrePoint += distanceToMove;
                }

                if (_ypos === 0.0) {
                    var _currentPersonLocation = (this.generations[0][0].Y1 + this.generations[0][0].Y2) / 2;
                    var _requiredLocation = this.layoutVolatile.boxHeight;
                    var _distanceToMove = _requiredLocation - _currentPersonLocation;
                    this.centreVerticalPoint -= _distanceToMove;
                }
                else {

                    if (_temp === null) {
                        currentPersonLocation = 0.0;
                    }
                    else {
                        currentPersonLocation = _temp.Y1;

                        if (currentPersonLocation > loc_ctx.canvas.height) {
                            distanceToMove = currentPersonLocation - _ypos;
                        }
                        if (currentPersonLocation >= 0 && currentPersonLocation <= loc_ctx.canvas.height) {
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
                    y = 0 - loc_ctx.canvas.height / 2;
                }
                else {
                    y = (_temp.Y2 + _temp.Y1) / 2;
                }

                if (_xpos === 0) {
                    x = loc_ctx.canvas.width / 2;
                }
                else {
                    x = (_temp.X2 + _temp.X1) / 2;
                }

                this.SetMouse(x, y);
                this.SetZoomStart();
                this.SetCentrePoint();


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
