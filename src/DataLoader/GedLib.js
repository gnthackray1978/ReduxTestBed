import {DateFunctions} from "../DateFunctions.js";

export class GedLib {

  constructor(){
    // this.cacheFamilies = [];
    // this.cachePersons = [];
    // this.families = [];
    // this.persons = [];
    // this.loader = null;
  }

  static parseLine(line) {

      var gRow = {};

      var split = line.trim().split(' ');

      gRow.split = split;

      gRow.level = Number(split.shift());

      gRow.id = '';
      gRow.value = '';

      var tmp = split.shift();

      if (tmp != undefined) {
          if (gRow.level == 0) {
              if (tmp.charAt(0) == '@') {
                  gRow.id = tmp;
                  gRow.tag = split.shift() || '';

              } else {
                  gRow.tag = tmp;
                  gRow.id = split.shift() || '';
              }
          } else {


              gRow.tag = tmp;

              tmp = split.shift();

              while (tmp != undefined) {
                  gRow.value += ' ' + tmp;
                  tmp = split.shift();
              }

              gRow.value = gRow.value.trim();
          }
      }


      return gRow;
  }

  processFile(file,progressFunction, newloader) {

      let families = [];
      let persons = [];

      var asynchCall = function (func, callback) {
         setTimeout(function() {
              func();
              if (callback) {callback();}
          }, 0);
      };


      console.log('processFile');


      var results = file.match(/[^\n]+(?:\r?\n|$)/g);

      if(results == null || results.length ==0){
          newloader();
          return;
      }

      var that = this;

      var makeLists = function(){
          var idx =0;
          var currentId = {};

          while (idx < results.length) {
              var gLine = GedLib.parseLine(results[idx]);
              try {
                  if (gLine.id != '') {
                      currentId = {};
                      currentId.type = gLine.tag;
                      currentId.id = gLine.id;
                      currentId.children = [];
                      currentId.generation = -1;
                      currentId.date = 0;
                      currentId.BaptismPlace = '';
                      currentId.BirthPlace = '';
                      currentId.BirthDate = '';
                      currentId.BaptismDate = '';
                      currentId.husbId = '0';
                      currentId.wifeId = '0';
                      currentId.isFirst = false;
                      currentId.OccupationDate= '';
                      currentId.OccupationPlace= '';
                      currentId.Occupation = '';
                      currentId.DeathLocation = '';
                      currentId.name = '';

                      if (currentId.type == 'FAM') families.push(currentId);

                      if (currentId.type == 'INDI') persons.push(currentId);
                  } else {

                      if (currentId.type == 'FAM') {


                          if (gLine.tag == 'HUSB') currentId.husbId = gLine.value;
                          if (gLine.tag == 'WIFE') currentId.wifeId = gLine.value;

                          if (gLine.tag == 'CHIL') currentId.children.push(gLine.value);

                      }


                      if (currentId.type == 'INDI') {


                          if (gLine.tag == 'NAME') currentId.name = gLine.value.replace("/", "").replace("/", "");
                          if (gLine.tag == 'FAMS') currentId.famId = gLine.value;


                      }


                      if (idx <= results.length) {
                          var nextLine = GedLib.parseLine(results[idx + 1]);

                          while (idx <= results.length && nextLine.level > 1) {

                              if (gLine.tag == 'BAPL' || gLine.tag == 'BAPM' || gLine.tag == 'CHR') {
                                  if (nextLine.tag == 'DATE') currentId.date = DateFunctions.YearDate(nextLine.value);
                                  if (nextLine.tag == 'DATE') currentId.BaptismDate = nextLine.value;
                                  if (nextLine.tag == 'PLAC') currentId.BaptismPlace = nextLine.value;
                              }

                              if (gLine.tag == 'BIRT') {
                                  if (nextLine.tag == 'DATE') currentId.date = DateFunctions.YearDate(nextLine.value);
                                  if (nextLine.tag == 'DATE') currentId.BirthDate = nextLine.value;
                                  if (nextLine.tag == 'PLAC') currentId.BirthPlace = nextLine.value;
                              }

                              if (gLine.tag == 'MARR') {
                                  if (nextLine.tag == 'DATE') currentId.date = DateFunctions.YearDate(nextLine.value);
                                  if (nextLine.tag == 'DATE') currentId.MarDate = nextLine.value;
                                  if (nextLine.tag == 'PLAC') currentId.MarPlace = nextLine.value;
                              }

                              if (gLine.tag == 'OCCU') {

                                  currentId.Occupation = gLine.value;

                                  if (nextLine.tag == 'DATE') currentId.OccupationDate = nextLine.value;
                                  if (nextLine.tag == 'PLAC') currentId.OccupationPlace = nextLine.value;
                              }

                              if (gLine.tag == 'DEAT') {

                                  if (nextLine.tag == 'DATE') currentId.DeathDate = nextLine.value;
                                  if (nextLine.tag == 'PLAC') currentId.DeathPlace = nextLine.value;
                              }

                              results.splice(idx + 1, 1);
                              nextLine = GedLib.parseLine(results[idx + 1]);

                              //because we have take a row out of the array dont need to increment anything
                          }
                      }
                  }
              } catch(err) {
              }
              idx++;
          }


      };

      var parseSpouses = function(){
          // we need to have the families ordered by the birth of their children
          var famChildIdx = 0;
          var famidx = 0;

          var idx = 0;
          while (idx < persons.length) {

              famidx = 0;

              while (famidx < families.length) {

                  if (families[famidx].husbId == persons[idx].id) families[famidx].husband = persons[idx];

                  if (families[famidx].wifeId == persons[idx].id) families[famidx].wife = persons[idx];

                  famChildIdx = 0;
                  while (famChildIdx < families[famidx].children.length) {
                      if (families[famidx].children[famChildIdx] == persons[idx].id) {
                          families[famidx].children[famChildIdx] = persons[idx];

                          if (families[famidx].date != undefined)
                              families[famidx].date =  DateFunctions.YearDate(persons[idx].BirthDate);

                          break;
                      }
                      famChildIdx++;
                  }


                  famidx++;
              }

              idx++;
          }
      };

      var parseChildren = function(){
          // sort family children
          var famidx = 0;
          while (famidx < families.length) {

              families[famidx].children.sort(function(a, b) {
                  return a.date - b.date;
              });

              if (families[famidx].husbId != '0')
                  families[famidx].husband.children = families[famidx].children;

              if (families[famidx].wifeId != '0')
                  families[famidx].wife.children = families[famidx].children;

              if (families[famidx].husband == undefined) families[famidx].husband = { id: 0 };
              if (families[famidx].wife == undefined) families[famidx].wife = { id: 0 };

              famidx++;
          }
          // sort families
          families.sort(function(a, b) {
              return a.date - b.date;
          });
      };

      progressFunction('parsing ged file',true);


      asynchCall(makeLists, function(){
          progressFunction('parsing persons',true);
          asynchCall(parseSpouses, function(){
              progressFunction('parsing families',true);
              asynchCall(parseChildren, function(){

                  var rng = GedLib.findDateRange(persons);

              //    that.cacheFamilies = JSON.parse(JSON.stringify(that.families));
              //    that.cachePersons = JSON.parse(JSON.stringify(that.persons));

                  newloader(families, persons, rng);
              });
          });
      });


  }

  static findDateRange(persons) {

      var startDate =2000;
      var endDate =0;

      var idx = 0;
      while (idx < persons.length) {
          var date = persons[idx].date;

          if (date && date < startDate && date !=0) {
              startDate = date;
          }

          if (date && date > endDate && date !=0) {
              endDate = date;
          }

          idx++;
      }

      return {s:startDate, e:endDate};
  }

  static FindPerson (persons, target) {
      var idx = 0;
      while (idx < persons.length) {

          if (persons[idx].id == target) {
              return persons[idx];
          }
          idx++;
      }

      return null;
  }

  static MakeFirst(persons,person) {
      var idx = 0;
      while (idx < persons.length) {

          if (persons[idx].id == person) {
              persons[idx].isFirst = true;
              return persons[idx];
          }
          idx++;
      }

      return null;
  }

  static FindFurthestAncestor(families, startperson) {

    const getPersonFamily = (families, personId)=>{
      const grep = (items, callback) => {
          var filtered = [],
              len = items.length,
              i = 0;
          for (i; i < len; i++) {
              var item = items[i];
              var cond = callback(item);
              if (cond) {
                  filtered.push(item);
              }
          }

          return filtered;
      };

      let family = grep(families, function (e) {

          var innerresult = grep(e.children, function (a) {
              return a.id == personId;
          });

          return innerresult.length > 0 ? true : false;
      });
      return family;
    };

    console.log('SearchFurthestAncestor');

    var searchPersonId = startperson;
    var isSearching = true;


    while (isSearching) {

        let family = getPersonFamily(families,searchPersonId);

        if (family.length > 0) {
            if (family[0].husbId != '0') {
                searchPersonId = family[0].husbId;
            } else {
                if (family[0].wifeId != '0') {
                    searchPersonId = family[0].wifeId;
                } else {
                    searchPersonId = '0';
                }

            }
        } else {
            isSearching = false;

        }

    }

    return searchPersonId;
  }

  static SetRawDataGenerationProp(families, generation){
    var idx = 0;

    while (idx < families.length) {
        if (families[idx].husband != undefined) families[idx].husband.generation = generation;
        if (families[idx].wife != undefined) families[idx].wife.generation = generation;

        var iidx =0;

        while(iidx < families[idx].children.length){
            families[idx].children[iidx].generation = generation;
            iidx++;
        }

        idx++;
    }
  }
}
