
export class DateFunctions  {
  constructor() {

  }

  static YearDate(dateParam) {

    // var str = "abt 1978 between 1943";
    let pattern = /[1][5-9][0-9][0-9]+/g;

    let matches = pattern.exec(dateParam);

    if (matches != null && matches.length > 0) {
        return Number(matches[0]);
    } else {
        return 0;
    }
  }

}
