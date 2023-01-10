module.exports = function(router) {
  // Load helper functions


  // CHANGE VERSION each time you create a new version
  const base_url = "experimental/"

  router.post('/' + base_url + 'add-commodities/export/select-certificates*', function(req, res) {
    let id=req.body.certificate || 0;
    let cert = req.session.data.certificates[id];
    //todo - check if its already selected
    // create a new array to hold the commodity data

    cert.addedCommodities = []
    // Add the cert to the array
    req.session.data.addedEHC.push(cert);
    //set the id of the current Certificate
    req.session.data.currentCertID =req.session.data.addedEHC.length-1
    res.redirect(301, '/' + base_url + 'add-commodities/export/how-to-add');
  })


  router.post('/' + base_url + 'add-commodities/', function(req, res) {
    let start = req.body.start_from
    // reset the session information
    res.redirect(301, '/' + base_url + 'add-commodities/'+start);
  })

  router.post('/' + base_url + 'add-commodities/export/commodity', function(req, res) {

    let id = req.query.id || 0;

    let certID = req.session.data.currentCertID || 0

    if(req.query.change){
      req.session.data.addedEHC[certID].addedCommodities[id] = req.body
    }
    else{
      req.session.data.addedEHC[certID].addedCommodities.unshift(req.body);
      req.session.data.addedCommodities.unshift(req.body);
    }
    res.redirect(301, '/' + base_url + 'add-commodities/export/'+req.session.data.listURL);
  })
  router.post('/' + base_url + 'add-commodities/export/weight', function(req, res) {
    let cert = req.session.data.currentCertID|| 0
    req.session.data.addedEHC[cert].weight = {"amount":req.body.GROSS_WEIGHT,"quantifier":req.body.GROSS_WEIGHT_quantifier }
    if(req.session.data.has_multiple_certificates == 'yes'){
      res.redirect(301, '/' + base_url + 'add-commodities/export/added-certs');
    }else{
      res.redirect(301, '/' + base_url + 'add-commodities/export/added-certs');
    }

  })
  router.post('/' + base_url + 'add-commodities/export/remove-commodity', function(req, res) {
    let currentCert = req.session.data.addedEHC[req.session.data.currentCertID]
    if(req.body.remove_commodity == "yes"){
      currentCert.addedCommodities.splice(req.query.id,1);
    }
    if(currentCert.addedCommodities.length >= 1){
      res.redirect(301, '/' + base_url + 'add-commodities/export/'+req.session.data.listURL);
    }else{
      res.redirect(301, '/' + base_url + 'add-commodities/export/how-to-add');

    }

  })
  router.post('/' + base_url + 'add-commodities/export/remove-certificate', function(req, res) {
    if(req.body.remove_certificate == "yes"){
      req.session.data.addedEHC.splice(req.query.id,1);
    }

    res.redirect(301, '/' + base_url + 'add-commodities/export/added-certs');
  })

  router.post('/' + base_url + 'attachments/uploads*', function(req, res) {
    console.log("This is was called in:" + base_url);req.session.data.additionalDocuments.push(req.body);
    // reset the session information
    res.redirect(301, '/' + base_url + 'attachments/added-documents');
  })

  router.post('/' + base_url + 'activity-select/consignee-selected*', function(req, res) {
    console.log(req.body.activity)
    if(req.body.activity ){
      res.redirect(301, '/' + base_url + 'activity-select/task-list');
    }else{
      res.redirect(301, '/' + base_url + 'activity-select/consignee-selected'+req.params[0]+'?hasError=yes');
    }

  })

  router.post('/' + base_url + 'attachments/remove-document', function(req, res) {
    if(req.body.remove_document == "yes"){
      req.session.data.additionalDocuments.splice(req.query.id,1);

        res.redirect(301, '/' + base_url + 'attachments/added-documents?removed=yes');

    }else{
      res.redirect(301, '/' + base_url + 'attachments/added-documents');
    }


  })

  router.post('/' + base_url + 'transport/transport-details', function(req, res) {
    if(req.query.change){
      req.session.data.transportList[req.query.id] = req.body
    }else{
        req.session.data.transportList.push(req.body);
    }

      res.redirect(301, '/' + base_url + 'transport/added-transport');
  })

  router.post('/' + base_url + 'transport/remove', function(req, res) {
    if(req.body.remove_document == "yes"){
      req.session.data.transportList.splice(req.query.id,1);
        res.redirect(301, '/' + base_url + 'transport/added-transport?removed=yes');
    }else{
      res.redirect(301, '/' + base_url + 'transport/added-transport');
    }


  })

  router.post('/' + base_url + 'transport-v2/transport-details', function(req, res) {
    if(req.query.change){
      req.session.data.transportList[req.query.id] = req.body
    }else{
        req.session.data.transportList.push(req.body);
    }

      res.redirect(301, '/' + base_url + 'transport-v2/added-transport');
  })

  router.post('/' + base_url + 'transport-v2/remove', function(req, res) {
    if(req.body.remove_document == "yes"){
      req.session.data.transportList.splice(req.query.id,1);
        res.redirect(301, '/' + base_url + 'transport-v2/added-transport?removed=yes');
    }else{
      res.redirect(301, '/' + base_url + 'transport-v2/added-transport');
    }


  })




}
