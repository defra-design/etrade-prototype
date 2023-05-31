module.exports = function(router) {
  // Load helper functions
  const readXlsxFile = require('read-excel-file/node');
  const writeXlsxFile = require('write-excel-file/node');
  const multer = require('multer');
  const upload = multer({ dest: './public/data/uploads/' })
  var fileDownload = require('js-file-download');

  // CHANGE VERSION each time you create a new version
  const base_url = "beta/v4/write-excel/"

  router.post('/' + base_url + "write-excel", upload.single('file-upload-1'), function(req, res) {
    console.log("In write-excel routes.js");
    let certID = req.session.data.currentCertID || 0;
    let addedEHC = req.session.data.addedEHC[0];
    if (addedEHC) {
      console.log("We have data at addedEHC[0]")

      let ehcNumber = addedEHC.number;
      let ehcTitle = addedEHC.title;
      console.log(ehcNumber + " -- " + ehcTitle);

      let ehcSchema = addedEHC.schema;
      let requiredHeading = [];
      let columnHeading = [];

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
          console.log("Starting a new row");

          // for every item within the schema
          for (let z = 0; z < ehcSchema.length; z++) {

            // store a row with cells that match the schema --> don't just add everything in the identification because there is junk in there
            let cell = {};
            console.log("Adding a cell with the value: " + addedEHC.addedCommodities[x].identifications[y][ehcSchema[z].id]);

            // short term hack to not have an array of values within a cell for multiples
            if (ehcSchema[z].multiple == "yes") {
              cell['value'] = addedEHC.addedCommodities[x].identifications[y][ehcSchema[z].id][0];
            } else {
              cell['value'] = addedEHC.addedCommodities[x].identifications[y][ehcSchema[z].id];
            }

            row.push(cell);
          }

          console.log("Adding row to excelDataRows");
          console.log(row);

          excelDataRows.push(row);
        }

      }

      // add header rows
      excelDataRows.unshift(excelHeaderRow);
      excelDataRows.unshift(excelRequiredRow);

      let excelFilePath = './public/data/uploads/excel.xlsx';

      writeXlsxFile(excelDataRows, {
        filePath: excelFilePath
      })
      console.log("Passed writing excelData");
      // console.log(excelData);

    } else {
      console.log("No commodity data available");
    }

    const VANILLA_HEADER_ROW = [
      {
        value: 'Name',
        fontWeight: 'bold'
      },
      {
        value: 'Date of Birth',
        fontWeight: 'bold'
      },
      {
        value: 'Cost',
        fontWeight: 'bold'
      },
      {
        value: 'Paid',
        fontWeight: 'bold'
      }
    ]

    const VANILLA_DATA_ROW_1 = [
      // "Name"
      {
        type: String,
        value: 'John Smith'
      },

      // "Date of Birth"
      {
        type: Date,
        value: new Date(),
        format: 'mm/dd/yyyy'
      },

      // "Cost"
      {
        type: Number,
        value: 1800
      },

      // "Paid"
      {
        type: Boolean,
        value: true
      }
    ]

    const vanillaData = [
      VANILLA_HEADER_ROW,
      VANILLA_DATA_ROW_1
    ]

    let vanillaFilePath = './public/data/uploads/vanilla.xlsx';

    writeXlsxFile(vanillaData, {
      filePath: vanillaFilePath
    })
    console.log("Passed writing vanillaData");



  })

}
