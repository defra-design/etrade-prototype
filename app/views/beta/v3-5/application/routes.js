module.exports = function(router) {
  // Load helper functions

  // CHANGE VERSION each time you create a new version
  const base_url = "beta/v3-5/application/";

  router.post('/' + base_url + "persons/consignee/find", function(req, res) {
    console.log("In consignee/find.html");

    const establishmentIndex = req.body.establishmentIndex;

    req.session.data.person['consignee'] = establishmentIndex;
    res.redirect(301, '/' + base_url + 'persons/consignee-or-importer');
  })

  router.post('/' + base_url + "persons/consignor/find", function(req, res) {
    console.log("In consignor/find.html");

    const establishmentIndex = req.body.establishmentIndex;
    const country = req.body.country;

    if (establishmentIndex) {
      req.session.data.person['exporter'] = establishmentIndex
      // check out same file for adding adding to address book. 
      // check if the establishment has multiple activities
      if (req.session.data.establishments[establishmentIndex].All_Activities.length == 1) {

        req.session.data.person['consignorActivity'] = 0;
        res.redirect(301, '/' + base_url + 'persons/consignor-or-exporter');
      } else {
        res.redirect(301, '/' + base_url + 'persons/consignor/activity?establishmentIndex=' + establishmentIndex);
      }
    } else {
      res.redirect(301, '/' + base_url + 'persons/consignor/find?hasError=true&country=' + country);
    }
  })

  router.post('/' + base_url + "persons/consignee/search", function(req, res) {
    console.log("In consignor/search.html");

    const establishmentIndex = req.body.establishmentIndex;

    req.session.data.person['consignor'] = establishmentIndex;
    res.redirect(301, '/' + base_url + 'persons/consignor-or-exporter');
  })


  router.post('/' + base_url + "persons/consignor/default", function(req, res) {
    console.log("In consignor/default.html");

    const defaultConsignor = req.body['default-consignor'];

    if (defaultConsignor) {
      res.redirect(301, '/' + base_url + 'persons/consignor-or-exporter');
    } else {
      res.redirect(301, '/' + base_url + 'persons/consignor/default?hasError=true');
    }

  })

  router.post('/' + base_url + "persons/consignor/activity", function(req, res) {
    console.log("In consignor/activity.html");

    const consignorActivity = req.body.activityIndex;
    const establishmentIndex = req.body.establishmentIndex;

    if (consignorActivity) {
      req.session.data.person['consignorActivity'] = consignorActivity;
      res.redirect(301, '/' + base_url + 'persons/consignor-or-exporter');
    } else {
      res.redirect(301, '/' + base_url + 'persons/consignor/activity?hasError=true&establishmentIndex=' + establishmentIndex);
    }

  })

  router.post('/' + base_url + "persons/certifier/find", function(req, res) {
    console.log("In certifier/find.html");

    const certifierIndex = req.body.certifierIndex;
    console.log("certiferIndex: " + certifierIndex);

    req.session.data.person['certifier'] = certifierIndex;



    res.redirect(301, '/' + base_url + 'persons/certifier');
  })

  router.post('/' + base_url + "persons/load/find", function(req, res) {
    console.log("In load/find.html");

    const establishmentIndex = req.body.establishmentIndex;

    req.session.data.person['load'] = establishmentIndex;
    res.redirect(301, '/' + base_url + 'persons/load');
  })

  router.post('/' + base_url + "transport/place-of-destination/find", function(req, res) {
    console.log("In place-of-destination/find.html");

    const establishmentIndex = req.body.establishmentIndex;

    console.log("Storing req.session.data.transport['destination'] with value " + establishmentIndex);

    req.session.data.transport['destination'] = establishmentIndex;
    res.redirect(301, '/' + base_url + 'transport/place-of-destination');
  })

  router.post('/' + base_url + 'goods/place-of-origin', function(req, res) {
    console.log("In goods/place-of-origin");

    let country = req.body.country;
    // let roo = req.body.regionOfOrigin;
    // let sroo = req.body.subRegionOfOrigin;

    // console.log("Saving goods data " + country + ", " + roo + ", " + sroo);

    req.session.data.goods['country'] = country;
    // req.session.data.goods['region-of-origin'] = roo;
    // req.session.data.goods['sub-region-of-origin'] = sroo;

    if (req.query.change == "yes") {
      res.redirect(301, '/' + base_url + 'check-your-answers');
    } else {
      res.redirect(301, '/' + base_url + 'task-list');
    }
  })



  router.get('/' + base_url + 'persons/remove', function(req, res) {
    const person = req.query.who;
    console.log("Person is: " + person);
    const redirect = req.query.redirect;

    delete req.session.data.person[person];
    res.redirect(301, '/' + base_url + "persons/" + redirect + "?deleted=yes&who=" + person);
  })

  router.get('/' + base_url + 'transport/remove', function(req, res) {
    const person = req.query.who;
    const redirect = req.query.redirect;

    delete req.session.data.transport[person];
    res.redirect(301, '/' + base_url + "transport/" + redirect + "?deleted=yes&who=" + person);
  })

  // Original
  // router.post('/' + base_url + "transport/arrival-and-departure", function(req, res) {
  //   console.log("In transport/arrival-and-departure");

  //   if (req.body['skip-question'] == 'yes') {
  //     req.session.data.transport['arrival-and-departure'] = "skipped";
  //   }

  //   if(req.query.change == "yes"){
  //       res.redirect(301, '/' + base_url + 'check-your-answers');
  //   }else{
  //       res.redirect(301, '/' + base_url + 'task-list');
  //   }
  // })

  router.post('/' + base_url + "transport/arrival-and-departure", function(req, res) {
    console.log("In transport/arrival-and-departure");

    if (req.body['skip-question'] == 'yes') {
      req.session.data.transport['departure'] = "skipped";
    }

    if (req.query.change == "yes") {
      res.redirect(301, '/' + base_url + 'check-your-answers');
    } else {

      // res.redirect(301, '/' + base_url + 'transport/arrival');
      res.redirect(301, '/' + base_url + 'task-list');
    }
  })
  router.post('/' + base_url + "transport/arrival", function(req, res) {
    console.log("In transport/arrival-and-departure");

    if (req.body['skip-question'] == 'yes') {
      req.session.data.transport['arrival'] = "skipped";
    }

    if (req.query.change == "yes") {
      res.redirect(301, '/' + base_url + 'check-your-answers');
    } else {
      res.redirect(301, '/' + base_url + 'task-list');
    }
  })


  router.post('/' + base_url + "transport/means-of-transport", function(req, res) {
    console.log("In transport/means-of-transport");

    if (req.body['skip-question'] == 'yes') {
      req.session.data.transport['means-of-transport'] = "skipped";
    }

    if (req.query.change == "yes") {
      res.redirect(301, '/' + base_url + 'check-your-answers');
    } else {
      res.redirect(301, '/' + base_url + 'task-list');
    }
  })
  router.post('/' + base_url + "transport/load-and-dispatch", function(req, res) {
    console.log("In transport/load-and-dispatch");
    console.log(req.body['skip-question'])
    if (req.body['skip-question'] == 'yes') {
      req.session.data.transport['load-and-dispatch'] = "skipped";
    }

    if (req.query.change == "yes") {
      res.redirect(301, '/' + base_url + 'check-your-answers');
    } else {
      res.redirect(301, '/' + base_url + 'task-list');
    }

  })

  router.post('/' + base_url + "transport/border-control-post", function(req, res) {
    console.log("In transport/border-control-post");
    if (req.body['skip-question'] == 'yes') {
      req.session.data.transport['border-control-post'] = "skipped";
    }
    if (req.query.change == "yes") {
      res.redirect(301, '/' + base_url + 'check-your-answers');
    } else {
      res.redirect(301, '/' + base_url + 'task-list');
    }

  })
  router.post('/' + base_url + "export/weight", function(req, res) {
    console.log("SKIPPUY: " + req.body['skip-question'])
    if (req.body['skip-question'] == 'yes') {
      req.session.data.transport['weight'] = "skipped";
    }
    if (req.query.change == "yes") {
      res.redirect(301, '/' + base_url + 'check-your-answers');
    } else {
      res.redirect(301, '/' + base_url + 'task-list');
    }

  })

  router.post('/' + base_url + 'destination', function(req, res) {
    console.log(req.body.country + '.')
    console.log("This is being triggered in stories routes.js")
    if (req.body.country == "Spain") {
      res.redirect(301, '/' + base_url + 'cannot-use-service?country=' + req.body.country);
    } else if (req.body.country == "China" || req.body.country == "Austrailia") {
      res.redirect(301, '/' + base_url + 'create-reference');
    } else {
      res.redirect(301, '/' + base_url + 're-entry');
    }

  })

  router.post('/' + base_url + "transport/added-transport", function(req, res) {
    console.log("In transport/arrival-and-departure");
    if (req.body['skip-question'] == 'yes') {
      req.session.data.transport['transportMethod'] = "skipped";
    } else if (req.body.addAnotherTransport != "no") {
      res.redirect(301, '/' + base_url + 'transport/select-transport');
    }

    if (req.query.change == "yes") {
      res.redirect(301, '/' + base_url + 'check-your-answers');
    } else {
      res.redirect(301, '/' + base_url + 'task-list');
    }
  })
  router.post('/' + base_url + "transport/conditions", function(req, res) {
    console.log("In transport/conditions");
    if (req.body['skip-question'] == 'yes') {
      req.session.data.transport['transportConditions'] = "skipped";
    }

    if (req.query.change == "yes") {
      res.redirect(301, '/' + base_url + 'check-your-answers');
    } else {
      res.redirect(301, '/' + base_url + 'task-list');
    }
  })


  router.post('/' + base_url + 'goods/containter-seal-numbers/add-container-number', function(req, res) {
    var container = req.body.containerNumbers
    // check to see if continer number matches the requirment. 
    // 3 letters followed by a U,J,Z or R then followed by 6 numbers followed by 1 number.
    if (!container.match(/^[a-zA-Z]{3}[UJZR][0-9]{6}(\s)*\d$/)) {

      res.redirect(301, '/' + base_url + 'goods/containter-seal-numbers/add-container-number?hasError=yes');
    } else {
      // need it to be UpperCase
      req.session.data.containerNumbers = req.body.containerNumbers.toUpperCase()

      res.redirect(301, '/' + base_url + 'goods/containter-seal-numbers/add-seal-numbers?change='+req.query.change+'&id='+req.query.id);
    }

  })
  router.post('/' + base_url + "goods/containter-seal-numbers/goods-in-closed-containers", function(req, res) {
    console.log("In goods containter-seal-numbers goods-in-closed-containers");
    req.session.data.goods['hasContainers'] = ""
    if (req.body['skip-question'] == 'yes') {
      req.session.data.goods['hasContainers'] = "skipped";
      if (req.query.change == "yes") {
        res.redirect(301, '/' + base_url + 'check-your-answers');
      }
    } else {
      if (req.body.goodsInContianers == "yes") {
        res.redirect(301, '/' + base_url + 'goods/containter-seal-numbers/add-container-number');
      } else {
        res.redirect(301, '/' + base_url + 'goods/containter-seal-numbers/want-to-add-seal-numbers');
      }
    }
  })
  router.post('/' + base_url + "goods/containter-seal-numbers/remove", function(req, res) {
    console.log("In goods containter-seal-numbers remove");
    req.session.data.goods['hasContainers'] = ""
    if (req.body.remove == "yes" ) {
      req.session.data.containerSealNumbers.splice(req.query.id, 1);
    }
    res.redirect(301, '/' + base_url + 'goods/containter-seal-numbers/container-seal-numbers-list');
  })

  router.post('/' + base_url + "goods/containter-seal-numbers/want-to-add-seal-numbers", function(req, res) {
    console.log("In goods containter-seal-numbers goods-in-closed-containers");
    req.session.data.goods['hasSealNumber'] = ""
    if (req.body['skip-question'] == 'yes') {
      req.session.data.goods['hasSealNumber'] = "skipped";
    }
    if (req.query.change == "yes") {
      res.redirect(301, '/' + base_url + 'check-your-answers');
    } else {
      res.redirect(301, '/' + base_url + 'goods/containter-seal-numbers/add-seal-numbers');
    }
  })

  router.post('/' + base_url + 'goods/containter-seal-numbers/add-seal-numbers', function(req, res) {
    var seals = req.body.sealNumbers
    var container = req.session.data.containerNumbers

    var item = { "container": container, "seals": seals }
    if(req.query.change =="yes" ){

       console.log("changing item of "+req.query.id)
        req.session.data.containerSealNumbers[req.query.id]=item
        
    }else{
      console.log("adding item")
       req.session.data.containerSealNumbers.push(item)
    }
    
   
    if (req.session.data.goodsInContianers == "yes") {
      res.redirect(301, '/' + base_url + 'goods/containter-seal-numbers/container-seal-numbers-list');
    } else {
      res.redirect(301, '/' + base_url + '/task-list');
    }
  })


}