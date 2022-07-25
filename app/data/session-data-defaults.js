/*

Provide default values for user session data. This may be useful for
testing journeys where users are returning to an existing application.

For more information about passing data from page to page:
https://govuk-prototype-kit.herokuapp.com/docs/examples/pass-data

Example usage:

"full-name": "Sarah Philips",

"options-chosen": [ "foo", "bar" ]

*/



module.exports = {
  
  applications: {
    ME1: { name: 'Bird', apis: "Export application" , redirectURI: "exampleTest.com", production: "No" },
    GH3: { name: 'Magic', apis: "Export application" , redirectURI: "exampleTest.com", production: "No" },
    JH2: { name: 'Curry', apis: "Export application" , redirectURI: "exampleTest.com", production: "No" },
    LK9: { name: 'Chamberlain', apis: "Export application" , redirectURI: "exampleTest.com", production: "No" },
    NB7: { name: 'LeBron', apis: "Export application" , redirectURI: "exampleTest.com", production: "No" },    
    SA1: { name: 'Jordan', apis: "Export application" , redirectURI: "exampleTest.com", production: "No" },
    DF9: { name: 'Pippen', apis: "Export application" , redirectURI: "exampleTest.com", production: "No" },
    JR6: { name: 'Bryant', apis: "Export application" , redirectURI: "exampleTest.com", production: "No" },
    OQ4: { name: 'Erving', apis: "Export application" , redirectURI: "exampleTest.com", production: "No" },
    PL7: { name: 'Rodman', apis: "Export application" , redirectURI: "exampleTest.com", production: "No" }
  }

}
