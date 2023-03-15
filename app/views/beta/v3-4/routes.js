module.exports = function(router) {
  // Load helper functions
  const writeXlsxFile = require('write-excel-file/node');

  // CHANGE VERSION each time you create a new version
  const base_url = "beta/v3-4/"

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

    // temporarily removing CDU journey
    /*
    if (req.session.data.hasSeenCduInterstitial) {
      res.redirect(301, '/' + base_url + 'application/export/how-to-add');
    } else {
      req.session.data.hasSeenCduInterstitial = true;
      res.redirect(301, '/' + base_url + 'application/export/cdu-interstitial');
    }
    */
    res.redirect(301, '/' + base_url + 'application/task-list');

  })

  router.post('/' + base_url + 'application/export/cdu-interstitial', function(req, res) {
    res.redirect(301, '/' + base_url + 'application/export/how-to-add');
  })

  router.post('/' + base_url + 'application/export/how-to-add', function(req, res) {
    res.redirect(301, '/' + base_url + 'application/export/how-to-add?error=true');
  })


   //used setting the EHC when skipping the certificate selection page
  router.get('/' + base_url + 'application/export/set-certificate', function(req, res) {
    let cn = "EHC"+ (req.query.ehc || "8530");
    var id = 0
    //set a default certificate
    var cert = req.session.data.certificates[0]
    // find certtificate based on EHC number
    let obj = req.session.data.certificates.find((o, i) => {
      if(o.number == cn ){
        cert = o
        id=i
      }
    });
    console.log("SETTING EHC of "+cn)
    console.log("cert="+cert.number)
    console.log("id="+id)

    if (!isAlreadyAdded(req.session.data.addedEHC, cert.number)) {
      // create a new array to hold the commodity data
      cert.addedCommodities = []
      // Add the cert to the array
      req.session.data.addedEHC.push(cert);
      //set the id of the current Certificate
      req.session.data.currentCertID = req.session.data.addedEHC.length - 1;

      req.session.data.currentCommodityID = id;
      req.session.data.certificate = id
    }

    // temporarily removing CDU journey
    /*
    if (req.session.data.hasSeenCduInterstitial) {
      res.redirect(301, '/' + base_url + 'application/export/how-to-add');
    } else {
      req.session.data.hasSeenCduInterstitial = true;
      res.redirect(301, '/' + base_url + 'application/export/cdu-interstitial');
    }
    */
    let page = req.query.url || "export/select-commodities";
    res.redirect(301, '/' + base_url + 'application/'+page);

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

    let cert = req.session.data.certificates[req.session.data.certificate];

    // get schema for this cert
    let cert_schema = getSchemaFromEhcNumber(req.session.data.certificates, cert.number);
    let mock_data = createMockDataFromSchema(cert_schema, cert.number);

    function addCommodityAndIdentifications(certID, commodityID, identifications, ehcIndex) {
      console.log("In addCommodityAndIdentifications with params certID: " + certID + ", commodityID: " + commodityID + ", identifications: " + identifications + ", ehcIndex: " + ehcIndex);

      var commodityCode = req.session.data.certificates[certID].commodities[commodityID].code;
      var commodityTitle = req.session.data.certificates[certID].commodities[commodityID].title;

      // check to see if this commodity has already been added to this EHC
      // if it hasn't been added, create it and add identifications to it
      let arr = req.session.data.addedEHC[ehcIndex].addedCommodities;
      let obj = arr.find(o => o.code === commodityCode);

      console.log(obj);

      if (obj) {
        console.log("obj already exists");
        console.log("identifications");
        console.log(identifications);
        obj.identifications.push(identifications);
        // if it already exists, don't create another one - just add the identifications to the existing one
        /*
        for (x = 0; x < identifications.length; x++) {
          obj.identifications.push(identifications[x]);
        }*/
      } else {
        console.log("obj does not exist");

        // This commodity hasn't been added yet - adding now + identifications
        commodity = {"code":commodityCode,"title":commodityTitle,"id":commodityID,"identifications":[]};
        // step 1 - add the commodity core data
        req.session.data.addedEHC[ehcIndex].addedCommodities.push(commodity);
        // step 2 - add the first identification
        let lastIndex = req.session.data.addedEHC[ehcIndex].addedCommodities.length - 1;
        req.session.data.addedEHC[ehcIndex].addedCommodities[lastIndex].identifications.push(identifications);
      }
    }

    addCommodityAndIdentifications(req.session.data.certificate, req.body.commodityCode, mock_data, addedEhcCertificateIndex);

    let commodityCode = cert.commodities[req.body.commodityCode].code;
    let querystring = createCommoditiesQuerystring(req.session.data.addedEHC, cert.number, commodityCode);

    res.redirect(301, '/' + base_url + 'application/export/commodity?' + querystring + '&change=no');
  })



  function createCommoditiesQuerystring(addedEHC, ehcNumber, commodityCode) {
    let addedEHC_commodityIndex = getAddedEhcCommodityIndex(addedEHC, ehcNumber);
    // console.log("addedEHC_commodityIndex: " + addedEHC_commodityIndex);

    let addedEHC_commodityListIndex = getAddedEhcCommodityListIndex(addedEHC, addedEHC_commodityIndex, commodityCode);
    // console.log("addedEHC_commodityListIndex: " + addedEHC_commodityListIndex);

    let addedEHC_lastIndex = getAddedEhcLastIndex(addedEHC, addedEHC_commodityIndex, addedEHC_commodityListIndex);
    // console.log("addedEHC_lastIndex: " + addedEHC_lastIndex);


    let querystring = "&new=yes";
    querystring += "&change=yes";
    querystring += "&currentCommodityID=" + addedEHC_commodityIndex;
    querystring += "&commodityListID=" + addedEHC_commodityListIndex;
    querystring += "&changeID=" + addedEHC_lastIndex;
    console.log("Returning querystring: " + querystring);

    return querystring;
  }

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

  function getSchemaFromEhcNumber(certs, ehcNumber) {
    console.log("In getSchemaFromEhcNumber with certs.length: " + certs.length + " and ehcNumber: " + ehcNumber);
    let schema = [];
    for (x = 0; x < certs.length; x++) {
      if (certs[x].number == ehcNumber) {
        schema = certs[x].schema;
      }
    }
    return schema;
  }

  function createMockDataFromSchema(schema, ehcNumber) {
    console.log("In createMockDataFromSchema");
    let mock = {};

    for (let x = 0; x < schema.length; x++) {
      mock[schema[x].id] = null;
    }
    mock['ehc'] = ehcNumber;
    mock['isIncomplete'] = true;
    mock['incomplete'] = [];

    return mock;
  }

  router.get('/' + base_url + 'application/export/add-new-record', function(req, res) {
    if (req.query.currentCommodityID  && req.query.commodityCode && req.query.ehcNumber) {

      console.log("Creating a new record");
      let currentCommodityID = req.query.currentCommodityID;
      let commodityCode = req.query.commodityCode;
      let ehcNumber = req.query.ehcNumber;

      // create a new identification based on the supplied data
      // load the schema for this EHC
      let certs = req.session.data.certificates;
      let schema = getSchemaFromEhcNumber(certs, ehcNumber);

      // create mock data based on schema
      let mock_data = createMockDataFromSchema(schema, ehcNumber);

      // append this mock identification to the existing identifications array for this commodity
      let ehcIndex = getAddedEhcCommodityIndex(req.session.data.addedEHC, ehcNumber);
      let arr = req.session.data.addedEHC[ehcIndex].addedCommodities;
      console.log("Incoming array of addedCommodities");
      console.log(arr);
      let obj = arr.find(o => o.code === commodityCode);
      obj.identifications.push(mock_data);

      // redirect to commodity for manual data entry
      console.log("It worked. Redirect");
      let querystring = createCommoditiesQuerystring(req.session.data.addedEHC, ehcNumber, commodityCode);
      console.log("querystring");
      console.log(" -----------------------------------------");
      res.redirect(303, '/' + base_url + 'application/export/commodity?' + querystring);

    } else {
      console.log("Missing key information");
      res.render(base_url + 'application/export/added-commodities-list');
    }

  });

  router.get('/' + base_url + 'application/export/copy-record', function(req, res) {
    console.log("Copying a record");

    let currentCommodityID = req.query.currentCommodityID;
    let commodityListID = req.query.commodityListID;
    let changeID = req.query.changeID;
    let addedEHC = req.session.data.addedEHC;
    let ehcNumber = req.query.ehcNumber;
    let ehcIndex = getAddedEhcCommodityIndex(addedEHC, ehcNumber);

    // create a new identification based on the content of the copied record
    console.log("addedEHC[" + ehcIndex + "].addedCommodities[" + commodityListID + "].identifications[" + changeID + "];");
    let identification = addedEHC[ehcIndex].addedCommodities[commodityListID].identifications[changeID];
    let commodityCode = identification.commodity_code;

    // append the new identification to the existing identifications array for this commodity
    addedEHC[ehcIndex].addedCommodities[commodityListID].identifications.push(identification);

    // redirect to commodity
    let querystring = createCommoditiesQuerystring(addedEHC, ehcNumber, commodityCode);
    res.redirect(303, '/' + base_url + 'application/export/commodity?' + querystring + '&copy=yes');

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
    console.log("Skipped: "+req.body["skip-question"])
    if((req.body.netWeight =="" || req.body.packageCount =="" ) && req.body["skip-question"] ==  "_unchecked"){
      res.redirect(301, '/' + base_url + 'application/export/commodity?hasError=yes');
    }
    //If change is active dont add the certificate just update it.
    if (req.session.data.change) {
      console.log("Changing cert")
      var currentCommodityID = req.session.data.commodityListID || 0
      var identificationID = req.session.data.changeID || 0

      console.log("cert.addedCommodities[" + currentCommodityID + "].identifications[" + identificationID + "] = req.body");

      // cert.addedCommodities[currentCommodityID].identifications[identificationID] = req.body;
      cert.addedCommodities[currentCommodityID].identifications[identificationID] = writeBodyDataToSchema(cert.schema, req.body);

      if (req.query.new) {
        res.redirect(301, '/' + base_url + 'application/export/added-commodities-list?changed=yes&showAlert=yes&new=yes');
      } else {
        res.redirect(301, '/' + base_url + 'application/export/added-commodities-list?changed=yes&showAlert=yes');
      }

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

        // commodity.identifications.push(req.body);
        commodity.identifications.push(writeBodyDataToSchema(cert.schema, req.body));

        addedCommodities.push(commodity)
        req.session.data.currentIdenticiationID=0
      }
      res.redirect(301, '/' + base_url + 'application/export/added-commodities-list?new=yes');

    }


  })

    router.post('/' + base_url + 'application/transport/transport-details', function(req, res) {
    if(req.query.change){
      req.session.data.transportList[req.query.id] = req.body
    }else{
        req.session.data.transportList.push(req.body);
    }

      res.redirect(301, '/' + base_url + 'application/transport/added-transport');
  })

  router.post('/' + base_url + 'application/transport/transport-method-remove', function(req, res) {
    if(req.body.remove_document == "yes"){
      req.session.data.transportList.splice(req.query.id,1);
        res.redirect(301, '/' + base_url + 'application/transport/added-transport?removed=yes');
    }else{
      res.redirect(301, '/' + base_url + 'application/transport/added-transport');
    }
  })


  function writeBodyDataToSchema(schema, body) {
    console.log("Writing data based on schema");
    /*
    console.log(schema);
    console.log("------");
    console.log(body);
    console.log("------");
    */
    let data = {};
    data['incomplete'] = [];
    data['isIncomplete'] = false;
    for (let x = 0; x < schema.length; x++) {
      // console.log(schema[x]);
      if (body[schema[x].id]) {
        data[schema[x].id] = body[schema[x].id];
      } else {
        data[schema[x].id] = null;
      }

      if ((schema[x].required == "yes") && (!body[schema[x].id])) {
        data['incomplete'].push(schema[x].id);
        data['isIncomplete'] = true;
      }

      // support search type (establishments)
      if (schema[x].type == "search") {
        console.log("Schema type is search: " + schema[x].id);
        // in addition to the main item, also look for its companion (e.g. manufacturingPlantActivity)
        // data[schema[x].id+'-id'] = body[schema[x].id+'-id'];
        data[schema[x].id+'Activity'] = body[schema[x].id+'Activity'];
      }
    }

    // console.log(data);
    return data;
  }

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

      // store the establishment approval number
      identification[establishmentType] = establishment.AppNo;

      // remove this establishment type from the incomplete array (if present)
      if (identification.incomplete) {
        for (let x = 0; x < identification.incomplete.length; x++) {
          if (identification.incomplete[x] == establishmentType) {
            console.log("Deleting identification.incomplete at index: " + x);
            // delete identification.incomplete[x]; // don't use this as it leaves a null rather than removing the item completely
            identification.incomplete.splice(x, 1);
          }
        }
       } else {
         identification.incomplete = [];
       }


      if (establishment.All_Activities.length == 1) {
        // select the index and redirect
        identification[establishmentType+"Activity"] = establishment.All_Activities[0];


        // remove the establishmentTypeActivity from identification.incomplete and check to see if is incomplete needs to be set to false
        console.log("Attempting to remove this establishment from incomplete")
        for (let x = 0; x < identification.incomplete.length; x++) {
          console.log(identification.incomplete[x] + " -- " + establishmentType+"Activity");
          if (identification.incomplete[x] == (establishmentType+"Activity")) {
            console.log("Deleting identification.incomplete at index: " + x);
            identification.incomplete.splice(x, 1);
          }
        }

        // check to see if isIncomplete is correct
        console.log("Checking isIncomplete status")
        if (!identification.incomplete || (identification.incomplete.length == 0)) {
          identification.isIncomplete = false;
        }

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
    console.log("In router.post for .../activity-select with req.body: " + req.body);
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
      console.log(identification);

      if (activityName == -1) {
        // if this activity isn't already in the incomplete array, add it
        console.log("User skipped this question, so this item is incomplete");

        if (!identification.incomplete) {
          identification.incomplete = [];
        }

        let isInArray = false;
        for (x = 0; x < identification.incomplete.length; x++) {
          console.log(identification.incomplete[x] + " -- " + establishmentType+"Activity");
          if (identification.incomplete[x] == establishmentType+"Activity") {
            console.log("This item has already been flagged as incomplete");
            isInArray = true;
          }
        }
        if (!isInArray) {
          console.log("Pushing " + establishmentType + "Activity into identification.incomplete");
          identification.incomplete.push(establishmentType+"Activity");
        }


        // set isIncomplete to true
        identification.isIncomplete = true
      } else {
        // remove this establishment type from the incomplete array (if present)
        console.log("Attempting to remove this establishment from incomplete")
        for (let x = 0; x < identification.incomplete.length; x++) {
          console.log(identification.incomplete[x] + " -- " + establishmentType);
          if (identification.incomplete[x] == (establishmentType+"Activity")) {
            console.log("Deleting identification.incomplete at index: " + x);
            identification.incomplete.splice(x, 1);
          }
        }

        // check to see if isIncomplete is correct
        console.log("Checking isIncomplete status")
        if (!identification.incomplete || (identification.incomplete.length == 0)) {
          identification.isIncomplete = false;
        }

      }




      // redirect
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

  // this is a virtual page - it doesn't really exist, it just serves as an action for removing an establishment
  router.get('/' + base_url + 'application/find/remove-establishment', function(req, res) {
    console.log("In post for find/remove-establishment");

    // which establishment type?
    // which commodity?
    let certID = req.query.certID;
    let commodityListID = req.query.commodityListID;
    let changeID = req.query.changeID;
    let establishmentType = req.query.establishmentType;

    let identification = req.session.data.addedEHC[certID].addedCommodities[commodityListID].identifications[changeID];
    console.log(identification);

    identification[establishmentType] = null;
    identification[establishmentType+'Activity'] = null;

    res.redirect(301, '/' + base_url + 'application/export/commodity?change=yes&commodityListID=' + commodityListID + '&changeID=' + changeID);

  })

  // router.post('/' + base_url + 'application/export/weight', function(req, res) {
  //   console.log("In post for application/export/weight");
  //   let cert = req.session.data.currentCertID || 0
  //   req.session.data.addedEHC[cert].weight = {
  //     "amount": req.body.GROSS_WEIGHT,
  //     "quantifier": req.body.GROSS_WEIGHT_quantifier
  //   }

  //   res.redirect(301, '/' + base_url + 'application/task-list');
  // });

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
    if (req.body.goods_certified_as && req.query.change != "yes") {
      res.redirect(301, '/' + base_url + 'application/task-list');
    }else if (req.body.goods_certified_as && req.query.change == "yes") {  
      res.redirect(301, '/' + base_url + 'application/check-your-answers');
    }else { 
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
      res.redirect(301, '/' + base_url + 'application/export/select-certificates?displayMax=10');
    }
  });

  router.get('/' + base_url + 'application/export/download/generate-data-spreadsheet', function(req, res) {
    console.log("In routes.js for generate-data-spreadsheet");
    // every time this page loads, we generate a spreadsheet for download
    // this is inefficient and possibly causes problems in a multi-user environment
    // but hopefully this is reliable enough for now

      // TODO: add each row of data, for now, ignoring data type
        // TODO: highlight incompletes


    let certID = req.session.data.currentCertID || 0;
    let addedEHC = req.session.data.addedEHC[0];

    if (addedEHC) {
      console.log("We have data at addedEHC[0]")

      let ehcString = addedEHC.number;
      console.log("ehcString: " + ehcString);
      let ehcNumber = ehcString.substring(3,7); // e.g. 8361
      console.log("ehcNumber: " + ehcNumber);
      let ehcNumberWithHyphen = "EHC-" + ehcNumber;
      console.log("ehcNumberWithHyphen: " + ehcNumberWithHyphen);
      let ehcTitle = addedEHC.title;
      let filename = ehcString + "-data-template.xlsx";

      // console.log(ehcNumber + " -- " + ehcTitle);

      let ehcSchema = addedEHC.schema;
      let requiredHeading = [];
      let columnHeading = [];

      // populate values for required/optional and column title columns
      for (let x = 0; x < ehcSchema.length; x++) {
        if (ehcSchema[x].required == "yes") {
          requiredHeading.push("Required");
        } else {
          requiredHeading.push("Optional");
        }
        columnHeading.push(ehcSchema[x].title);
      }

      let excelRequiredRow = [];
      for (let x = 0; x < requiredHeading.length; x++) {
        let row = {};
        row['value'] = requiredHeading[x];
        row['backgroundColor'] = '#EEEBE2';
        if (requiredHeading[x] == "Required") {
          row['fontWeight'] = 'bold';
          row['color'] = '#FF0000';
        } else {
          row['fontStyle'] = 'italic';
          row['color'] = '#000000';
        }
        row['width'] = 100;

        excelRequiredRow.push(row);
      }

      let excelHeaderRow = [];
      for (let x = 0; x < columnHeading.length; x++) {
        let row = {};
        row['value'] = columnHeading[x];
        row['fontWeight'] = 'bold';
        row['color'] = '#FFFFFF';
        row['backgroundColor'] = '#000000';
        excelHeaderRow.push(row);
      }

      let excelDataRows = [];

      // for every item within the addedCommodities array
      for (let x = 0; x < addedEHC.addedCommodities.length; x++) {

        // for every item within the addedCommodities[x].identifications array
        for (let y = 0; y < addedEHC.addedCommodities[x].identifications.length; y++) {

          let row = [];
          // console.log("Starting a new row");

          // for every item within the schema
          for (let z = 0; z < ehcSchema.length; z++) {

            // store a row with cells that match the schema --> don't just add everything in the identification because there is junk in there
            let cell = {};
            // console.log("Adding a cell with the value: " + addedEHC.addedCommodities[x].identifications[y][ehcSchema[z].id]);

            // handle multiples that may enter as arrays
            if (ehcSchema[z].multiple == "yes") {

              if (addedEHC.addedCommodities[x].identifications[y][ehcSchema[z].id] === null) {
                cell['value'] = "";
              } else {
                cell['value'] = addedEHC.addedCommodities[x].identifications[y][ehcSchema[z].id].toString();
              }

            } else {
              cell['value'] = addedEHC.addedCommodities[x].identifications[y][ehcSchema[z].id];
            }

            if (ehcSchema[z].type == "decimal") {
              cell['type'] = Number;

              cell['value'] = Number(addedEHC.addedCommodities[x].identifications[y][ehcSchema[z].id]);
            } else {
              cell['type'] = String;
            }

            row.push(cell);
          }

          // console.log("Adding row to excelDataRows");
          // console.log(row);

          excelDataRows.push(row);
        }

      }

      // add header rows
      excelDataRows.unshift(excelHeaderRow);
      excelDataRows.unshift(excelRequiredRow);

      // add 6 row placeholder for image and EHC name/title
      let specialHeaderRow = [
        {
          value: '',
          rowSpan: 6,
        },
        {
          value: ehcNumberWithHyphen + ": " + ehcTitle,
          rowSpan: 6,
          span: ehcSchema.length -1,
          fontWeight: 'bold',
          alignVertical: 'center',
          wrap: true
        }
      ]
      let specialHeaderRow2 = [ null, null ];
      let specialHeaderRow3 = [ null, null ];
      let specialHeaderRow4 = [ null, null ];
      let specialHeaderRow5 = [ null, null ];
      let specialHeaderRow6 = [ null, null ];


      excelDataRows.unshift(specialHeaderRow6);
      excelDataRows.unshift(specialHeaderRow5);
      excelDataRows.unshift(specialHeaderRow4);
      excelDataRows.unshift(specialHeaderRow3);

      excelDataRows.unshift(specialHeaderRow2);
      excelDataRows.unshift(specialHeaderRow);

      let excelFilePath = './public/data/uploads/excel.xlsx';
      let writeFilePath = './public/data/uploads/' + filename;

      writeXlsxFile(excelDataRows, {
        filePath: writeFilePath
      })
      console.log("Passed writing excelData to " + writeFilePath);

      // res.download(excelFilePath);
      /*
      res.download(excelFilePath, 'spreadsheet.xlsx', function(err){
        if (err) {
          console.log("Error : " + err);
        } else {
          console.log("No errors");
        }

      });
      */
      // console.log(excelData);
      res.redirect(307, '/' + base_url + 'application/export/download/download-data-spreadsheet.html');

    } else {
      console.log("No commodity data available");
    }


  });




}
