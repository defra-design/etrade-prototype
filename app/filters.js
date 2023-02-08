const _ = require('lodash');
module.exports = function(env) {
  /**
   * Instantiate object used to store the methods registered as a
   * 'filter' (of the same name) within nunjucks. You can override
   * gov.uk core filters by creating filter methods of the same name.
   * @type {Object}
   */
  var filters = {}

  // filters.getCommodityCode = function(s) {
  //
  //   var thenum = s.replace( /^\D+/g, '');
  //   var n = thenum
  //   if(thenum.length > 8){
  //     var n = thenum.slice(0, 8);
  //   }
  //   return n;
  // }
  filters.showHide = function(obj, text) {
    var query = text.split();
    for (key in obj) {
      for (var v = 0; v < query.length; v++) {
        if (obj[key].indexOf(query[v]) != -1) {
          return "show";
        }
      }
    }
    return "hide";
  }
  filters.increase = function(num) {
        return num+=1;

  }
  filters.convertCountry  = function(iso){
    let regionNames = new Intl.DisplayNames(['en'], {type: 'region'});
    if(iso == "XI"){
      return "United Kingdom - Northern Ireland"
    }else{
      return regionNames.of(iso);
    }
    
  }
  filters.removeText = function(s,t) {
        return s.replace(t,'')

  }
  filters.getCode = function(text) {

    var regex = /[\d]{4}/g
    var newtext = text.match(regex)
    return newtext
  }

  filters.hasSchema = function(t, s) {
    var show = false
    s.forEach(item => {
      if (item.id == t) {
        show = true
      }
    })
    return show
  }

  filters.getCommodityCode = function(s) {
    var n = s
    var marker = s.indexOf("-") - 1;
    if (marker != -1) {
      var n = s.slice(0, marker);
    }
    return n;
  }

  filters.truncate = function(s, c) {
    console.log(s)
    if (s.length > c) {
      return s.slice(0, c) + "..."
    }
    return s;
  }



  filters.makeNumber = function(n) {
    return Number(n).toLocaleString("en-US")
  }

  filters.possesive = function(str) {

    var i = str.charAt(str.length - 1)
    console.log(str)

    if (i == "s") {
      return str + "'";
    } else if (i == "y") {
      let ns = str.slice(0, -1)
      return ns + "ies";
    } else {
      return str + "'s";
    }
  }

  filters.plural = function(singluar, plural, count) {

    // thought it could be like possesive filter, but there are excepetions to the rules so just made it simple switch
    console.log(count)
    if (count == 1) {
      // return original value
      return singluar
    } else {
      // return plural value
      return plural
    }
  }

  filters.getArrayFromString = function(text) {
    var ary = []
    text.split(/\s*,\s*/).forEach(function(myString) {
      ary.push(myString)
    });
    return ary
  }

  filters.getParamFromURL = function(url, name) {
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
      results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
  }


  filters.getDate = function(day, mon, year) {
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    day.toString().replace(/^0+/, '')
    // mon.replace(/^0+/, '')
    return day + " " + months[mon - 1] + " " + year
  }

  filters.getDateFromExcel = function(excelDateString) {
    var months = ["", "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    var day = excelDateString.substring(8, 10);
    var monthIndex = parseInt(excelDateString.substring(5, 7));
    var month = months[monthIndex];
    var year = excelDateString.substring(0, 4);
    // return "16/08/2022";
    return day + " " + month + " " + year;
  }

  filters.getFileName = function(txt) {
    return txt.substr(txt.lastIndexOf('.') + 1);
  }
  filters.formatCode = function(text) {
    return JSON.stringify(text, undefined, 2);
  }

  filters.removeWhiteSpace = function(text) {
    return text.replace(/\s/g, '')
  }
  filters.convertToPageID = function(text) {
    return text.replace(/\s/g, '-')
  }

  filters.hasDuplicate = function(t,arr,key) {
      var k = key || "EHC"
      result = false
      for (var i = 0; i < arr.length; i++) {
        if(t == arr[i][k] ){
          result = true
        }
      }
      return result
  }

  filters.sort = function(arr) {

      return arr.sort()
  }
  filters.sortby = function(arr,key) {

      return arr.sort((a, b) => a[key] > b[key] ? 1 : -1);
  }
  
  filters.addToListComplete = function(list, data, completePrefix) {
    // This could be made more dynamic, used for task list.
    let checked = []
    console.log("---   ----")
    console.log("--addToListComplete START --")
    if (list) {
      for (var i = 0; i < list.length; i++) {
        console.log("Checking: " + list[i])
        let item = list[i]
        console.log("Checking data : " + completePrefix + item)
        console.log("Checking data value: " + data[completePrefix + item])
        if (data[completePrefix + item] == "1") {
          console.log("adding to checked list")
          checked.push("checked")
        }
      }
      console.log("Checking if all completed : " + checked.length + " | " + list.length)
      if (checked.length == list.length) {
        return true
      }
    }

    return false
  }

  filters.randomNumberGenerator = function(number) {
    return (Math.floor(Math.random() * number) + 1);
  }

  filters.findObjectByKey = function(key, list) {
      for (var i = 0; i < list.length; i++) {
        if(list[i].user == key){
          return list[i]
        }
      }
      return list[0]
  }


filters.updateObject = function(arr,id,key,val){
    arr[id][key]=val
    return arr
  }
  /* ------------------------------------------------------------------
    add your methods to the filters obj below this comment block:
    @example:

    filters.sayHi = function(name) {
        return 'Hi ' + name + '!'
    }

    Which in your templates would be used as:

    {{ 'Paul' | sayHi }} => 'Hi Paul'

    Notice the first argument of your filters method is whatever
    gets 'piped' via '|' to the filter.

    Filters can take additional arguments, for example:

    filters.sayHi = function(name,tone) {
      return (tone == 'formal' ? 'Greetings' : 'Hi') + ' ' + name + '!'
    }

    Which would be used like this:

    {{ 'Joel' | sayHi('formal') }} => 'Greetings Joel!'
    {{ 'Gemma' | sayHi }} => 'Hi Gemma!'

    For more on filters and how to write them see the Nunjucks
    documentation.

  ------------------------------------------------------------------ */
  // -------------------------------------------------------------------
  // Object based filters - taken from register-trainee-teachers-prototype @edwardhorsford
  // -------------------------------------------------------------------


  // Combine objects without mutating original
  filters.mergeObjects = (...items) => {
    return Object.assign({}, ...items)
  }


  filters.objectArrayToArray = array => {
    let newArray = []
    array.forEach(item => {
      let newItem = []
      Object.keys(item).forEach(part => {
        newItem.push(item[part])
      })
      newArray.push(newItem)
    })
    return newArray
  }

  filters.objectToArray = object => {
    if (!object) return []
    let newArray = []
    Object.keys(object).forEach(key => {
      newArray.push(object[key])
    })
    return newArray
  }





  // -------------------------------------------------------------------
  // keep the following line to return your filters to the app
  // -------------------------------------------------------------------

  return filters
}
