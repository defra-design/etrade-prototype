module.exports = function(router) {
  // Load helper functions


  // CHANGE VERSION each time you create a new version
  const base_url = "beta/v2-4/"

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
      req.session.data.currentCertID = req.session.data.addedEHC.length - 1;

      req.session.data.currentCommodityID = id;

    }
    res.redirect(301, '/' + base_url + 'application/export/how-to-add');
  })
  router.post('/' + base_url + 'application/export/how-to-add', function(req, res) {
    res.redirect(301, '/' + base_url + 'application/export/how-to-add?error=true');
  })

  router.post('/' + base_url + 'application/export/select-commodities', function(req, res) {
    // set the current commodity ID
    console.log("in router.post for select-commodities");
    req.session.data.currentCommodityID = req.body.commodityCode || 0
    req.session.data.commodityListID = req.session.data.currentCommodityID
    req.session.data.change = "";
    req.session.data.copy = "";

    // create an empty record for this identification to be stored in
    // need addedEHC[ certificate index ].addedCommodities[ commodity index ]
    let addedEhcCertificateIndex = req.session.data.currentCertID;
    console.log("addedEhcCertificateIndex: " + addedEhcCertificateIndex);

    let addedEHC = req.session.data.addedEHC;
    let isBrandNew = false;

    // check to see if there are any commodities in addedCommodities

    // get schema for this cert
    let cert = req.session.data.certificates[req.session.data.certificate];
    let cert_schema = cert.schema;
    let mock_data = {};

    for (let c = 0; c < cert_schema.length; c++) {
      console.log("Adding data: " + cert_schema[c].id);
      mock_data[cert_schema[c].id] = null;
    }
    mock_data['ehc'] = cert.number;
    mock_data['isIncomplete'] = true;
    mock_data['incomplete'] = [];

    function addCommodityAndIdentifications(certID, commodityID, identifications, ehcIndex) {
      console.log("In addCommodityAndIdentifications with params certID: " + certID + ", commodityID: " + commodityID + ", identifications: " + identifications + ", ehcIndex: " + ehcIndex);
      var commodityCode = req.session.data.certificates[certID].commodities[commodityID].code;
      var commodityTitle = req.session.data.certificates[certID].commodities[commodityID].title;

      // check to see if this commodity has already been added to this EHC
      // if it hasn't been added, create it and add identifications to it
      let arr = req.session.data.addedEHC[ehcIndex].addedCommodities;
      let obj = arr.find(o => o.code === commodityCode);

      if (obj) {
        // if it already exists, don't create another one - just add the identifications to the existing one
        // console.log("This commodity (" + commodityCode + ") already exists - adding " + identifications.length + " identifications to it");
        for (x = 0; x < identifications.length; x++) {
          obj.identifications.push(identifications[x]);
        }
      } else {
        // This commodity hasn't been added yet - adding now + identifications
        // console.log("This commodity (" + commodityCode + ") does not yet exist - creating it and adding " + identifications.length + " identifications to it");
        // commodity = {"code":commodityCode,"title":commodityTitle,"id":commodityID,"identifications":identifications};
        commodity = {"code":commodityCode,"title":commodityTitle,"id":commodityID,"identifications":[]};
        req.session.data.addedEHC[ehcIndex].addedCommodities.push(commodity);
        req.session.data.addedEHC[ehcIndex].addedCommodities[0].identifications.push(identifications);
      }
    }

    addCommodityAndIdentifications(req.session.data.certificate, req.body.commodityCode, mock_data, addedEhcCertificateIndex);

    let addedEHC_commodityIndex = getAddedEhcCommodityIndex(req.session.data.addedEHC, cert.number);
    console.log("addedEHC_commodityIndex: " + addedEHC_commodityIndex);

    // console.log("cert.commodities[" + req.body.commodityCode + "].code;")
    let commodityCode = cert.commodities[req.body.commodityCode].code;
    console.log("109 - commodityCode: " + commodityCode);

    let addedEHC_commodityListIndex = getAddedEhcCommodityListIndex(req.session.data.addedEHC, addedEHC_commodityIndex, commodityCode);
    console.log("addedEHC_commodityListIndex: " + addedEHC_commodityListIndex);

    let addedEHC_lastIndex = getAddedEhcLastIndex(req.session.data.addedEHC, addedEHC_commodityIndex, addedEHC_commodityListIndex);
    console.log("addedEHC_lastIndex: " + addedEHC_lastIndex);


    let querystring = "&new=yes";
    querystring += "&change=yes";
    querystring += "&currentCommodityID=" + addedEHC_commodityIndex;
    querystring += "&commodityListID=" + addedEHC_commodityListIndex;
    querystring += "&changeID=" + addedEHC_lastIndex;

    res.redirect(301, '/' + base_url + 'application/export/commodity?' + querystring);
  })

  function getAddedEhcCommodityIndex(addedEHC, ehcNumber) {
    console.log("In getAddedEhcCommodityIndex with ehcNumber: " + ehcNumber);
    let index = null;
    for (x = 0; x < addedEHC.length; x++) {
      if (addedEHC[x].number == ehcNumber) {
        console.log("Found a match in getAddedEhcCommodityIndex at index: " + x);
        index = x;
      }
    }
    return index;
  }

  function getAddedEhcCommodityListIndex(addedEHC, addedEHC_commodityIndex, commodityCode) {
    console.log("In getAddedEhcCommodityListIndex with commodityIndex: " + addedEHC_commodityIndex + ", commodityCode: " + commodityCode);
    let index = null;
    for (x = 0; x < addedEHC[addedEHC_commodityIndex].addedCommodities.length; x++) {
      if (addedEHC[addedEHC_commodityIndex].addedCommodities[x].code == commodityCode) {
        console.log("Found a match in getAddedEhcCommodityListIndex at index: " + x);
        index = x;
      }
    }
    return index;
  }

  function getAddedEhcLastIndex(addedEHC, addedEHC_commodityIndex, addedEHC_commodityListIndex) {
    console.log("In getAddedEhcLastIndex with addedEHC_commodityIndex: " + addedEHC_commodityIndex + ", addedEHC_commodityListIndex: " + addedEHC_commodityListIndex);
    return addedEHC[addedEHC_commodityIndex].addedCommodities[addedEHC_commodityListIndex].identifications.length - 1;
  }

  function getCommodityArray(cert, code) {
    var result;
    if (cert.length == 0) {
      return result
    }
    result = cert.find(x => x.code === code);
    return result
  }

  router.get('/' + base_url + 'application/export/commodity', function(req, res) {
    if (req.query.new == "yes" || req.query.copy == "yes") {
      console.log("This is a new/copied commodity");

      // do we have a changeID?
      if (req.query.changeID) {
        // leave it for now
        // TODO: make sure that copy works
      } else {
        // create a new identification based on the schema for this entry and then redirect with the correct changeID

        // load the schema for this EHC

        // add a new entry into addedCommodities ... identifications
      }


    } else {
      console.log("This is not new");
    }

    res.render(base_url + 'application/export/commodity');
  });

  router.post('/' + base_url + 'application/export/commodity', function(req, res) {

    let id = req.query.id || 0;
    console.log("id: " + id);
    // Get the current cert ID and commodity ID
    let certID = req.session.data.currentCertID || 0
    let commodityID = req.session.data.currentCommodityID || 0

    // to access this page directly with no EHC selected we need to create a generic EHC.
    if (req.session.data.addedEHC.length == 0) {
      console.log("Adding new ehc if not already existing")
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

      console.log("cert.addedCommodities[" + currentCommodityID + "].identifications[" + identificationID + "] = req.body");
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

  router.post('/' + base_url + 'application/find/results', function(req, res) {

    let certId = req.body.addedEHC_certId;
    let addedCommoditiesId = req.body.addedEHC_addedCommoditiesId;
    let identificationsId = req.body.addedEHC_identificationsId;
    let establishmentType = req.body.addedEHC_establishmentType;
    let establishmentIndex = parseInt(req.body.establishmentIndex);

    if (establishmentIndex) {
      console.log("We have an establishmentIndex");
      console.log("Getting identification data");
      console.log("req.session.data.addedEHC[" + certId + "].addedCommodities[" + addedCommoditiesId + "].identifications[" + identificationsId + "];");
      let identification = req.session.data.addedEHC[certId].addedCommodities[addedCommoditiesId].identifications[identificationsId];
      let establishment = req.session.data.establishments[establishmentIndex];

      // store the establishmentIndex
      identification[establishmentType+"-id"] = establishmentIndex;

      if (establishment.All_Activities.length == 1) {
        // select the index and redirect
        identification[establishmentType+"-activityId"] = 0;
        // http://localhost:3000/beta/v2-4/application/export/commodity?commodity=&change=yes&copy=&currentCommodityID=11&commodityListID=0&changeID=0
        res.redirect(301, '/' + base_url + 'application/export/commodity?change=yes&commodityListID=' + addedCommoditiesId + '&changeID=' + identificationsId);
      } else {
        // prompt the user to select an activity
        res.redirect(301, '/' + base_url + 'application/find/activity-select?certId=' + certId + '&addedCommoditiesId=' + addedCommoditiesId + '&identificationsId=' + identificationsId + '&establishmentType=' + establishmentType + '&establishmentIndex=' + establishmentIndex);
      }

    } else {
      console.log("No establishment selected");
      res.redirect(301, '/' + base_url + 'application/find/results?has_error=yes&error_type=blank');
    }


  })

  router.post('/' + base_url + 'application/find/activity-select', function(req, res) {
console.log(req.body);
    let certId = req.body.addedEHC_certID;
    let addedCommoditiesId = req.body.addedEHC_addedCommoditiesId;
    let identificationsId = req.body.addedEHC_identificationsId;
    let establishmentType = req.body.addedEHC_establishmentType;
    let establishmentIndex = req.body.addedEHC_establishmentIndex;
    let activityName = req.body.activityName;

    console.log("activityName: " + activityName);

    if (activityName) {
      // save the value
      console.log("Saving an activityName value of " + activityName);

      console.log("req.session.data.addedEHC[" + certId + "].addedCommodities[" + addedCommoditiesId + "].identifications[" + identificationsId + "];");
      let identification = req.session.data.addedEHC[certId].addedCommodities[addedCommoditiesId].identifications[identificationsId];
      identification[establishmentType+'Activity'] = activityName;

      // redirect
      // http://localhost:3000/beta/v2-4/application/export/commodity?commodity=&change=yes&copy=&currentCommodityID=111&commodityListID=2&changeID=0
      res.redirect(301, '/' + base_url + 'application/export/commodity?change=yes&commodityListID=' + addedCommoditiesId + '&changeID=' + identificationsId);
    } else {
        console.log("Missing required activityName radio button value");
        // ?certId=0&addedCommoditiesId=2&identificationsId=0&establishmentType=manufacturingPlant&establishmentIndex=40
        res.redirect(301, '/' + base_url + 'application/find/activity-select?certId=' + certId + '&identificationsId=' + identificationsId + '&establishmentType=' + establishmentType + '&establishmentIndex=' + establishmentIndex + '&has_error=yes');
    }

    // if yes, get the selected value
      // save the value
      // redirect


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
    req.session.data.additionalDocuments.push(req.body)
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
