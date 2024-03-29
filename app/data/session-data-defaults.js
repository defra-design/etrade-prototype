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
var certifiers = require('./certifiers.json')
var globalCertificate = require('./global-certificate.json')
var applications = require('./applications.json')
var bcp = require('./bcp.json')
var forms = require('./forms.json')
var address_hd7 = require('./postcode-hd7.json')
var iso = require('./iso.json')
module.exports = {
  "account": "Isosure Trading Ltd",
  "certificates" : certs,
  "accounts": accounts,
  "forms": forms,
  "accounts_long": accounts_long,
  "currentCertID": 0,
  "addressBook": [],
  "containerSealNumbers": [],
  "globalCertificate": globalCertificate,
  "bcp": bcp,
  "establishments" : establishments,
  "certifiers" : certifiers,
  "applications": applications,
  "iso":iso,
  "unifiedTestinigUser": "CTSyren",
  "approvedAccounts" :[],
  "userName": "Bill Schoggins",
  "scheduleUploadProcessing": scheduleUploadProcessing,
  "has_multiple_certificates": "yes",
  "listURL": "added-commodities-list",
  "loginReturnURL": "/beta/v2-1/dashboard",
  "certificate": "1",
  "start_from": "select-certificates-no-tabs",
  "addedEHC" : [],
  "additionalDocuments" : [],
  "transportList": [],
  "originalCommodityCount": 0,
  "addedCommodities" : [],
  "currentCertID" : 0,
  "currentCommodityID": 0,
  "displayMax": 30,
  "paginationMax": 5,
  "manualSelection": ["not-selected"],
  "goods": {},
  "person": {consignor : "0", consignorActivity : "0"},
  "transport": {country : "" },
  "setNetWeight": ["120","56"],
  "setGrossWeight": "190",
  "netToGrossWeightIs": "under",
  "bcpDestination": "Northern Ireland",
  "postcode_hd7": address_hd7,
  // latest version
  "latestVersion" : "5",
  // list versions available from the testing config page 
  "versionList": ["3-1","3-2","3-3","3-4","3-5","5"],
  // for config page to create various routes for testing. 
  "system": "prototype",
  // for config page to show either current dashboard or use the "unified" dashboard design. 
  "dashboardType": "unified"
}
