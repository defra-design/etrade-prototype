module.exports = function(router) {
  // Load helper functions


  // CHANGE VERSION each time you create a new version
  const base_url = "stories/file-import/"

  router.post('/' + base_url + 'application-reference', function(req, res) {
    // not currently storing the user's reference name
    req.session.data.UserReference = req.body.UserReference;

    if (req.body.version == "2") {
      res.redirect(301, '/' + base_url + 'task-list');
    } else {
      res.redirect(301, '/' + base_url + 'select-certificate-no-tabs');
    }

  })

  router.post('/' + base_url + 'select-certificate-no-tabs', function(req, res) {
    // console.log("in routes.js for select-certificate-no-tabs");
    let id = req.body.certificate || 0;
    console.log("ID is: " + id);
    let cert = req.session.data.certificates[id];

    // console.log(cert);
    //todo - check if its already selected
    // create a new array to hold the commodity data
    cert.addedCommodities = []
    // Add the cert to the array
    req.session.data.addedEHC.push(cert);
    //set the id of the current Certificate
    req.session.data.currentCertID = req.session.data.addedEHC.length - 1

    if (req.body.version == "2") {
      res.redirect(301, '/' + base_url + 'before-you-start');
    } else {
      res.redirect(301, '/' + base_url + 'how-to-add');
    }

  })


  router.post('/' + base_url + 'upload/upload-template', function(req, res) {
    // console.log("in routes.js for upload-template")

    // TODO: fix this - I think this is trying to get the ID of the selected certificate
    let id = 1; // force it to 1, aka EHC8329
    let certID = req.session.data.currentCertID || 0;

    // to access this page directly with no EHC selected we need to create a generic EHC.
    if (req.session.data.addedEHC.length == 0) {
      console.log("addedEHC.length is zero");
        let cert = req.session.data.certificates[id];
        cert.addedCommodities = []
        req.session.data.addedEHC.push(cert);
    } else {
      console.log("addedEHC.length is NOT zero: " + req.session.data.addedEHC.length);
    }

    let fakeAddedCommodities = req.session.data.scheduleUploadProcessing[0].addedCommoditiesUpload1;
    console.log("certID is: " + certID);

    // create empty array
    req.session.data.addedCommodities = [];

    // TODO: add logic so that we don't create duplicates
    for (let i = 0; i < fakeAddedCommodities.length; i++) {
      // console.log("Adding fake data " + i + ": " + JSON.stringify(fakeAddedCommodities[i]));
      console.log("Adding " + i + " of " + fakeAddedCommodities.length);
      req.session.data.addedEHC[certID].addedCommodities.unshift(fakeAddedCommodities[i]);
      req.session.data.addedCommodities.unshift(fakeAddedCommodities[i]);
    }

    if (req.body.version == "2") {
      res.redirect(301, '/' + base_url + 'processing/processing?v=2');
    } else {
      res.redirect(301, '/' + base_url + 'processing/processing');
    }

  })


  router.post('/' + base_url + 'upload/re-upload-template', function(req, res) {
    // console.log("in routes.js for re-upload-template")

    // TODO: fix this - I think this is trying to get the ID of the selected certificate
    let id = 1; // force it to 1, aka EHC8329
    let certID = req.session.data.currentCertID || 0;

    // to access this page directly with no EHC selected we need to create a generic EHC.
    if (req.session.data.addedEHC.length == 0) {
      console.log("addedEHC.length is zero");
        let cert = req.session.data.certificates[id];
        cert.addedCommodities = []
        req.session.data.addedEHC.push(cert);
    } else {
      console.log("addedEHC.length is NOT zero: " + req.session.data.addedEHC.length);
    }

    let fakeAddedCommodities = req.session.data.scheduleUploadProcessing[0].addedCommoditiesUpload2;
    console.log("certID is: " + certID);

    // create empty array
    req.session.data.addedCommodities = [];

    // TODO: add logic so that we don't create duplicates
    for (let i = 0; i < fakeAddedCommodities.length; i++) {
      // console.log("Adding fake data " + i + ": " + JSON.stringify(fakeAddedCommodities[i]));
      console.log("Adding " + i + " of " + fakeAddedCommodities.length);
      req.session.data.addedEHC[certID].addedCommodities.unshift(fakeAddedCommodities[i]);
      req.session.data.addedCommodities.unshift(fakeAddedCommodities[i]);
    }

    res.redirect(301, '/' + base_url + 'processing/processing-2');
  })

}
