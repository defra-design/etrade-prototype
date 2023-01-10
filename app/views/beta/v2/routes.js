module.exports = function(router) {
  // Load helper functions


  // CHANGE VERSION each time you create a new version
  const base_url = "beta/v2/"

  router.post('/' + base_url + 'application/export/select-certificates*', function(req, res) {
    let id = req.body.certificate || 0;
    let cert = req.session.data.certificates[id];
    //todo - check if its already selected
    // create a new array to hold the commodity data
    cert.addedCommodities = []
    // Add the cert to the array
    req.session.data.addedEHC.push(cert);
    //set the id of the current Certificate
    req.session.data.currentCertID = req.session.data.addedEHC.length - 1
    res.redirect(301, '/' + base_url + 'application/export/how-to-add');
  })

  router.post('/' + base_url + 'application/export/select-commodities', function(req, res) {
    // set the current commodity ID
    req.session.data.currentCommodityID = req.body.commodityCode || 0


    res.redirect(301, '/' + base_url + 'application/export/commodity');
  })

  router.post('/' + base_url + 'application/export/commodity', function(req, res) {

    let id = req.query.id || 0;
    console.log("id: " + id);
    let certID = req.session.data.currentCertID || 0
    // to access this page directly with no EHC selected we need to create a generic EHC.
    if (req.session.data.addedEHC.length == 0) {
        let cert = req.session.data.certificates[id];
        cert.addedCommodities = []
        req.session.data.addedEHC.push(cert);
    }
    if (req.query.change) {
      req.session.data.addedEHC[certID].addedCommodities[id] = req.body
    } else {
      console.log("Adding body: " + JSON.stringify(req.body));
      console.log("certID is: " + certID);
      // console.log("addedEHC[certID] is: " + JSON.stringify(req.session.data.addedEHC[certID]));
      req.session.data.addedEHC[certID].addedCommodities.unshift(req.body);
      req.session.data.addedCommodities.unshift(req.body);
    }
    res.redirect(301, '/' + base_url + 'application/export/' + req.session.data.listURL);
  })

  router.post('/' + base_url + 'application/export/export/weight', function(req, res) {
    let cert = req.session.data.currentCertID || 0
    req.session.data.addedEHC[cert].weight = {
      "amount": req.body.GROSS_WEIGHT,
      "quantifier": req.body.GROSS_WEIGHT_quantifier
    }
    if (req.session.data.has_multiple_certificates == 'yes') {
      res.redirect(301, '/' + base_url + 'application/export/added-certs');
    } else {
      res.redirect(301, '/' + base_url + 'application/export/added-certs');
    }
  });

  router.post('/' + base_url + 'application/export/remove-commodity', function(req, res) {
    let currentCert = req.session.data.addedEHC[req.session.data.currentCertID]
    if (req.body.remove_commodity == "yes") {
      currentCert.addedCommodities.splice(req.query.id, 1);
    }
    if (currentCert.addedCommodities.length >= 1) {
      res.redirect(301, '/' + base_url + 'application/export/' + req.session.data.listURL);
    } else {
      res.redirect(301, '/' + base_url + 'application/export/how-to-add');

    }
  });


  router.post('/' + base_url + 'application/export/remove-certificate', function(req, res) {
    if (req.body.remove_certificate == "yes") {
      req.session.data.addedEHC.splice(req.query.id, 1);
    }

    res.redirect(301, '/' + base_url + 'application/export/added-certs');
  });

  router.post('/' + base_url + 'application/attachments/uploads*', function(req, res) {
    console.log("This is was called in:" + base_url);req.session.data.additionalDocuments.push(req.body);
    // reset the session information
    res.redirect(301, '/' + base_url + 'application/attachments/added-documents');
  });

  router.post('/' + base_url + 'application/attachments/remove-document', function(req, res) {
    if (req.body.remove_document == "yes") {
      req.session.data.additionalDocuments.splice(req.query.id, 1);
      res.redirect(301, '/' + base_url + 'application/attachments/added-documents?removed=yes');
    } else {
      res.redirect(301, '/' + base_url + 'application/attachments/added-documents');
    }
  })

  router.post('/' + base_url + 'application/goods/goods-certified-as*', function(req, res) {
    if (req.body.goods_certified_as) {
      res.redirect(301, '/' + base_url + 'application/task-list');
    } else {
      res.redirect(301, '/' + base_url + 'application/goods/goods-certified-as' + req.params[0] + '?has_error=yes');
    }
  });

  router.post('/' + base_url + 'application/create-reference', function(req, res) {
    if (req.body.UserReference == "") {
      res.redirect(301, '/' + base_url + 'application/create-reference?has_error=yes&error_type=empty');
    }
    if (req.body.UserReference.length > 20) {
      res.redirect(301, '/' + base_url + 'application/create-reference?has_error=yes&error_type=length');
    }
    if (req.query.change == "yes") {
      res.redirect(301, '/' + base_url + 'application/task-list');
    } else {
      res.redirect(301, '/' + base_url + 'application/export/select-certificates');
    }
  });


}
