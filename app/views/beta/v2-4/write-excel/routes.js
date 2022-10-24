module.exports = function(router) {
  // Load helper functions
  const readXlsxFile = require('read-excel-file/node');
  const writeXlsxFile = require('write-excel-file/node');
  const multer = require('multer');
  const upload = multer({ dest: './public/data/uploads/' })
  var fileDownload = require('js-file-download');

  // CHANGE VERSION each time you create a new version
  const base_url = "beta/v2-4/write-excel/"

  router.post('/' + base_url + "write-excel", upload.single('file-upload-1'), function(req, res) {
    console.log("In write-excel routes.js");

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
