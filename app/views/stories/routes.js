module.exports = function(router) {
  // Load helper functions

  // CHANGE VERSION each time you create a new version

  const base_url = "stories/"
  router.post('/' + base_url + 'onboarding/certifier-account', function(req, res) {
    var canContinue = req.query.continue || "no"
    let code
    console.log("req.body.certifierAccount = "+req.body.certifierAccountType)
    switch (req.body.certifierAccountType) {
      case "SP":
        code = req.body.spNumber;
        break;
      case "NV":
        code = req.body.nvNumber;
        break;
      case "CSO":
        code = req.body.csoNumber;
        break;
      default:
        code = ""

    }

    if(!req.body.certifierAccountType){
      res.redirect(301, '/' + base_url + 'onboarding/certifier-account?hasError=yes&errorType=notSelected');
    }

    if(code == "" && req.body.certifierAccountType != "administrative"){
      res.redirect(301, '/' + base_url + 'onboarding/certifier-account?hasError=yes&errorType=empty&retry=yes&accountType='+req.body.certifierAccountType);
    }
    if(code.charAt(0) == "9"){
      res.redirect(301, '/' + base_url + 'onboarding/not-found');
    }
    if(code.charAt(0) == "0"){
      res.redirect(301, '/' + base_url + 'onboarding/not-approved-as-certifier');
    }
    else{
      res.redirect(301, '/' + base_url + 'onboarding/signature?continue='+canContinue);
    }

  })

  router.post('/' + base_url + 'accessiblity/goods-certified-as*', function(req, res) {

    if (req.body.goods_certified_as) {
        res.redirect(301, '/' + base_url + 'end');
    } else {
      res.redirect(301, '/' + base_url + 'accessiblity/goods-certified-as'+req.params[0]+'?has_error=yes');
    }
  })
  router.post('/' + base_url + 'accessiblity/create-reference*', function(req, res) {

    if (req.body.UserReference == "") {
      res.redirect(301, '/' + base_url + 'accessiblity/create-reference'+req.params[0]+'?has_error=yes&error_type=empty');
    }if (req.body.UserReference.length > 20){
      res.redirect(301, '/' + base_url + 'accessiblity/create-reference'+req.params[0]+'?has_error=yes&error_type=length');
    }else{
      res.redirect(301, '/' + base_url + 'accessiblity/end');
    }

  })
  function getAccounts(ac){
    var list =[]
    for(i=0;i < ac.exporter.length; i++ ){
      list.push(ac.exporter[i])

    }
    for(i=0;i < ac.certifier.length; i++ ){
      list.push(ac.certifier[i])
    }
    return list
  }
  router.post('/' + base_url + 'continue-as/config', function(req, res) {
    req.session.data.currentAccountID = req.query.currentAccountID || "0"

    if(req.body.user_id.includes("5555")){
        res.redirect(301, '/' + base_url + 'continue-as/accounts-mixed-long');
    }
    if(req.body.user_id.includes("7777")){
        res.redirect(301, '/' + base_url + 'continue-as/cannot-access');
    }
    if(req.body.user_id.includes("6666")){
        res.redirect(301, '/' + base_url + 'continue-as/not-approved');
    }
    if(req.body.user_id.includes("0000")){
        res.redirect(301, '/' + base_url + 'continue-as/dashboard');
    }
    if(req.body.user_id.includes("2222")){
      req.session.data.currentAccountID = "1"
    }

    if(req.body.user_id.includes("3333")){
      req.session.data.currentAccountID = "2"
    }
    if(req.body.user_id.includes("4444")){
      req.session.data.currentAccountID = "3"
    }

    res.redirect(301, '/' + base_url + 'continue-as/accounts-mixed');
  })

  router.get('/' + base_url + 'continue-as/accounts-mixed*', function(req, res) {
    var accountID = req.query.id || req.session.data.currentAccountID || 0
    console.log(accountID)
    var account = getAccounts(req.session.data.accounts[accountID])
    res.render(base_url + 'continue-as/accounts-mixed'+req.params[0],{
      "account" : account,
      "name" : req.session.data.accounts[accountID].name,
      "individual" : req.session.data.accounts[accountID].individual,
      "fullAccount": req.session.data.accounts[accountID],
      "query": req.query
    });
  });

  router.post('/' + base_url + 'onboarding/gov-sign-in', function(req, res) {
    req.session.data.currentAccountID = req.body.user_id || "0000";
    req.session.data.isExporterApproved = "";
    var isApproved = false;
    var account = req.body.user_id || "0000";

    if(req.body.user_id.includes("0000")){
        req.session.data.isCertifier = "no"
        req.session.data.isExporter = "yes"
        req.session.data.accountType = "single"
        req.session.data.hasMultipleAccounts="no"

    }else if(req.body.user_id.includes("1111")){
      req.session.data.isCertifier = "yes"
      req.session.data.isExporter = "no"
      req.session.data.accountType = "multiple"
      req.session.data.hasMultipleAccounts="yes"
    }
    else if(req.body.user_id.includes("2222")){
      req.session.data.isCertifier = "yes"
      req.session.data.isExporter = "yes"
      req.session.data.accountType = "multiple"
      req.session.data.hasMultipleAccounts="yes"
    }else if(req.body.user_id.includes("9999")){
      req.session.data.isCertifier = "no"
      req.session.data.isExporter = "no"
      req.session.data.accountType = "single"
      req.session.data.hasMultipleAccounts="no"
      res.redirect(301, '/' + base_url + 'onboarding/cannot-access');
    }else{
      res.redirect(301, '/' + base_url + 'onboarding/not-approved');
    }

    if(req.session.data.approvedAccounts.includes(account)){
      if(req.session.data.hasMultipleAccounts == "no"){
          //just for now go to exporter dashbaord
          res.redirect(301, '/' + base_url + 'onboarding/dashboard-exporter-original');
      }else{
          res.redirect(301, '/' + base_url + 'onboarding/accounts');
      }

    }else{
        if(req.session.data.isExporter == "yes"){
          req.session.data.approvedAccounts.push(req.session.data.currentAccountID)
        }
        res.redirect(301, '/' + base_url + 'onboarding/start');
    }

  })

  router.post('/' + base_url + 'onboarding/signature', function(req, res) {
    var canContinue = req.query.continue || "no"
    req.session.data.approvedAccounts.push(req.session.data.currentAccountID)
    res.redirect(301, '/' + base_url + 'onboarding/confirmation?continue='+canContinue);
  })

  router.post('/' + base_url + 'unified-dashboard/*/export-destination', function(req, res) {
    console.log(req.body.country+'.')
    if(req.body.country == "France" || req.body.country == "Denmark" || req.body.country == "Germany" || req.body.country == "Ireland" || req.body.country == "Northern Ireland"){
      res.redirect(301, '/' + base_url + 'unified-dashboard/'+req.params[0]+'/select-certificate');
    }
    res.redirect(301, '/' + base_url + 'unified-dashboard/'+req.params[0]+'/form-finder?destination_country='+req.body.country);
  })
  // COPY
  router.post('/' + base_url + 'copy/*/commodity-error', function(req, res) {
    var errors = []
    var hasErrors = false
    console.log(req.body.dateOfCollectionProduction)
    if(req.body.packageCount == ""){
      hasErrors=true
      errors.push("packageCount")
    }
    if (req.body.netWeight == "" ){
      hasErrors=true
      errors.push("netWeight")
    }
    if ( req.body.dateOfCollectionProduction == ""){
      errors.push("dateOfCollectionProduction")
      hasErrors=true
    }

    if (hasErrors){
      res.redirect(301, '/' + base_url + 'copy/'+req.params[0]+'/commodity-error?hasError=yes&errorType='+errors);
    }
    else{
      res.redirect(301, '/' + base_url + 'copy/'+req.params[0]+'/commodities');
    }

  })

}
