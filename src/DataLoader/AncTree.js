
import {TreeUI} from "./TreeUI.js";
import {PureFunctions,LayoutBoundaries} from "./StaticGraphLib.js";

export function AncTree() {

  this.treeUI;

  this._qryString = '';

  this.adjustedBoxHeights = [];
  this.adjustedBoxWidths = [];
  this.adjustedDistances = [];

  this.bt_buttonLinks = [];
  this.bt_links = [];
  this.bt_refreshData =false;
  this.childlessMarriages = [];
  this.colourScheme =null;
  this.familySpanLines = [];
  this.generations = [];
  this.layoutDefaults=null;
  this.layoutVolatile =null;
  this.selectedPersonId = '';
  this.sourceId = null;
  this.ctx =null;
  this.moveList =  [];
  this.newX1 =0.0;
  this.newX2 =0.0;
  this.workingX1 =0.0;
  this.workingX2 =0.0;



  this.centrePoint = 750.0;
  this.centrePointXOffset = 0.0;
  this.centrePointYOffset = 0.0;
  this.centreVerticalPoint = 0.0;


  this.bounds = LayoutBoundaries;


  this.relativeCursorPosition = { x:0.0, y:0.0 };
  this.initialRelativeCursorPosition = { x:0.0, y:0.0 };

  this.mouse_x = 0; //int
  this.mouse_y = 0; //int

  this.zoomAmount = 8; //int
  this.zoomLevel = 0.0;




}




AncTree.prototype = {





   ContainsPerson : function (value) {
        for (var i = 0; i < this.length; i++) {

            if (this[i].PersonId == value.PersonId) {
                return true;
            }
        }
        return false;
    },



   DrawTree :function () {

        try
        {
            this.ComputeLocations();
        }
        catch(err)
        {
            console.log('error computing locations');
            console.log(err);
        }


         var _genidx = 0;
         var _personIdx = 0;

         this.treeUI.ClearContext(this.ctx);

            try
            {


               this.bt_links = [];

               while (_genidx < this.generations.length) {
                   _personIdx = 0;

                   while (_personIdx < this.generations[_genidx].length) {

                       var _person = this.generations[_genidx][_personIdx];

                       var personLink = this.treeUI.DrawPerson(this.ctx,this.colourScheme,_person, this.sourceId, this.layoutVolatile.zoomPercentage);

                       if(personLink !== null)
                        this.bt_links.push(personLink);

                       _personIdx++;
                   }
                   _genidx++;
               }

            }
            catch (err) {
                console.log('Error Drawing Persons');
                console.log(err);
            }

            try
            {
               var _fslOuter = 0;
               var _fslInner = 0;
               //   var _pointIdx = 0;


               while (_fslOuter < this.familySpanLines.length) {
                   _fslInner = 0;
                   while (_fslInner < this.familySpanLines[_fslOuter].length) {
                       this.treeUI.DrawLine(this.ctx,this.colourScheme,this.familySpanLines[_fslOuter][_fslInner]);
                       _fslInner++;
                   } // end familySpanLines[_fslOuter].length

                   _fslOuter++;
               } // end this.familySpanLines.length

            }
            catch (err) {
                console.log('Error Drawing Lines');
                console.log(err);
            }

       },

    ComputeLocations :function () {
        var genidx = 0;
        this.bounds.drawingX2 = 0.0;
        this.bounds.drawingX1 = 0.0;
        var _y = this.centreVerticalPoint;
        var percentageLess = 0.0;

        this.adjustedDistances = [];
        this.adjustedBoxWidths = [];
        this.adjustedBoxHeights = [];


        this.generations[0][0].X1 = this.centrePoint;
        this.generations[0][0].X2 = this.centrePoint + this.layoutVolatile.boxWidth;
        this.generations[0][0].Y1 = _y;
        this.generations[0][0].Y2 = _y + this.layoutVolatile.boxHeight;


        var idx = 0;
        var pidx = 0;

        this.familySpanLines = [];

        while (idx < this.generations.length) {
            this.familySpanLines.push([]);
            pidx = 0;
            while (pidx < this.generations[idx].length) {
                this.familySpanLines[idx].push([]);

                pidx++;
            }

            idx++;
        }

        let SortByGenIdx = (paramList)=>
        {

          for(var i=0;i<paramList.length;i++)
        	{
        		for(var j=i+1;j<paramList.length;j++)
        		{
        			if(Number(paramList[i].GenerationIdx) < Number(paramList[j].GenerationIdx))
        			{
        				var tempValue = paramList[j];
        				paramList[j] = paramList[i];
        				paramList[i] = tempValue;
        			}
        		}
        	}


        };





        genidx = 0;
        while (genidx < this.generations.length) {


            var personIdx = 0;

            percentageLess += 2;

           // console.log('GENERATION: ' + genidx);

            while (personIdx < this.generations[genidx].length) {

                this.GetNewX(genidx,
                        percentageLess,
                        personIdx); // fills newxs

                var overlap = 0.0;
                var requiredSpace = 0.0;
                if (personIdx > 0) {

                    if (this.generations[genidx][personIdx - 1].X2 > this.newX1) {
                        overlap = this.generations[genidx][personIdx - 1].X2 - this.newX1;
                        overlap += this.adjustedDistances[genidx];
                    }

                    var newChildidx = this.generations[genidx][personIdx].ChildIdx;
                    var oldChildidx = this.generations[genidx][personIdx - 1].ChildIdx;
                    var countPersonSpaces = newChildidx - oldChildidx;

                    if (countPersonSpaces > 1) {

                        countPersonSpaces--;
                        //needed space
                        requiredSpace = (countPersonSpaces * this.adjustedBoxWidths[genidx - 1]) + ((countPersonSpaces + 1) * (this.adjustedDistances[genidx - 1] + 5));

                        var spaceSoFarCreated = (this.generations[genidx - 1][newChildidx].X1 - this.generations[genidx - 1][oldChildidx].X2) + overlap;

                        // we dont have enough space!
                        if (requiredSpace > spaceSoFarCreated) {
                            // increase the overlap so enough space if provided
                            overlap += (requiredSpace - spaceSoFarCreated);
                        }
                        else if (overlap === 0) {
                            overlap = (requiredSpace - spaceSoFarCreated);
                        }

                    }

                }




                if (overlap > 0) {

                   // console.log('overlaped: ' + personIdx);

                    this.getMoveList(personIdx - 1, genidx);

                    SortByGenIdx(this.moveList);

                  //  this.moveList.SortByGenIdx();

                    //var sorted = moveList.OrderByDescending(o => o.GenerationIdx);

                    var listIdx = 0;
                    // }

                    //                    $.each(this.moveList, function (index, _treePerson) {


                    while (listIdx < this.moveList.length) {
                        var _treePerson = this.moveList[listIdx];
                        var tpPersonIdx = _treePerson.Index;

                        while (tpPersonIdx >= 0) {

                            //      Debug.WriteLine("moving: " + this.generations[_treePerson.generation][tpPersonIdx].name);
                            //console.log("moving: " + _treePerson.Name + " " + _treePerson.X1 + " " + _treePerson.X2);

                            var _movePerson = this.generations[_treePerson.GenerationIdx][tpPersonIdx];

                            var _prevPerson = null;
                            var _nextPerson = null;


                            if (tpPersonIdx > 0)
                                _prevPerson = this.generations[_treePerson.GenerationIdx][tpPersonIdx - 1];

                            if ((tpPersonIdx + 1) < this.generations[_treePerson.GenerationIdx].length)
                                _nextPerson = this.generations[_treePerson.GenerationIdx][tpPersonIdx + 1];

                            this.workingX1 = 0.0;
                            this.workingX2 = 0.0;

                            if ((_movePerson.FatherIdx == -1 && _movePerson.MotherIdx == -1) || (_movePerson.GenerationIdx == genidx)) {
                                if (_movePerson.GenerationIdx == genidx) {
                                    this.workingX1 = _movePerson.X1 - overlap;
                                    this.workingX2 = _movePerson.X2 - overlap;
                                }
                                else {

                                    var parentlessPersonStartX = _movePerson.X1 - overlap; // GetX1ForParentlessPerson(_movePerson.generation, _movePerson.index);

                                    if (parentlessPersonStartX === 0.0) {
                                        parentlessPersonStartX = 15;
                                        this.workingX2 = _nextPerson.X1 - parentlessPersonStartX;
                                        this.workingX1 = this.workingX2 - this.adjustedBoxWidths[_nextPerson.GenerationIdx];
                                    }
                                    else {
                                        this.workingX1 = parentlessPersonStartX;
                                        this.workingX2 = this.workingX1 + this.adjustedBoxWidths[_nextPerson.GenerationIdx];
                                    }
                                }

                            }
                            else {
                                this.CreateChildPositionFromParent(_movePerson); //sets workingXs
                            }

                         //   if (this.workingX1 == -3830.17696197631 && this.workingX2 == -3773.62983468031 && _treePerson.Name == 'James Reeves') {
                          //      console.log('hello');
                          //  }

                           // console.log('working 1 and 2: ' + this.workingX1 + ' - ' + this.workingX2);

                            _movePerson.X1 = this.workingX1; // -adjustedDistanceApart;
                            _movePerson.X2 = this.workingX2; // -adjustedDistanceApart;

                            tpPersonIdx--;
                        } //end while (tpPersonIdx >= 0)

                        listIdx++;
                    } // end listIdx < this.moveList.length




                }

                this.generations[genidx][personIdx].X1 = this.newX1; // _x - adjustedBoxWidth;
                this.generations[genidx][personIdx].X2 = this.newX2; // _x + adjustedBoxWidth;

                this.generations[genidx][personIdx].Y1 = _y;
                this.generations[genidx][personIdx].Y2 = _y + this.adjustedBoxHeights[genidx];


                this.CalcTPZoom(genidx, personIdx);

                personIdx++;
            }

            _y -= this.layoutVolatile.distanceBetweenGens;

            genidx++;

        }



        //, ref newX1, ref newX2
        this.CreateChildPositionFromParent(this.generations[0][0]); //sets workingXs

        this.generations[0][0].X1 = this.workingX1;
        this.generations[0][0].X2 = this.workingX2;

        this.generations[0][0].IsDisplayed =true;

        genidx = 0;

        this.bounds = PureFunctions.GetBounds(this.generations);

        // this.bounds.drawingX1 = this.generations[0][0].X1;
        // this.bounds.drawingX2 = this.generations[0][0].X2;
        //
        // while (genidx < this.generations.length) {
        //     if (this.bounds.drawingX1 > this.generations[genidx][0].X1)
        //         this.bounds.drawingX1 = this.generations[genidx][0].X1;
        //
        //     if (this.bounds.drawingX2 < this.generations[genidx][this.generations[genidx].length - 1].X2)
        //         this.bounds.drawingX2 = this.generations[genidx][this.generations[genidx].length - 1].X2;
        //
        //     genidx++;
        // }
        //
        // // top of the screen
        // this.bounds.drawingY1 = this.generations[this.generations.length - 1][0].Y2;
        //
        // //bottom of the screen
        // this.bounds.drawingY2 = this.generations[0][0].Y1;
        //
        // this.bounds.drawingHeight = this.generations[0][0].Y1 - this.generations[this.generations.length - 1][0].Y2;
        //
        // this.bounds.drawingCentre = (this.bounds.drawingX2 - this.bounds.drawingX1) / 2;
        // this.bounds.drawingWidth = this.bounds.drawingX2 - this.bounds.drawingX1;




        this.CreateConnectionLines();


    },       //end compute locations

    //run when generation is loaded
    //run when visibility changed
    UpdateGenerationState: function () {


    },

    CreateConnectionLines : function () {

        // this.FamilySpanLines = new List<List<List<TreePoint>>>();

        var middleGeneration = 0.0;
        var middleXChild = 0.0;
        var middleParent = 0.0;
        var middleTopChild = 0.0;
        var bottomParent = 0.0;

        var parentHeight = 0.0;
        var distanceBetweenGens = 0.0;


        var genidx = 0;
        while (genidx < this.generations.length) {

            var personIdx = 0;

            if (genidx + 1 >= this.familySpanLines.length) {
                genidx++;
                continue;
            }


            while (personIdx < this.generations[genidx].length) {
                var _family0 = this.familySpanLines[genidx][personIdx];

                //_family0[_family0.length] = new Array(_secondStorkX, _firstRow);

                _family0 = [];
                //familySpanLines[genidx][personIdx].Clear();

                middleTopChild = this.generations[genidx][personIdx].Y1;// + 10
                if (this.generations.length > (genidx + 1)) {
                    parentHeight = (this.generations[genidx + 1][0].Y2 - this.generations[genidx + 1][0].Y1);
                    bottomParent = this.generations[genidx + 1][0].Y1 + parentHeight;// + 10
                    distanceBetweenGens = (this.generations[genidx][personIdx].Y1 - this.generations[genidx + 1][0].Y2);

                    if (this.generations[genidx][personIdx].FatherIdx >-1 || this.generations[genidx][personIdx].MotherIdx > -1) {
                        // top middle of child
                        middleXChild = (this.generations[genidx][personIdx].X1 + this.generations[genidx][personIdx].X2) / 2;
                        middleGeneration = this.generations[genidx][personIdx].Y1 - (distanceBetweenGens / 2) + 10;
                        // move to top and middle of child
                        // familySpanLines[genidx][personIdx].Add(new TreePoint(middleXChild, middleTopChild));
                        _family0[_family0.length] = new Array(middleXChild, middleTopChild);

                        // move to middle of generations about child
                        // familySpanLines[genidx][personIdx].Add(new TreePoint(middleXChild, middleGeneration));
                        _family0[_family0.length] = new Array(middleXChild, middleGeneration);

                        var patIdx = this.generations[genidx][personIdx].FatherIdx;
                        if (patIdx != -1) {
                            // move to middle generation under parent
                            middleParent = (this.generations[genidx + 1][patIdx].X1 + this.generations[genidx + 1][patIdx].X2) / 2;


                            //familySpanLines[genidx][personIdx].Add(new TreePoint(middleParent, middleGeneration));
                            _family0[_family0.length] = new Array(middleParent, middleGeneration);

                            if (this.bounds.drawingHeight > 200) {
                                // move to bottom of parent
                                //familySpanLines[genidx][personIdx].Add(new TreePoint(middleParent, bottomParent));
                                _family0[_family0.length] = new Array(middleParent, bottomParent);
                            }
                            else {
                                //familySpanLines[genidx][personIdx].Add(new TreePoint(middleParent, middleGeneration - 4));
                                _family0[_family0.length] = new Array(middleParent, middleGeneration - 4);
                            }
                            // move to middle generation under parent
                            //familySpanLines[genidx][personIdx].Add(new TreePoint(middleParent, middleGeneration));
                            _family0[_family0.length] = new Array(middleParent, middleGeneration);
                            // move to middle of child
                            // familySpanLines[genidx][personIdx].Add(new TreePoint(middleXChild, middleGeneration));
                            _family0[_family0.length] = new Array(middleXChild, middleGeneration);
                            // move to top and middle of child
                            // familySpanLines[genidx][personIdx].Add(new TreePoint(middleXChild, middleTopChild));
                            _family0[_family0.length] = new Array(middleXChild, middleTopChild);
                        }
                        patIdx = this.generations[genidx][personIdx].MotherIdx;
                        if (patIdx != -1) {
                            middleParent = (this.generations[genidx + 1][patIdx].X1 + this.generations[genidx + 1][patIdx].X2) / 2;
                            // move to middle of generations about child
                            // familySpanLines[genidx][personIdx].Add(new TreePoint(middleXChild, middleGeneration));
                            _family0[_family0.length] = new Array(middleXChild, middleGeneration);

                            //familySpanLines[genidx][personIdx].Add(new TreePoint(middleParent, middleGeneration));
                            _family0[_family0.length] = new Array(middleParent, middleGeneration);

                            if (this.bounds.drawingHeight > 200) {
                                // move to bottom of parent
                                //familySpanLines[genidx][personIdx].Add(new TreePoint(middleParent, bottomParent));
                                _family0[_family0.length] = new Array(middleParent, bottomParent);
                            }
                            else {
                                //familySpanLines[genidx][personIdx].Add(new TreePoint(middleParent, middleGeneration - 4));
                                _family0[_family0.length] = new Array(middleParent, middleGeneration - 4);
                            }
                            // move to middle generation under parent
                            // familySpanLines[genidx][personIdx].Add(new TreePoint(middleParent, middleGeneration));
                            _family0[_family0.length] = new Array(middleParent, middleGeneration);
                            // move to middle of child
                            // familySpanLines[genidx][personIdx].Add(new TreePoint(middleXChild, middleGeneration));
                            _family0[_family0.length] = new Array(middleXChild, middleGeneration);
                            // move to top and middle of child

                            //familySpanLines[genidx][personIdx].Add(new TreePoint(middleXChild, middleTopChild));
                            _family0[_family0.length] = new Array(middleXChild, middleTopChild);
                        } //end (patIdx != -1)
                    } //end  if (this.generations[genidx][personIdx].FatherIdx > 0 || this.generations[genidx][personIdx].MotherIdx > 0)
                } //if (this.generations.length > (genidx + 1))


                this.familySpanLines[genidx][personIdx] = _family0;

                personIdx++;
            }

            genidx++;
        }



    }, //this.CreateConnectionLines

    CreateChildPositionFromParent :function (movePerson) {

            this.workingX1 = 0.0;
            this.workingX2 = 0.0;


            if (this.adjustedBoxWidths.length > movePerson.GenerationIdx)
            {
                this.layoutVolatile.boxWidth = this.adjustedBoxWidths[movePerson.GenerationIdx];
                }
            else
            {
                this.layoutVolatile.boxWidth = this.layoutVolatile.boxWidth;
                }

            if (movePerson.FatherIdx == -1)
            {
                this.workingX1 = ((this.generations[movePerson.GenerationIdx + 1][movePerson.MotherIdx].X1 + this.generations[movePerson.GenerationIdx + 1][movePerson.MotherIdx].X2) / 2) - (this.layoutVolatile.boxWidth / 2);
                this.workingX2 = this.workingX1 + this.layoutVolatile.boxWidth;
            }

            if (movePerson.MotherIdx == -1)
            {
                this.workingX1 = ((this.generations[movePerson.GenerationIdx + 1][movePerson.FatherIdx].X1 + this.generations[movePerson.GenerationIdx + 1][movePerson.FatherIdx].X2) / 2) - (this.layoutVolatile.boxWidth / 2);
                this.workingX2 = this.workingX1 + this.layoutVolatile.boxWidth;
            }

            var parentX1 = 0.0;
            var parentX2 = 0.0;

            if (movePerson.FatherIdx != -1 && movePerson.MotherIdx != -1)
            {
                parentX2 = this.generations[movePerson.GenerationIdx + 1][movePerson.MotherIdx].X2;
                parentX1 = this.generations[movePerson.GenerationIdx + 1][movePerson.FatherIdx].X1;

                if (movePerson.FatherIdx > movePerson.MotherIdx)
                {
                    parentX2 = this.generations[movePerson.GenerationIdx + 1][movePerson.FatherIdx].X2;
                    parentX1 = this.generations[movePerson.GenerationIdx + 1][movePerson.MotherIdx].X1;
                }

                this.workingX1 = ((parentX2 + parentX1) / 2) - ((movePerson.X2 - movePerson.X1) / 2);
                this.workingX2 = this.workingX1 + (movePerson.X2 - movePerson.X1);
            }
        },

    GetNewX:function (genidx, percentageLess, personIdx) {


            var adjustedBoxHeight = 0.0;
            var adjustedDistanceApart = 0.0;
            var adjustedBoxWidth = 0.0;

            var childIdx = this.generations[genidx][personIdx].ChildIdx;

            if (genidx > 0) {
                adjustedBoxHeight = this.layoutVolatile.boxHeight - ((this.layoutVolatile.boxHeight / 100) * percentageLess);
                var childBoxWidth = (this.generations[genidx - 1][childIdx].X2 - this.generations[genidx - 1][childIdx].X1);
                var childCentrePoint = this.generations[genidx - 1][childIdx].X1 + (childBoxWidth / 2);
                adjustedDistanceApart = this.layoutVolatile.distanceBetweenBoxs - ((this.layoutVolatile.distanceBetweenBoxs / 100) * percentageLess);
                adjustedBoxWidth = childBoxWidth - ((childBoxWidth / 100) * percentageLess);

                var isFirstParent = false;
                var isLastParent = false;
                var isSingleParent = false;

                //trying to determine which of the parents we are refering to
                // because if its the first then x value will be lower than it would be for 2nd
                if (this.generations[genidx].length > personIdx + 1) {
                    if (this.generations[genidx][personIdx + 1].ChildIdx == this.generations[genidx][personIdx].ChildIdx) {
                        isFirstParent = true;
                    }

                }

                if (personIdx > 0) {
                    if (this.generations[genidx][personIdx].ChildIdx == this.generations[genidx][personIdx - 1].ChildIdx) {
                        isLastParent = true;
                    }
                }

                if (!isFirstParent && !isLastParent) {
                    isSingleParent = true;
                }


                if (isFirstParent) {
                    this.newX1 = childCentrePoint - (adjustedDistanceApart / 2) - adjustedBoxWidth;

                }

                if (isLastParent) {
                    this.newX1 = childCentrePoint + (adjustedDistanceApart / 2);
                }

                if (isSingleParent) {
                    this.newX1 = childCentrePoint - (adjustedBoxWidth / 2);
                }


                // newX1 = initialCentrePoint - newX1;
            }
            else {
                adjustedBoxHeight = this.layoutVolatile.boxHeight;
                adjustedBoxWidth = this.layoutVolatile.boxWidth;
                this.newX1 = this.centrePoint;
            }



            if (this.adjustedDistances.length > genidx) {
                this.adjustedDistances[genidx] = adjustedDistanceApart;
            }
            else {
                this.adjustedDistances[this.adjustedDistances.length] = adjustedDistanceApart;
            }

            if (this.adjustedBoxWidths.length > genidx) {
                this.adjustedBoxWidths[genidx] = adjustedBoxWidth;
            }
            else {
                //this.adjustedBoxWidths[this.adjustedBoxWidths.length] = adjustedBoxWidth;
                this.adjustedBoxWidths.push(adjustedBoxWidth);
            }


            if (this.adjustedBoxHeights.length > genidx) {
                this.adjustedBoxHeights[genidx] = adjustedBoxHeight;
            }
            else {
                //this.adjustedBoxHeights[this.adjustedBoxWidths.length] = adjustedBoxHeight;
                this.adjustedBoxHeights.push(adjustedBoxHeight);
            }
            this.newX2 = this.newX1 + adjustedBoxWidth;

        },

    getMoveList: function (person, startGen) {

        this.moveList = [];
        var moveGenIdx = startGen;


        let containsPerson = (personList, person) =>{
              for (var i = 0; i < personList.length; i++) {

                  if (personList[i].PersonId == person.PersonId) {
                      return true;
                  }
              }
              return false;
        };

        while (moveGenIdx > 0)
        {

            if (!containsPerson(this.moveList,this.generations[moveGenIdx][person]))
            {
                this.moveList.push(this.generations[moveGenIdx][person]);
            }



            person = this.generations[moveGenIdx][person].ChildIdx;

            moveGenIdx--;
        }


    },

    SetInitialValues: function (generations, selectedId,  ctx,  staticSettings , callback) {

      this.treeUI = new TreeUI();
      this.layoutDefaults=staticSettings.layoutDefaults;
      this.layoutVolatile ={...staticSettings.layoutDefaults};
      this.colourScheme = staticSettings.colourScheme.ancestor;
      this.bt_screenHeight = ctx.canvas.height;
      this.bt_screenWidth = ctx.canvas.width;
      this.ctx = ctx;


      this.centrePoint = 750.0;
      this.centreVerticalPoint = 0.0;
      this.zoomLevel = 0.0;
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
    SetZoom: function (percentage) {


        if (percentage !== 0.0) {
            var _workingtp = 0.0;
      //      var _percLocal_x = 0.0;
      //      var _percLocal_y = 0.0;

            //zoom drawing components
            this.layoutVolatile.zoomPercentage += percentage;
            this.zoomLevel += percentage;
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

            this.relativeCursorPosition = PureFunctions.GetPercDistances(this.bounds, this.mouse_x, this.mouse_y);
            //_percLocal_x = this.percX1;
          //  _percLocal_y = this.percY1;


            this.centreVerticalPoint += (this.bounds.drawingHeight / 100) * (this.relativeCursorPosition.y - this.initialRelativeCursorPosition.y);

            this.centrePoint += (this.bounds.drawingWidth / 100) * (this.relativeCursorPosition.x - this.initialRelativeCursorPosition.x);

            this.ComputeLocations();
        } //end percentage ==0.0)



        this.DrawTree();

    },
    SetZoomStart: function () {
        this.relativeCursorPosition = PureFunctions.GetPercDistances(this.bounds, this.mouse_x, this.mouse_y);
        this.initialRelativeCursorPosition = {...this.relativeCursorPosition};
//        this.mouseXPercLocat = this.percX1;
  //      this.mouseYPercLocat = this.percY1;
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

        //uconsole.log('perform click: ' + x + ' ' + y);
      //  var mouseLink = this.bt_links.LinkContainingPoint(x, y);

        var mouseLink = PureFunctions.LinkContainingPoint(this.bt_links,x, y);

        if (mouseLink !== null) {

            var selectedPerson = PureFunctions.GetTreePerson(this.generations,mouseLink.action);

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

          //  var buttonLink = this.bt_buttonLinks.LinkContainingPoint(x, y);

            var buttonLink = PureFunctions.LinkContainingPoint(this.bt_buttonLinks,x, y);


            if (buttonLink !== null) {

                var parts = buttonLink.action.split(',');

                var clickedPerson = PureFunctions.GetTreePerson(this.generations, parts[0]);

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

    //    console.log(param_x + ' - '+ param_y);
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
        var _temp = PureFunctions.GetTreePerson(this.generations, personId);

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
