import plusImg from '../../public/Assets/open.png'; // with import
import minusImg from '../../public/Assets/close.png'; // with import

export class TreeUI {

    Init(isAnc, context, callback){
      this.docClose = new Image();
      this.docNew = new Image();
      this.modelCode = isAnc;

      this.docClose.src = plusImg;

      var that = this;
      this.docClose.onload = function () {
          that.docNew.src = minusImg;

          that.docNew.onload = function () {
              callback(that);
          };

      };
    }

    ClearContext (ctx){
      ctx.clearRect (0, 0, ctx.canvas.width, ctx.canvas.height);
    }

    DrawLine(ctx, colourScheme, points) {

        var _pointIdx = 0;
        ctx.beginPath();
        var _validLine = false;
        var _sx1 = -100; //screen left
        var _sx2 = ctx.canvas.width + 100; // screen right
        var _sy1 = -100;
        var _sy2 = ctx.canvas.height + 100;


        while (_pointIdx < points.length) {
            var _Point = points[_pointIdx];


            if (((_Point[0] > _sx1) && (_Point[0] < _sx2)) && ((_Point[1] > _sy1) && (_Point[1] < _sy2))) {
                _validLine = true;
                break;
            }

            // but its also valid if line crosses the screen!
            if (_pointIdx > 0 && !_validLine) {
                var _prevPoint = points[_pointIdx - 1];
                if ((_prevPoint[0] > _sx1 && _prevPoint[0] < _sx2 && _Point[0] > _sx1 && _Point[0] < _sx2) && ((_prevPoint[1] < _sy2 && _Point > _sy2) || (_prevPoint[1] < _sy1 && _Point[1] > _sy2))) _validLine = true;
                if ((_prevPoint[1] > _sy1 && _prevPoint[1] < _sy2 && _Point[1] > _sy1 && _Point[1] < _sy2) && ((_prevPoint[0] < _sx2 && _Point > _sx2) || (_prevPoint[0] < _sx1 && _Point[0] > _sx1))) _validLine = true;

                if (_validLine)
                    break;
            }

            _pointIdx++;
        }


        if (_validLine) {
            _pointIdx = 0;
            while (_pointIdx < points.length) {
                let _Point = points[_pointIdx];
                if (_pointIdx === 0) {
                    ctx.moveTo(_Point[0], _Point[1]);
                }
                else {
                    ctx.lineTo(_Point[0], _Point[1]);
                }
                _pointIdx++;
            }

            ctx.globalAlpha = colourScheme.globalAlpha;
            ctx.lineWidth = colourScheme.lineWidth;

            ctx.strokeStyle = colourScheme.linecolour;

            ctx.stroke();
        }


    }

    DrawButton (ctx,colourScheme, _person, checked) {
        var linkArea = { x1: 0, x2: 0, y1: 0, y2: 0, action: 'box' };
        //
        if (_person.IsDisplayed &&
                    _person.X2 > 0 &&
                    _person.X1 < ctx.canvas.width &&
                    _person.Y2 > -100 &&
                    _person.Y1 < ctx.canvas.height &&
                    _person.ChildLst.length > 0 &&
                    _person.zoom >= 3 &&
                    !_person.IsHtmlLink
                    ) {

            // this doesnt correspond to the isdisplayed person of the property
            // because obviously the we want the parent to stay visible so we
            // can turn on and off the childrens visibility. if we cant see it , we cant turn anything on and off..
            if (checked) {
                ctx.fillStyle = colourScheme.checkedOpenColour;
                ctx.drawImage(this.docClose, _person.X1 - 10, _person.Y1 + 5);
            }
            else {
                ctx.fillStyle  = colourScheme.checkedClosedColour;
                ctx.drawImage(this.docNew, _person.X1 - 10, _person.Y1 + 5);
            }


            linkArea.y1 = _person.Y1 + 5;
            linkArea.x1 = _person.X1 - 10;

            linkArea.y2 = _person.Y1 + 30;
            linkArea.x2 = _person.X1 + 10;

            linkArea.action = _person.PersonId + "," + String(checked);
        }
        else {
            linkArea = null;
        }
        return linkArea;

    }

    DrawPerson (ctx,colourScheme,_person, sourceId, zoomPerc) {

        let xoffset = 0;

        let linkArea = { x1: 0, x2: 0, y1: 0, y2: 0, action: '' };

        if (_person.IsDisplayed &&
                    _person.X2 > 0 &&
                    _person.X1 < ctx.canvas.width &&
                    _person.Y2 > -100 &&
                    _person.Y1 < ctx.canvas.height) {


            ctx.beginPath();


            if (_person.zoom >= 1000) {
                let rectX = _person.X1;
                let rectY = _person.Y1;
                let rectWidth = Math.abs(_person.X2 - _person.X1);
                let rectHeight = Math.abs(_person.Y2 - _person.Y1);
                let radius = 10;
                ctx.strokeStyle = colourScheme.strokeStyle;
                ctx.lineWidth = colourScheme.lineWidth;
                this.RoundedRect(ctx, rectX, rectY, rectWidth, rectHeight, radius);
            }
            else {
                if (this.modelCode == 1) {
                    //boxs
                    xoffset = 3;

                    ctx.rect(_person.X1, _person.Y1, Math.abs(_person.X2 - _person.X1), Math.abs(_person.Y2 - _person.Y1));
                    ctx.fillStyle = colourScheme.backgroundcolour;
                    ctx.fill();
                    ctx.lineWidth = colourScheme.lineWidth;
                    ctx.strokeStyle = colourScheme.linecolour;
                    ctx.stroke();

                }
                else {
                    xoffset = 16;
                    //lines
                    let halfwidth = Math.abs(_person.X2 - _person.X1) / 2;
                    let middlebox = _person.X1 + halfwidth;

                    //middle of box
                    if ((_person.ChildCount > 0 || _person.SpouseIdLst.length> 0) && !_person.IsHtmlLink) {

                        if (_person.GenerationIdx == 0) {
                            ctx.moveTo(middlebox, _person.Y2 - 7);
                            ctx.lineTo(middlebox, _person.Y2);
                            ctx.closePath();
                            ctx.fill();
                            ctx.globalAlpha = colourScheme.globalAlpha;
                            ctx.lineWidth = colourScheme.heavyLineWidth;
                        }
                        else {

                            ctx.moveTo(middlebox, _person.Y1);
                            ctx.lineTo(middlebox, _person.Y2);
                            ctx.closePath();
                            ctx.fill();
                            ctx.globalAlpha = colourScheme.globalAlpha;
                            ctx.lineWidth = colourScheme.lineWidth;
                        }
                    }
                    else {

                        if (!_person.IsHtmlLink) {
                            ctx.moveTo(middlebox, _person.Y1);
                            ctx.lineTo(middlebox, _person.Y1 + 7);
                        }
                        else {
                            ctx.moveTo(middlebox, _person.Y2 - 7);
                            ctx.lineTo(middlebox, _person.Y2);
                        }

                        ctx.closePath();
                        ctx.fill();
                        ctx.globalAlpha =  colourScheme.globalAlpha;
                        ctx.lineWidth = colourScheme.heavyLineWidth;
                    }

                    ctx.strokeStyle = colourScheme.linecolour;
                    ctx.stroke();
                }


            }


            ctx.globalAlpha = colourScheme.globalAlpha;

            var linespacing = 15;

            if (_person.zoom >= 7) {
                linespacing = 30;

            }


            var _y = this.WriteName(ctx,colourScheme,_person.X1 + xoffset, _person.Y1 + 19, _person, 0);

            if (_person.IsHtmlLink) {
                linkArea.y1 = _person.Y1;
                linkArea.x1 = _person.X1 + xoffset;
                linkArea.y2 = _y - linespacing;
                linkArea.x2 = _person.X2;
                linkArea.action = _person.PersonId;
            }
            else {
                linkArea = null;
            }

            ctx.font = colourScheme.defaultFont;
            ctx.fillStyle = colourScheme.textcolour;

            switch (_person.zoom) {

                case 4: //show name
                    ctx.fillText("DOB: " + _person.RecordLink.DOB, _person.X1 + xoffset, _y);
                    _y += linespacing;
                    if (_y <= _person.Y2 - 10) {
                        _y = this.WriteBLocation(ctx,colourScheme,_person.X1 + xoffset, _y, _person, 1); //+ linespacing
                    }
                    break;
                case 5: //show name
                case 6:
                case 7:
                case 8:

                    ctx.fillText("Dob: " + _person.RecordLink.DOB, _person.X1 + xoffset, _y);
                    _y += linespacing;

                    if (_y <= _person.Y2 - 10) {
                        _y = this.WriteBLocation(ctx,colourScheme,_person.X1 + xoffset, _y, _person, 2); //+ linespacing
                    }

                    if (_y <= _person.Y2 - 10) {
                        ctx.fillText("Dod: " + _person.RecordLink.DOD, _person.X1 + xoffset, _y);

                        _y += linespacing;

                        this.WriteDLocation(ctx, colourScheme, _person.X1 + xoffset, _y, _person, 2);
                    }
                    break;

            }
        }

        //typically used in descendanttree drawtree method
        //adds to basetree links collection
        return linkArea;

    }

    RoundedRect(ctx, x, y, width, height, radius) {
        ctx.beginPath();
        ctx.moveTo(x, y + radius);
        ctx.lineTo(x, y + height - radius);
        ctx.quadraticCurveTo(x, y + height, x + radius, y + height);
        ctx.lineTo(x + width - radius, y + height);
        ctx.quadraticCurveTo(x + width, y + height, x + width, y + height - radius);
        ctx.lineTo(x + width, y + radius);
        ctx.quadraticCurveTo(x + width, y, x + width - radius, y);
        ctx.lineTo(x + radius, y);
        ctx.quadraticCurveTo(x, y, x, y + radius);
        ctx.stroke();
    }

    WriteName(ctx,colourScheme,xpos, ypos, _person, maxlines) {
        ctx.font = "bold 8pt Calibri";

        if (_person.IsHtmlLink) {
            //this.context.fillStyle = "#1600BF";
            ctx.fillStyle = colourScheme.spousecolour;
        }
        else {
            ctx.fillStyle = colourScheme.textcolour;
        }

        var _textToDisplay = this.MakeArray(_person, _person.RecordLink.Name);
        var _y = ypos;

        var linespacing = 15;

        if (maxlines === 0 || _textToDisplay.length <= maxlines) {
            maxlines = _textToDisplay.length;
        }

        for (var i = 0; i < maxlines; i++) {
            ctx.fillText(_textToDisplay[i], xpos, _y);
            _y += linespacing;
        }

        //reset to black.
        ctx.font = colourScheme.defaultFont;
        ctx.fillStyle = "black";
        return _y;
    }

    WriteBLocation(ctx,colourScheme,xpos, ypos, _person, maxlines) {

        ctx.font = colourScheme.defaultFont;
        ctx.fillStyle = colourScheme.textcolour;

        _person.RecordLink.BirthLocation = _person.RecordLink.BirthLocation.replace(",", " ");
        _person.RecordLink.BirthLocation = _person.RecordLink.BirthLocation.replace("  ", " ");

        var _textToDisplay = this.MakeArray(_person, _person.RecordLink.BirthLocation);
        var _y = ypos;

        var linespacing = 15;


        if (maxlines === 0 || _textToDisplay.length <= maxlines) {
            maxlines = _textToDisplay.length;
        }


        for (var i = 0; i < maxlines; i++) {
            ctx.fillText(_textToDisplay[i], xpos, _y);
            _y += linespacing;
        }
        return _y;
    }

    WriteDLocation(ctx,colourScheme,xpos, ypos, _person, maxlines) {

        ctx.font = colourScheme.defaultFont;
        ctx.fillStyle = colourScheme.textcolour;

        var _textToDisplay = this.MakeArray(_person, _person.RecordLink.DeathLocation);

        var _y = ypos;

        var linespacing = 15;

        if (maxlines === 0 || _textToDisplay.length <= maxlines) {
            maxlines = _textToDisplay.length;
        }

        for (var i = 0; i < maxlines; i++) {
            if (_y < _person.Y2 - 10) {
                ctx.fillText(_textToDisplay[i], xpos, _y);
                _y += linespacing;
            }
        }
        return _y;
    }

    MakeArray(person, parseStr) {

        var name = '';
        var nameAr = [];
        var i = 0;
        var character_width = 3;
        var max_text_width = Math.abs(person.X2 - person.X1);
        var max_char_count = max_text_width / character_width;

        switch (person.zoom) {

            case 1:
                nameAr.push('');
                break;
            case 2:

                if (parseStr !== '') {
                    var parts = parseStr.split(' ');

                    for (i = 0; i < parts.length; i++) {

                        if (parts[i].length > 0)
                            name += parts[i].slice(0, 1) + " ";
                    }
                }
                nameAr.push(name);
                break;
            case 3:
            case 4:
            case 5:
            case 6:

                nameAr = parseStr.split(' ');

                for (i = 0; i < nameAr.length; i++) {

                    if ((nameAr[i].length * character_width) > max_text_width)
                        nameAr[i] = nameAr[i].slice(0, max_char_count - 1) + " ";
                }
                break;
            case 7:
            case 8:
                nameAr.push(parseStr);
                break;
        }

        return nameAr;
    }


}
