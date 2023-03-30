module.exports = function(router) {
  // Load helper functions
  const readXlsxFile = require('read-excel-file/node')
  const multer = require('multer');
  const upload = multer({ dest: './public/data/uploads/' })

  // CHANGE VERSION each time you create a new version
  const base_url = "beta/v3-5/application/export/"

  function getCommodityIndex(commodity_code, certificate_index, certificate) {
    // console.log("In getCommodityIndex with params commodity_code: " + commodity_code + ", certificate_index: " + certificate_index + ", certificate: " + certificate);
    var commodity_index = 0;

    for (let y = 0; y < certificate.commodities.length; y++) {
      if (certificate.commodities[y].code == commodity_code) {
        // console.log("Found matching commodityIndex with value: " + y);
        commodity_index = y;
      }
    }
    return commodity_index;
  }

  function getCommodityDescription(commodity_code, certificate_index, certificate) {
    var commodity_description;

    for (let z = 0; z < certificate.commodities.length; z++) {
      if (certificate.commodities[z].code == commodity_code) {
        commodity_description = certificate.commodities[z].title;
      }
    }
    return commodity_description;
  }

  router.post('/' + base_url + "upload/", upload.single('file-upload-1'), function(req, res) {

    function addCommodityAndIdentifications(certID, commodityID, identifications, ehcIndex) {
      // console.log("In addCommodityAndIdentifications with params certID: " + certID + ", commodityID: " + commodityID + ", identifications: " + identifications + ", ehcIndex: " + ehcIndex);
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
        commodity = {"code":commodityCode,"title":commodityTitle,"id":commodityID,"identifications":identifications};
        req.session.data.addedEHC[ehcIndex].addedCommodities.push(commodity);
      }
    }

    function getCertificateIndexFromString(ehcString) {
      // expecting ehcString in format of "EHC9999"
      ehcString = ehcString.toUpperCase();

      certificateIndex = 0;
      for (let i = 0; i < req.session.data.certificates.length; i++) {
        if (req.session.data.certificates[i].number == ehcString) {
          certificateIndex = i;
        }
      }
      return certificateIndex;
    }

    if (req.file) {

      const mimetype = req.file.mimetype;
      const xlsx_mimetype = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

      // make sure that this is an Excel file (.xlsx)
      if (mimetype == xlsx_mimetype) {

        // get the location of the uploaded file
        const path_and_filename = req.file.path;

        // read the file
        readXlsxFile(path_and_filename).then((rows, errors) => {

          // make sure that it is one of our templates
          // our files start with the second cell in rows[0] beginning with EHC-....
          if (rows[0][1].substring(0,3).toLowerCase() == "ehc") {
            // how many rows of fluff does the spreadsheet have before the data starts?
            const rows_of_fluff = 8;
            const rows_of_uploaded_data = rows.length - rows_of_fluff;

            // handle situation where the user hasn't added any data to our template
            if (rows_of_uploaded_data == 0) {
              // bounce
              console.log("The uploaded file does not contain any commodity data");
              res.redirect(301, '/' + base_url + "?error=yes&error_type=file type&filename=xyz&error_trigger=no_data");
            } else {

              // parse the certificate number from the uploaded data - we may discard this later, but it could be useful
              const ehc_number = rows[0][1].substring(4,8); // e.g. 8361
              const ehc_string = "EHC" + ehc_number;
              console.log("The EHC number is " + ehc_number);
              var certificate_index = getCertificateIndexFromString(ehc_string);

              // Get the current cert ID and commodity ID
              let certID = req.session.data.currentCertID || certificate_index;

              let cert = req.session.data.certificates[certID];
              let cert_number = cert.number;
              // console.log("cert.number is " + cert.number);
              let cert_title = cert.title;
              let cert_schema = cert.schema;

              if (typeof cert_schema !== 'undefined') {

                var uploaded_data = [];

                // extract the user's data from the spreadsheet and put it into uploaded_data
                for (let i = 0; i < rows_of_uploaded_data; i++) {
                  uploaded_data.push(rows[i+rows_of_fluff]);
                }

                // now create a key-value pair of the column heading and the data
                var data_to_store = [];

                // create an empty array to hold any potential data errors
                var data_errors = [];
                var errorRowCount = 0; // how many rows of data had one or more errors

                for (let uploadedDataRow = 0; uploadedDataRow < uploaded_data.length; uploadedDataRow++) {
                  var temp = {};
                  var hasError = false;

                  for (let c = 0; c < cert_schema.length; c++ ) {
                      temp[cert_schema[c].id] = uploaded_data[uploadedDataRow][c];

                      // check to see if a required field was left blank
                      if ((cert_schema[c].required == "yes") && (uploaded_data[uploadedDataRow][c] == null)) {
                        console.log("We've got an empty cell in a required field in row " + uploadedDataRow);
                        var error = {};
                        error['row'] = uploadedDataRow;
                        error['message'] = cert_schema[c].error;
                        data_errors.push(error);
                        hasError = true;
                      }
                  }

                  temp['ehc'] = "EHC" + ehc_number;
                  temp['commodity_id'] = getCommodityIndex(temp['commodity_code'], certID, cert);
                  temp['commodity_description'] = getCommodityDescription(temp['commodity_code'], certID, cert);

                  data_to_store.push(temp);
                  if (hasError) {
                    errorRowCount++;
                  }
                }

                // sort data_to_store by commodity code
                data_to_store.sort((a, b) => (a.commodity_code > b.commodity_code) ? 1 : -1);

                // check to see if this certificate has already been added to addedEHC (e.g. manually or from a previous upload)
                let added_ehc_index = -1;
                if (req.session.data.addedEHC.length >= 1) {
                    // console.log("addedEHC.length: " + req.session.data.addedEHC.length);
                    for (let x = 0; x < req.session.data.addedEHC.length; x++) {
                      if (ehc_string == req.session.data.addedEHC[x].number) {
                          // console.log("EHC Match at index " + x);
                          added_ehc_index = x;
                      } else {
                        // console.log("No match at index " + x);
                      }
                    }
                }

                if (added_ehc_index == -1) {
                    req.session.data.addedEHC.push(cert);
                    cert.addedCommodities = [];
                    added_ehc_index = 0; // TODO: make this more robust to handle situations where the index might not be zero
                }

                // check to see if the added_ehc_index has addedCommodities
                if (req.session.data.addedEHC[added_ehc_index]) {
                  console.log("Has addedCommodities");
                } else {
                  console.log("Does not yet have addedCommodities");
                }

                // add identifications, grouped by commodity code
                var last_commodity_code = -1;

                var commodity;
                var identifications = [];
                var is_first_time = true;

                // iterate through data_to_store
                for (let x = 0; x < data_to_store.length; x++) {

                  // is this a new commodity code? If it is, add it and initialise the identifications for it
                  if (data_to_store[x].commodity_code != last_commodity_code) {

                    if (is_first_time) {
                      is_first_time = false;
                    } else {
                      // since this isn't the first time through, we'll need to store the identifications and do some cleanup to get ready for the next round
                      var commodityID = getCommodityIndex(last_commodity_code, certID, req.session.data.certificates[certificate_index]);

                      // for each commodity that is added to addedCommodities, we need basic commodity data and a list of identifications
                      addCommodityAndIdentifications(certID, commodityID, identifications, added_ehc_index);

                      identifications = [];
                      commodity = "";
                    }

                    // this is a new commodity code - update last_commodity_code
                    last_commodity_code = data_to_store[x].commodity_code;
                    identifications.push(data_to_store[x]);

                  } else {
                    // else, don't create another one - just add commodities to it
                    identifications.push(data_to_store[x]);
                  }

                  // final cleanup -- an extra step to add the last identification(s) to the commodity
                  if (x == (data_to_store.length - 1)) {
                    var commodityID = getCommodityIndex(last_commodity_code, certID, req.session.data.certificates[certificate_index]);
                    addCommodityAndIdentifications(certID, commodityID, identifications, added_ehc_index);
                  }
                }

                console.log("Finished adding uploaded commodities and identifications");

                // make the data_errors array ready for the querystring
                var errorString = "";
                for (let e = 0; e < data_errors.length; e++) {
                  errorString = errorString + "&errorRecord=" + data_errors[e].row + "&errorMessage=" + data_errors[e].message;
                }

                // res.redirect(301, '/' + base_url + 'added-commodities-list');
                res.redirect(301, '/' + base_url + 'upload/processing?ehcString=' + cert_number + '&totalRows=' + rows_of_uploaded_data + "&errorRowCount=" + errorRowCount + "&numberOfErrors=" + data_errors.length + "&fluffRows=" + rows_of_fluff + errorString);

              } else {
                console.log("We don't have a schema for this certificate");
                res.redirect(301, '/' + base_url + "upload/?error=yes&error_type=file type&filename=xyz&error_trigger=no_schema");
              }

            }

          } else {
            console.log("This Excel file doesn't appear to be one of our templates");
            res.redirect(301, '/' + base_url + "upload/?error=yes&error_type=file type&filename=xyz&error_trigger=not_template");
          }

        })
      } else {
        console.log("Is not an XLSX file");
        res.redirect(301, '/' + base_url + "upload/?error=yes&error_type=file type&filename=xyz&error_trigger=mimetype");
      }

    } else {
      console.log("Doesn't have files");
      res.redirect(301, '/' + base_url + "upload/?error=yes&error_type=file type&filename=xyz&error_trigger=no_files");
    }

  })

  router.post('/' + base_url + "upload/upload-with-incompletes", upload.single('file-upload-1'), function(req, res) {

    function addCommodityAndIdentifications(certID, commodityID, identifications, ehcIndex) {
      // console.log("In addCommodityAndIdentifications with params certID: " + certID + ", commodityID: " + commodityID + ", identifications: " + identifications + ", ehcIndex: " + ehcIndex);
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
        commodity = {"code":commodityCode,"title":commodityTitle,"id":commodityID,"identifications":identifications};
        req.session.data.addedEHC[ehcIndex].addedCommodities.push(commodity);
      }
    }

    function getCertificateIndexFromString(ehcString) {
      // expecting ehcString in format of "EHC9999"
      ehcString = ehcString.toUpperCase();

      certificateIndex = 0;
      for (let i = 0; i < req.session.data.certificates.length; i++) {
        if (req.session.data.certificates[i].number == ehcString) {
          certificateIndex = i;
        }
      }
      return certificateIndex;
    }

    function getEstablishmentFromApprovalNumber(approvalNumber) {
      // console.log("Approval number: " + approvalNumber);
      var establishment = {};
      for (let x = 0; x < req.session.data.establishments.length; x++) {
        // console.log(req.session.data.establishments[x].AppNo);
        if (req.session.data.establishments[x].AppNo == approvalNumber) {
          establishment = req.session.data.establishments[x];
        }
      }
      return establishment;
    }

    function getEstablishmentIndexFromApprovalNumber(approvalNumber) {
      // console.log("Approval number: " + approvalNumber);
      var establishmentIndex = -1;
      for (let x = 0; x < req.session.data.establishments.length; x++) {
        if (req.session.data.establishments[x].AppNo == approvalNumber) {
          establishmentIndex = x;
        }
      }
      return establishmentIndex;
    }

    if (req.file) {

      const mimetype = req.file.mimetype;
      const xlsx_mimetype = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

      // make sure that this is an Excel file (.xlsx)
      if (mimetype == xlsx_mimetype) {

        // get the location of the uploaded file
        const path_and_filename = req.file.path;

        // read the file
        readXlsxFile(path_and_filename).then((rows, errors) => {

          // make sure that it is one of our templates
          // our files start with the second cell in rows[0] beginning with EHC-....
          if (rows[0][1].substring(0,3).toLowerCase() == "ehc") {
            // how many rows of fluff does the spreadsheet have before the data starts?
            const rows_of_fluff = 8;
            const rows_of_uploaded_data = rows.length - rows_of_fluff;

            // handle situation where the user hasn't added any data to our template
            if (rows_of_uploaded_data == 0) {
              // bounce
              console.log("The uploaded file does not contain any commodity data");
              res.redirect(301, '/' + base_url + "?error=yes&error_type=file type&filename=xyz&error_trigger=no_data");
            } else {

              // parse the certificate number from the uploaded data - we may discard this later, but it could be useful
              const ehc_number = rows[0][1].substring(4,8); // e.g. 8361
              const ehc_string = "EHC" + ehc_number;
              console.log("The EHC number is " + ehc_number);
              var certificate_index = getCertificateIndexFromString(ehc_string);

              // Get the current cert ID and commodity ID
              let certID = req.session.data.currentCertID || certificate_index;

              let cert = req.session.data.certificates[certID];
              let cert_number = cert.number;
              console.log("cert.number is " + cert.number);
              let cert_title = cert.title;
              let cert_schema = cert.schema;

              if (typeof cert_schema !== 'undefined') {

                var uploaded_data = [];

                // extract the user's data from the spreadsheet and put it into uploaded_data
                for (let i = 0; i < rows_of_uploaded_data; i++) {
                  uploaded_data.push(rows[i+rows_of_fluff]);
                }

                // now create a key-value pair of the column heading and the data
                var data_to_store = [];

                // create an empty array to hold any potential incomplete data
                var data_incomplete = [];
                var incompleteRowCount = 0; // how many rows of data had one or more errors

                for (let uploadedDataRow = 0; uploadedDataRow < uploaded_data.length; uploadedDataRow++) {
                  var temp = {};
                  var isIncomplete = false;

                  for (let c = 0; c < cert_schema.length; c++ ) {
                      temp[cert_schema[c].id] = uploaded_data[uploadedDataRow][c];

                      // check to see if a required field was left blank,
                      if ((cert_schema[c].required == "yes") && (uploaded_data[uploadedDataRow][c] == null)) {
                        console.log("We've got an empty cell in a required field in row " + (uploadedDataRow + rows_of_fluff));
                        let incomplete = {};
                        incomplete['row'] = uploadedDataRow;
                        incomplete['id'] = cert_schema[c].id;
                        data_incomplete.push(incomplete);
                        isIncomplete = true;
                      }

                      // check if we have any searchable fields (e.g. establishments) that have been populated
                      if ((cert_schema[c].type == "search") && (uploaded_data[uploadedDataRow][c] != null)) {
                        // console.log("We have a searchable field with a non null value");

                        let establishmentType = cert_schema[c].id; // e.g. coldStore

                        // check to see if we have a matching establishment
                        let establishmentApprovalNumber = uploaded_data[uploadedDataRow][c];
                        let establishmentIndex = getEstablishmentIndexFromApprovalNumber(establishmentApprovalNumber);

                        let establishmentDetails = getEstablishmentFromApprovalNumber(establishmentApprovalNumber);

                        // TODO: validate the activity that is stored in the next column, so uploaded_data[uploadedDataRow][c+1]

                        if (establishmentDetails.AppNo) {
                          // since we have a match, store the establishment index
                          // e.g. manufacturingPlantActivity
                          // console.log("Found a match for this approval number: " + establishmentDetails.AppNo + " - storing id value of " + establishmentIndex);
                          // temp[establishmentType+"-id"] = establishmentIndex;
                        } else {
                          // we couldn't find the approval number - flag it as incomplete
                          console.log("Could not find a matching approval number for " + uploaded_data[uploadedDataRow][c]);
                          let incomplete = {};
                          incomplete['row'] = uploadedDataRow;
                          incomplete['id'] = cert_schema[c].id;
                          data_incomplete.push(incomplete);
                          isIncomplete = true;
                        }

                      } else if (cert_schema[c].multiple === "yes") {
                        console.log("Found a multiple: " + cert_schema[c].id + " -- " + temp[cert_schema[c].id]);
                        // split previously stored value for this field into an array
                        stringArray = temp[cert_schema[c].id].toString().split(",");
                        // remove extraneous spaces

                        for (x = 0; x < stringArray.length; x++) {
                          stringArray[x] = stringArray[x].trim();
                        }

                        // console.log("stringArray[0]: " + stringArray[0]);
                        temp[cert_schema[c].id] = stringArray;
                      }

                    }

                  // does this row have incomplete data?
                  if (isIncomplete) {
                    incompleteRowCount++;
                    temp['incomplete'] = [];
                    // which fields were incomplete for this row?
                    for (let x = 0; x < data_incomplete.length; x++) {
                      if (data_incomplete[x].row == uploadedDataRow) {
                        temp['incomplete'].push(data_incomplete[x].id);
                      }
                    }
                  }

                  temp['ehc'] = "EHC" + ehc_number;
                  temp['commodity_id'] = getCommodityIndex(temp['commodity_code'], certID, cert);
                  temp['commodity_description'] = getCommodityDescription(temp['commodity_code'], certID, cert);
                  temp['isIncomplete'] = isIncomplete;

                  data_to_store.push(temp);

                }

                // sort data_to_store by commodity code
                data_to_store.sort((a, b) => (a.commodity_code > b.commodity_code) ? 1 : -1);

                // check to see if this certificate has already been added to addedEHC (e.g. manually or from a previous upload)
                let added_ehc_index = -1;
                if (req.session.data.addedEHC.length >= 1) {
                    // console.log("addedEHC.length: " + req.session.data.addedEHC.length);
                    for (let x = 0; x < req.session.data.addedEHC.length; x++) {
                      if (ehc_string == req.session.data.addedEHC[x].number) {
                          // console.log("EHC Match at index " + x);
                          added_ehc_index = x;
                      } else {
                        // console.log("No match at index " + x);
                      }
                    }
                }

                if (added_ehc_index == -1) {
                    req.session.data.addedEHC.push(cert);
                    cert.addedCommodities = [];
                    added_ehc_index = 0; // TODO: make this more robust to handle situations where the index might not be zero
                }

                // check to see if the added_ehc_index has addedCommodities
                if (req.session.data.addedEHC[added_ehc_index]) {
                  console.log("Has addedCommodities");
                } else {
                  console.log("Does not yet have addedCommodities");
                }

                // add identifications, grouped by commodity code
                var last_commodity_code = -1;

                var commodity;
                var identifications = [];
                var is_first_time = true;

                // iterate through data_to_store
                for (let x = 0; x < data_to_store.length; x++) {

                  // is this a new commodity code? If it is, add it and initialise the identifications for it
                  if (data_to_store[x].commodity_code != last_commodity_code) {

                    if (is_first_time) {
                      is_first_time = false;
                    } else {
                      // since this isn't the first time through, we'll need to store the identifications and do some cleanup to get ready for the next round
                      var commodityID = getCommodityIndex(last_commodity_code, certID, req.session.data.certificates[certificate_index]);

                      // for each commodity that is added to addedCommodities, we need basic commodity data and a list of identifications
                      addCommodityAndIdentifications(certID, commodityID, identifications, added_ehc_index);

                      identifications = [];
                      commodity = "";
                    }

                    // this is a new commodity code - update last_commodity_code
                    last_commodity_code = data_to_store[x].commodity_code;
                    identifications.push(data_to_store[x]);

                  } else {
                    // else, don't create another one - just add commodities to it
                    identifications.push(data_to_store[x]);
                  }

                  // final cleanup -- an extra step to add the last identification(s) to the commodity
                  if (x == (data_to_store.length - 1)) {
                    var commodityID = getCommodityIndex(last_commodity_code, certID, req.session.data.certificates[certificate_index]);
                    addCommodityAndIdentifications(certID, commodityID, identifications, added_ehc_index);
                  }
                }

                console.log("Finished adding uploaded commodities and identifications");

                // make the data_incomplete array ready for the querystring
                var incompleteString = "";
                for (let e = 0; e < data_incomplete.length; e++) {
                  incompleteString = incompleteString + "&incompleteRecord=" + data_incomplete[e].row;
                }

                res.redirect(301, '/' + base_url + 'upload/processing-with-incompletes?ehcString=' + cert_number + '&totalRows=' + rows_of_uploaded_data + "&incompleteRowCount=" + incompleteRowCount + "&totalIncompletes=" + data_incomplete.length + "&fluffRows=" + rows_of_fluff + incompleteString);

              } else {
                console.log("We don't have a schema for this certificate");
                res.redirect(301, '/' + base_url + "upload/?error=yes&error_type=file type&filename=xyz&error_trigger=no_schema");
              }

            }

          } else {
            console.log("This Excel file doesn't appear to be one of our templates");
            res.redirect(301, '/' + base_url + "upload/?error=yes&error_type=file type&filename=xyz&error_trigger=not_template");
          }

        })
      } else {
        console.log("Is not an XLSX file");
        res.redirect(301, '/' + base_url + "upload/?error=yes&error_type=file type&filename=xyz&error_trigger=mimetype");
      }

    } else {
      console.log("Doesn't have files");
      res.redirect(301, '/' + base_url + "upload/?error=yes&error_type=file type&filename=xyz&error_trigger=no_files");
    }

  })

}
