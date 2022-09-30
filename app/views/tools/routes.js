module.exports = function(router) {
  // Load helper functions


  // CHANGE VERSION each time you create a new version
  const base_url = "tools/"


  router.post('/' + base_url + 'select-to-json-converter', function(req, res) {
    let h=req.body.htmlInput
    var result = [];
    var result = h.match(/<*>(.*?)<\/option>/g).map(function(val){
      var v=val.replace(/<\/?option>/g,'')
      // I am not too good at regex so its a bit of hack to clean up the string
      var v2 = v.replace(/>/g,'')
      return v2;
    });
    // remove the first entry
    result.shift()
    req.session.data.jsonResult=JSON.stringify(result)
    res.redirect(301, '/' + base_url + 'select-to-json-converter?showResult=yes');
  })
  router.post('/' + base_url + 'commodity-to-json-converter', function(req, res) {
    let h=req.body.htmlInput
    var array = h.split(/\r?\n/);
    // console.log(array)
    var result='"commodities": ['
    array.forEach(element => {
      if(element.length > 5){
        var code = element.split(/([^\.]*\*){2}/)
        var line="{";
        for (var i=0; i < code.length; i++){
          var c = code[i].replace(/\*/g,'')
          if(i==1){
            line += '"code":"'+c+'",';
          }else if (i==2){
            line += '"title":"'+c+'"';
          }
        }
        line+="},"
        result+=line
      }


    });
    result=result.substring(0,result.length-1)
    result+="]"
    req.session.data.jsonResult=result
    res.redirect(301, '/' + base_url + 'commodity-to-json-converter?showResult=yes');
  })





}
