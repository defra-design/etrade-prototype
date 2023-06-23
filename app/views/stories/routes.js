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

   router.post('/' + base_url + 'container-numbers/*/container-seal-numbers-2', function(req, res) {
    req.session.data.containerSealNumbers.push(req.body)
    res.redirect(301, '/' + base_url + 'container-numbers/'+req.params[0]+'/container-seal-numbers-list');
    
  })

  router.post('/' + base_url + 'container-numbers/*/add-container-number', function(req, res) {
    var container = req.body.containerNumbers 
    // check to see if continer number matches the requirment. 
    // 3 letters followed by a U,J,Z or R then followed by 6 numbers followed by 1 number.
    if(!container.match(/^[a-zA-Z]{3}[UJZR][0-9]{6}(\s)*\d$/)){

      res.redirect(301, '/' + base_url + 'container-numbers/'+req.params[0]+'/add-container-number?hasError=yes');
    }
    else{
      // need it to be UpperCase
      req.session.data.containerNumbers=req.body.containerNumbers.toUpperCase()

      res.redirect(301, '/' + base_url + 'container-numbers/'+req.params[0]+'/add-seal-numbers');
    }
    
    
    
  })
  router.post('/' + base_url + 'container-numbers/*/add-container-and-seal-number', function(req, res) {
  console.log("post from add-container-and-seal-number")
    var seals = req.body.sealNumbers
    var container = req.body.containerNumbers
    var item = {"container":container,"seals":seals}
    // check to see if continer number matches the requirment. 
    // 3 letters followed by a U,J,Z or R then followed by 6 numbers followed by 1 number.
    if(!container.match(/^[a-zA-Z]{3}[UJZR][0-9]{6}(\s)*\d$/)){

      res.redirect(301, '/' + base_url + 'container-numbers/'+req.params[0]+'/add-container-and-seal-number?hasError=yes&errorType=containers');
    }
    else{
      // need it to be UpperCase
      req.session.data.containerSealNumbers.push(item)

      res.redirect(301, '/' + base_url + 'container-numbers/'+req.params[0]+'/container-seal-numbers-list');
    }
    
    
    
  })
 router.post('/' + base_url + "container-numbers/*/remove", function(req, res) {
    console.log("In goods containter-seal-numbers remove");
    req.session.data.goods['hasContainers'] = ""
    if (req.body.remove == "yes" ) {
      req.session.data.containerSealNumbers.splice(req.query.id, 1);
    }
    if(req.session.data.containerSealNumbers.length == 0 ){
      res.redirect(301, '/' + base_url + 'container-numbers/'+req.params[0]+'/container-seal-numbers-start');
    }else{
      res.redirect(301, '/' + base_url + 'container-numbers/'+req.params[0]+'/container-seal-numbers-list');
    }


  })
  
 router.post('/' + base_url + 'container-numbers/*/add-seal-numbers', function(req, res) {
    var seals = req.body.sealNumbers
    var container = req.body.containerNumbers
    var item = {"container":container,"seals":seals}
    console.log("adding item")
    req.session.data.containerSealNumbers.push(item)
    if(req.session.data.goodsInContianers == "yes"){
    res.redirect(301, '/' + base_url + 'container-numbers/'+req.params[0]+'/container-seal-numbers-list');
    }else{
      res.redirect(301, '/' + base_url + 'container-numbers/'+req.params[0]+'/task-list');
    }
  })



  router.post('/' + base_url + "select-certifier/certifier/find", function(req, res) {
    console.log("In certifier/find.html");

    const certifierIndex = req.body.certifierIndex;
    console.log("certiferIndex: " + certifierIndex);

    req.session.data.person['certifier'] = certifierIndex;

  
    
    res.redirect(301, '/' + base_url + 'select-certifier/certifier');
  })

  router.post('/' + base_url + 'accessiblity/goods-certified-as*', function(req, res) {

    if (req.body.goods_certified_as) {
        res.redirect(301, '/' + base_url + 'end');
    } else {
      res.redirect(301, '/' + base_url + 'accessiblity/goods-certified-as'+req.params[0]+'?has_error=yes');
    }
  })
  router.post('/' + base_url + 'goods-certified-as/goods-certified-as*', function(req, res) {
    if (req.body.goods_certified_as && req.query.change != "yes") {
      res.redirect(301, '/' + base_url + 'goods-certified-as/task-list');
    }else if (req.body.goods_certified_as && req.query.change == "yes") {  
      res.redirect(301, '/' + base_url + 'goods-certified-as/check-your-answers');
    }else { 
      res.redirect(301, '/' + base_url + 'goods-certified-as/goods-certified-as' + req.params[0] + '?has_error=yes');
    }
  });
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
    console.log("This is being triggered in stories routes.js")
    if(req.body.country == "France" || req.body.country == "Denmark" || req.body.country == "Germany" || req.body.country == "Ireland" || req.body.country == "Northern Ireland"){
      res.redirect(301, '/' + base_url + 'unified-dashboard/'+req.params[0]+'/select-certificate');
    }
    res.redirect(301, '/' + base_url + 'unified-dashboard/'+req.params[0]+'/form-finder?destination_country='+req.body.country);
  })

  

  // GROSS WEIGHT STORY
  router.post('/' + base_url + 'update-weight/*/commodity', function(req, res) {
    let totalNetWeight = req.session.data.setNetWeight.reduce(function(a,b){
      return parseInt(a)+parseInt(b)
    })
    console.log("totalNetWeight="+totalNetWeight)
    console.log()
    if (req.session.data.setNetWeight[req.query.changeID] != req.body.netWeight){
      req.session.data.setNetWeight[req.query.changeID]=req.body.netWeight
      req.session.data.hasChangedNetWeight = "yes"
    }
    if (totalNetWeight >= req.body.GROSS_WEIGHT){
      req.session.data.netToGrossWeightIs="over"
    }else{
      req.session.data.netToGrossWeightIs="under"
    }
    req.session.data.setGrossWeight = req.body.GROSS_WEIGHT
    res.redirect(301, '/' + base_url + 'update-weight/'+req.params[0]+'/commodity-list');
  })

  router.post('/' + base_url + 'update-weight/*/commodity-list', function(req, res) {
    var totalNetWeight = req.session.data.setNetWeight.reduce(function(a,b){
      return parseInt(a)+parseInt(b)
    })
    if(req.body.addAnother == "yes"){
      res.redirect(301, '/' + base_url + 'update-weight/'+req.params[0]+'/not-in-prototype');
    }
    //total net weight is taken from the default session data : "setNetWeight": ["120","56"],
    if(req.session.data.hasChangedNetWeight != "yes"){
        // to mimic no change. 
        res.redirect(301, '/' + base_url + 'update-weight/'+req.params[0]+'/task-list');

    }else if(totalNetWeight > req.session.data.setGrossWeight){
      res.redirect(301, '/' + base_url + 'update-weight/'+req.params[0]+'/update-weight-must');
      req.session.data.changedWeightIs="higher"
    }else{
      req.session.data.changedWeightIs="lower"
      res.redirect(301, '/' + base_url + 'update-weight/'+req.params[0]+'/update-weight-question');
    }
  
  })

  router.post('/' + base_url + 'update-weight/*/weight', function(req, res) {
    var totalNetWeight = req.session.data.setNetWeight.reduce(function(a,b){
      return parseInt(a)+parseInt(b)
    })
    if(totalNetWeight > req.body.GROSS_WEIGHT ){

      res.redirect(301, '/' + base_url + 'update-weight/'+req.params[0]+'/weight?hasError=yes&errorType=over&change='+req.query.change);
      req.session.data.netToGrossWeightIs="over"
    }else{
      req.session.data.netToGrossWeightIs="under"
      if(req.query.change == "yes"){
        res.redirect(301, '/' + base_url + 'update-weight/'+req.params[0]+'/check-your-answers');
      }else{
        res.redirect(301, '/' + base_url + 'update-weight/'+req.params[0]+'/task-list');
      }
      
    }
  
  })

  router.post('/' + base_url + 'update-weight/*/check-your-answers', function(req, res) {
    var totalNetWeight = req.session.data.setNetWeight.reduce(function(a,b){
      return parseInt(a)+parseInt(b)
    })
    if(totalNetWeight > req.body.GROSS_WEIGHT ){

      res.redirect(301, '/' + base_url + 'update-weight/'+req.params[0]+'/check-your-answers?hasError=yes&errorType=over');
      req.session.data.netToGrossWeightIs="over"
    }else{
      req.session.data.netToGrossWeightIs="under"
      
        res.redirect(301, '/' + base_url + 'update-weight/'+req.params[0]+'/review');
    
      
    }
  
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

   router.post('/' + base_url + "transport/*/transport/added-transport", function(req, res) {
    console.log("In transport/arrival-and-departure");
    if (req.body['skip-question'] == 'yes') {
      req.session.data.transport['transportMethod'] = "skipped";
    } else if (req.body.addAnotherTransport != "no") {
      res.redirect(301, '/' + base_url + 'transport/'+req.params[0]+'/transport/select-transport');
    }

    if (req.session.data.return == "check-your-answers") {
      req.session.data.change=="no"
      res.redirect(301, '/' + base_url + 'transport/'+req.params[0]+'/check-your-answers');
    } else {
      res.redirect(301, '/' + base_url + 'transport/'+req.params[0]+'/task-list');
    }
  })
router.post('/' + base_url + 'transport/*/transport/transport-details', function(req, res) {
    if(req.query.change){
      req.session.data.transportList[req.query.id] = req.body
    }else{
        req.session.data.transportList.push(req.body);
    }

      res.redirect(301, '/' + base_url + 'transport/'+req.params[0]+'/transport/added-transport');
  })

  router.post('/' + base_url + 'transport/*/transport/transport-method-remove', function(req, res) {
    if(req.body.remove_document == "yes"){
      req.session.data.transportList.splice(req.query.id,1);
        res.redirect(301, '/' + base_url + 'transport/'+req.params[0]+'/transport/added-transport?removed=yes');
    }else{
      res.redirect(301, '/' + base_url + 'transport/'+req.params[0]+'/transport/added-transport');
    }
  })

  router.post('/' + base_url + "transport/*/transport/conditions", function(req, res) {
    console.log("In transport/conditions");
    if (req.body['skip-question'] == 'yes') {
      req.session.data.transport['transportConditions'] = "skipped";
    }

    if(req.body['skip-question'] != 'yes' &&  !req.body.trasnportConditions){
      res.redirect(301, '/' + base_url + 'transport/'+req.params[0]+'/transport/conditions?hasError=yes');
    }
    if (req.session.data.return == "check-your-answers") {
      req.session.data.change=="no"
      res.redirect(301, '/' + base_url + 'transport/'+req.params[0]+'/check-your-answers');
    } else {
      res.redirect(301, '/' + base_url + 'transport/'+req.params[0]+'/task-list');
    }
  })

}
