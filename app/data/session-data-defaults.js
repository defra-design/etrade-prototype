/*

Provide default values for user session data. These are automatically added
via the `autoStoreData` middleware. Values will only be added to the
session if a value doesn't already exist. This may be useful for testing
journeys where users are returning or logging in to an existing application.

============================================================================
*/

// Get all certificates. Just need to add a new certificate .json file to the /data/certs/ folder.
const fs = require('fs');
const normalizedPath = require("path").join(__dirname, "./certs");
var certs =[]
fs.readdirSync(normalizedPath).forEach(function(file) {
    //Checks if file is a JSON file.
    var fileType = file.substring(file.length, file.lastIndexOf("."));
    if (fileType == ".json"){
    // loads the files
    var d = require("./certs/" + file);
    //pushes data to an array
    certs.push(d)
    }
});

var establishments = require('./establishments.json')
var scheduleUploadProcessing = require('./schedule-upload-processing.json')
var accounts = require('./accounts.json')
var accounts_long = require('./accounts-long-list.json')
module.exports = {
  "certificates" : certs,
  "accounts": accounts,
  "accounts_long": accounts_long,
  "currentCertID": 0,
  "establishments" : establishments,
  "scheduleUploadProcessing": scheduleUploadProcessing,
  "has_multiple_certificates": "yes",
  "listURL": "added-commodities-list",
  "loginReturnURL": "/beta/v2-1/dashboard",
  "certificate": "1",
  "start_from": "select-certificates-no-tabs",
  "addedEHC" : [],
  "additionalDocuments" : [],
  "transport": [],
  "originalCommodityCount": 0,
  "addedCommodities" : [],
  "currentCertID" : 0,
  "currentCommodityID": 0,
  "displayMax": 30,
  "paginationMax": 3,
}
