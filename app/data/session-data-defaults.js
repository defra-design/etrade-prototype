/*

Provide default values for user session data. These are automatically added
via the `autoStoreData` middleware. Values will only be added to the
session if a value doesn't already exist. This may be useful for testing
journeys where users are returning or logging in to an existing application.

============================================================================

Example usage:

"full-name": "Sarah Philips",

"options-chosen": [ "foo", "bar" ]

============================================================================

*/
var certs = require('./certs.json')
  certs.push(require('./certs/_ehc8307.json'));
  certs.push(require('./certs/_ehc8308.json'));
  certs.push(require('./certs/_ehc8323.json'));
  certs.push(require('./certs/_ehc8328.json'));
  certs.push(require('./certs/_ehc8329.json'));
  certs.push(require('./certs/_ehc8331.json'));
  certs.push(require('./certs/_ehc8332.json'));
  certs.push(require('./certs/_ehc8350.json'));
  certs.push(require('./certs/_ehc8351.json'));
  certs.push(require('./certs/_ehc8361.json'));
  certs.push(require('./certs/_ehc8364.json'));
  certs.push(require('./certs/_ehc8367.json'));
  certs.push(require('./certs/_ehc8371.json'));

var establishments = require('./establishments.json')
var scheduleUploadProcessing = require('./schedule-upload-processing.json')
module.exports = {
  "certificates" : certs,
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
