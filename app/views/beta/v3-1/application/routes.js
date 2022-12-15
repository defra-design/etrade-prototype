module.exports = function(router) {
  // Load helper functions

  // CHANGE VERSION each time you create a new version
  const base_url = "beta/v3-1/application/";

  router.post('/' + base_url + "persons/consignee/find", function(req, res) {
    console.log("In consignee/find.html");

    const establishmentIndex = req.body.establishmentIndex;

    req.session.data.person['consignee'] = establishmentIndex;
    res.redirect(301, '/' + base_url + 'persons/consignee-or-importer');
  })

  router.post('/' + base_url + "persons/consignor/find", function(req, res) {
    console.log("In consignor/find.html");

    const establishmentIndex = req.body.establishmentIndex;

    req.session.data.person['consignor'] = establishmentIndex;
    res.redirect(301, '/' + base_url + 'persons/consignor-or-exporter');
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

    req.session.data.person['destination'] = establishmentIndex;
    res.redirect(301, '/' + base_url + 'transport/place-of-destination');
  })

  router.post('/' + base_url + "transport/place-of-origin/dispatch", function(req, res) {
    console.log("In place-of-origin/dispatch.html");

    const establishmentIndex = req.body.establishmentIndex;

    req.session.data.person['dispatch'] = establishmentIndex;
    res.redirect(301, '/' + base_url + 'transport/place-of-origin');
  })

  router.post('/' + base_url + "transport/place-of-origin/loading", function(req, res) {
    console.log("In place-of-origin/loading.html");

    const establishmentIndex = req.body.establishmentIndex;

    req.session.data.person['loading'] = establishmentIndex;
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

    delete req.session.data.person[person];
    res.redirect(301, '/' + base_url + "transport/" + redirect + "?deleted=yes&who=" + person);
  })

}
