
export class DateFunctions  {
  constructor() {

  }

  static YearDate() {

    // var str = "abt 1978 between 1943";
    var pattern = /[1][5-9][0-9][0-9]+/g;

    if (this.match == undefined)
        this.match = function (pat) {
            return true;
        };

    var matches = this.match(pattern);

    if (matches != null && matches.length > 0) {
        return Number(matches[0]);
    } else {
        return 0;
    }
  }

}
