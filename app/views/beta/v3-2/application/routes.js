module.exports = function(router) {
  // Load helper functions

  // CHANGE VERSION each time you create a new version
  const base_url = "beta/v3-2/application/";

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
        req.session.data.person['consignor'] = establishmentIndex;

        // check if the establishment has multiple activities
        if (req.session.data.establishments[establishmentIndex].All_Activities.length == 1) {
          req.session.data.person['consignorActivity'] = 0;
          res.redirect(301, '/' + base_url + 'persons/consignor/default');
        } else {
          res.redirect(301, '/' + base_url + 'persons/consignor/activity?establishmentIndex=' + establishmentIndex);
        }

    } else {
      res.redirect(301, '/' + base_url + 'persons/consignor/find?hasError=true&country=' + country);
    }






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
      res.redirect(301, '/' + base_url + 'persons/consignor/default');
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

  router.post('/' + base_url + 'transport/place-of-origin', function(req, res) {
    console.log("In transport/place-of-origin");

    const country = req.body.country;
    const roo = req.body.regionOfOrigin;
    const sroo = req.body.subRegionOfOrigin;

    console.log("Saving transport data " + country + ", " + roo + ", " + sroo);

    req.session.data.transport['country'] = country;
    req.session.data.transport['region-of-origin'] = roo;
    req.session.data.transport['sub-region-of-origin'] = sroo;

    res.redirect(301, '/' + base_url + "task-list");
  })

  router.post('/' + base_url + "transport/place-of-origin/dispatch", function(req, res) {
    console.log("In place-of-origin/dispatch.html");

    const establishmentIndex = req.body.establishmentIndex;

    req.session.data.transport['dispatch'] = establishmentIndex;
    res.redirect(301, '/' + base_url + 'transport/place-of-origin');
  })

  router.post('/' + base_url + "transport/place-of-origin/loading", function(req, res) {
    console.log("In place-of-origin/loading.html");

    const establishmentIndex = req.body.establishmentIndex;

    req.session.data.transport['loading'] = establishmentIndex;
    res.redirect(301, '/' + base_url + 'transport/place-of-origin');
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

  router.post('/' + base_url + "transport/arrival-and-departure", function(req, res) {
    console.log("In transport/arrival-and-departure");

    if (req.body['skip-question'] == 'yes') {
      req.session.data.transport['arrival-and-departure'] = "skipped";
    }

    res.redirect(301, '/' + base_url + 'task-list');
  })

  router.post('/' + base_url + "transport/means-of-transport", function(req, res) {
    console.log("In transport/means-of-transport");

    if (req.body['skip-question'] == 'yes') {
      req.session.data.transport['means-of-transport'] = "skipped";
    }

    res.redirect(301, '/' + base_url + 'task-list');
  })

  router.post('/' + base_url + "transport/border-control-post", function(req, res) {
    console.log("In transport/border-control-post");

    if (req.body['skip-question'] == 'yes') {
      req.session.data.transport['border-control-post'] = "skipped";
    }
    if(req.query.change == "yes"){
        res.redirect(301, '/' + base_url + 'check-your-answers');
    }else{
        res.redirect(301, '/' + base_url + 'task-list');
    }
  
  })


}
