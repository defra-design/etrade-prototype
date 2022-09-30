module.exports = function(router) {
  // Load helper functions


  // CHANGE VERSION each time you create a new version
  const base_url = "stories/accessiblity/"

  router.post('/' + base_url + 'goods-certified-as*', function(req, res) {

    if (req.body.goods_certified_as) {
        res.redirect(301, '/' + base_url + 'end');
    } else {
      res.redirect(301, '/' + base_url + 'goods-certified-as'+req.params[0]+'?has_error=yes');
    }

  })
  router.post('/' + base_url + 'create-reference*', function(req, res) {

    if (req.body.UserReference == "") {
      res.redirect(301, '/' + base_url + 'create-reference'+req.params[0]+'?has_error=yes&error_type=empty');
    }if (req.body.UserReference.length > 20){
      res.redirect(301, '/' + base_url + 'create-reference'+req.params[0]+'?has_error=yes&error_type=length');
    }else{
      res.redirect(301, '/' + base_url + 'end');
    }

  })





}
