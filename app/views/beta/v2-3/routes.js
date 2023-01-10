module.exports = function(router) {
  // Load helper functions


  // CHANGE VERSION each time you create a new version
  const base_url = "beta/v2-3/"

  function isAlreadyAdded(a, v) {
    let r = a.find(element => {
      if (element.number === v) {

        return true;
      }
      return false;
    });
    return r
  }

  router.post('/' + base_url + 'application/export/select-certificates*', function(req, res) {
    let id = req.body.certificate || 0;
    let cert = req.session.data.certificates[id];


    // check if its already selected



    if (!isAlreadyAdded(req.session.data.addedEHC, cert.number)) {
      // create a new array to hold the commodity data
      cert.addedCommodities = []
      // Add the cert to the array
      req.session.data.addedEHC.push(cert);
      //set the id of the current Certificate
      req.session.data.currentCertID = req.session.data.addedEHC.length - 1

    }
    res.redirect(301, '/' + base_url + 'application/export/how-to-add');
  })
  router.post('/' + base_url + 'application/export/how-to-add', function(req, res) {
    res.redirect(301, '/' + base_url + 'application/export/how-to-add?error=true');
  })

  router.post('/' + base_url + 'application/export/select-commodities', function(req, res) {
    // set the current commodity ID


    req.session.data.currentCommodityID = req.body.commodityCode || 0
    req.session.data.commodityListID = req.session.data.currentCommodityID
    req.session.data.change = "";
    req.session.data.copy = "";
    res.redirect(301, '/' + base_url + 'application/export/commodity');
  })

  function getCommodityArray(cert, code) {
    var result;
    if (cert.length == 0) {
      return result
    }
    result = cert.find(x => x.code === code);
    return result
  }

  router.post('/' + base_url + 'application/export/commodity', function(req, res) {

    let id = req.query.id || 0;
    console.log("id: " + id);
    // Get the current cert ID and commodity ID
    let certID = req.session.data.currentCertID || 0
    let commodityID = req.session.data.currentCommodityID || 0

    // to access this page directly with no EHC selected we need to create a generic EHC.
    if (req.session.data.addedEHC.length == 0) {
      console.log("Adding new ehc if not alaready existing")
      var newCert = req.session.data.certificates[0]
      newCert.addedCommodities = []
      req.session.data.addedEHC.push(newCert);
    }
    let cert = req.session.data.addedEHC[certID]
    //If change is active dont add the certificate just update it.
    if (req.session.data.change) {
      console.log("Changing cert")
      var currentCommodityID = req.session.data.commodityListID || 0
      var identificationID = req.session.data.changeID || 0
      cert.addedCommodities[currentCommodityID].identifications[identificationID] = req.body
      res.redirect(301, '/' + base_url + 'application/export/added-commodities-list?changed=yes&showAlert=yes');
    } else {
      var addedCommodities = cert.addedCommodities
      var commodityCode = cert.commodities[commodityID].code
      var commodityTitle = cert.commodities[commodityID].title
      var currentCommodity = getCommodityArray(addedCommodities, commodityCode)
      if (currentCommodity) {
        console.log("adding to existing commodity")
        currentCommodity.identifications.push(req.body);
        req.session.data.currentIdenticiationID=currentCommodity.identifications.length-1
      } else {
        // create new commoditity object
        console.log("Adding new commodity")
        let commodity = {
          "code": commodityCode,
          "title": commodityTitle,
          "id": req.session.data.currentCommodityID,
          "identifications": []
        }

        commodity.identifications.push(req.body);
        addedCommodities.push(commodity)
        req.session.data.currentIdenticiationID=0
      }
      res.redirect(301, '/' + base_url + 'application/export/added-commodities-list?new=yes');

    }


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
      currentCert.addedCommodities[req.query.removeCommodityID].identifications.splice(req.query.removeID, 1);
    }
    // remove commodity if no identifications
    if (currentCert.addedCommodities[req.query.removeCommodityID].identifications.length < 1) {
      currentCert.addedCommodities.splice(req.query.removeCommodityID, 1);
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
