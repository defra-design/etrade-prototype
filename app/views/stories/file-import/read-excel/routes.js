module.exports = function(router) {
  // Load helper functions
  const readXlsxFile = require('read-excel-file/node')
  const multer = require('multer');
  const upload = multer({ dest: './public/data/uploads/' })

  // CHANGE VERSION each time you create a new version
  const base_url = "stories/file-import/read-excel/"

  router.post('/' + base_url, upload.single('file-upload-1'), function(req, res) {
    // console.log("In index routes.js");
    // console.log(req.file);

    if (req.file) {
      // console.log("Has files");
      // console.log(req.file);

      const mimetype = req.file.mimetype;
      const xlsx_mimetype = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

      // make sure that this is an Excel file (.xlsx)
      if (mimetype == xlsx_mimetype) {
        // console.log("Is an .xlsx file");

        // get the location of the uploaded file
        const path_and_filename = req.file.path;
        // console.log("Path and filename: " + path_and_filename);
        // console.log("About to start readXlsxFile");

        // read the file
        readXlsxFile(path_and_filename).then((rows, errors) => {
          // console.log("In readXlsxFile");
          // `rows` is an array of rows
          // console.log(rows);

          // display EHC number and description (just for fun)
          console.log("rows[0][1]");
          console.log(rows[0][1]);
          console.log("------------- XX ------------");

          // make sure that it is one of our templates
          // our files start with the second cell in rows[0] beginning with EHC-....
          if (rows[0][1].substring(0,3).toLowerCase() == "ehc") {

            // console.log("This Excel file smells like one of our templates");

            // TODO: retrieve certificate number dynamically
            var certificate_index;
            const ehc_number = rows[0][1].substring(4,8); // e.g. 8361
            console.log("The EHC number is " + ehc_number);
            switch(ehc_number) {
              case "8361":
                certificate_index = 6;
                break;
              case "8364":
                certificate_index = 7;
                break;
              default:
                // nothing;
                certificate_index = 0;
            }

            let cert = req.session.data.certificates[certificate_index];
            let cert_number = cert.number;
            let cert_title = cert.title;


            let cert_schema = cert.schema;
            /*
            console.log("---- cert schema ---- ");
            console.log(cert_schema);
            console.log("---- cert schema ---- ");
            console.log("cert_schema length is: " + cert_schema.length);
            */

            // how many rows of fluff does the spreadsheet have before the data starts?
            const rows_of_fluff = 8;
            const rows_of_uploaded_data = rows.length - rows_of_fluff;

            // handle situation where the user hasn't added any data to our template
            if (rows_of_uploaded_data == 0) {
              // bounce
              console.log("Does not contain any commodity data");
              res.redirect(301, '/' + base_url + "?error=yes&error_type=file type&filename=xyz&error_trigger=no_data");
            } else {

              var uploaded_data = [];

              // extract the user's data from the spreadsheet and put it into uploaded_data
              for (let i = 0; i < rows_of_uploaded_data; i++) {
                uploaded_data.push(rows[i+rows_of_fluff]);
              }

              // now create a key-value pair of the column heading and the data for use in the app
              var data_to_store = [];
              console.log("Still going");

              console.log("Uploaded data length: " + uploaded_data.length);

              for (let u = 0; u < uploaded_data.length; u++) {
                var temp = {};
                /*
                temp["ehc"] = cert_number;
                temp["commodity_id"] = 999; // TODO: make this dynamic
                temp["commodity_description"] = cert_title;
                */
                for (let c = 0; c < cert_schema.length; c++ ) {
                    temp[cert_schema[c].id] = uploaded_data[u][c];
                }
                data_to_store.push(temp);
              }

              /*
              console.log("Uploaded data_to_store is ........");
              console.log(data_to_store);
              */

              let cert = req.session.data.certificates[certificate_index];
              cert.addedCommodities = []
              req.session.data.addedEHC.push(cert);
              // create empty array
              req.session.data.addedCommodities = [];
              for (let i = 0; i < uploaded_data.length; i++) {

                // console.log("Adding " + i + " of " + uploaded_data.length);
                // console.log(data_to_store[i]);
                req.session.data.addedEHC[0].addedCommodities.unshift(data_to_store[i]);
                req.session.data.addedCommodities.unshift(data_to_store[i]);
              }

              // TODO: add the uploaded data to the session so it can be stored, displayed, manipulated, etc.

              console.log("Last stop");
              // res.redirect(301, '/' + base_url + 'commodities-list');
              res.redirect(301, '/' + base_url + 'commodities-list-grouped?certificate_index=' + certificate_index + '&ehc_number=' + ehc_number);

            }



          } else {
            console.log("This Excel file doesn't appear to be one of our templates");
            res.redirect(301, '/' + base_url + "?error=yes&error_type=file type&filename=xyz&error_trigger=not_template");
          }

        })
      } else {
        console.log("Is not an XLSX file");
        res.redirect(301, '/' + base_url + "?error=yes&error_type=file type&filename=xyz&error_trigger=mimetype");
      }

    } else {
      console.log("Doesn't have files");
      res.redirect(301, '/' + base_url + "?error=yes&error_type=file type&filename=xyz&error_trigger=no_files");
    }

  })


}
