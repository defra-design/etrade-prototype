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
    ME1: { 
      name: 'Bird', 
      apis: "Export application" , 
      redirectURI: "larrybird.test.com", 
      production: "No", 
      status: 'Contacted' 
    },
    GH3: { 
      name: 'Magic', 
      apis: "Fish Export Service (FES)" , 
      redirectURI: "magicjohnson.test.com", 
      production: "Yes", 
      status: 'Contacted' 
    },
    JH2: { 
      name: 'Curry', 
      apis: "Import of products, animals, food and feed system" , 
      redirectURI: "stephcurry.test.com", 
      production: "Yes", 
      status: 'Contacted' 
    },
    LK9: { 
      name: 'Chamberlain', 
      apis: "Export application" , 
      redirectURI: "willchamberlain.test.com", 
      production: "No", 
      status: 'Contacted' 
    },
    NB7: { 
      name: 'LeBron', 
      apis: "Import of products, animals, food and feed systemn" , 
      redirectURI: "lebronhames.test.com", 
      production: "No", 
      status: 'Contacted' },  

    SA1: { 
      name: 'Jordan', 
      apis: "Export application, Import of products, animals, food and feed system" , 
      redirectURI: "michaeljordan.test.com", 
      production: "No", 
      status: 'Contacted' 
    },
    DF9: { 
      name: 'Pippen', 
      apis: "Export application" , 
      redirectURI: "scottiepippen.test.com", 
      production: "Yes", 
      status: 'Contacted' 
    },
    JR6: { 
      name: 'Bryant', 
      apis: "Fish Export Service (FES)n" , 
      redirectURI: "kobbryant.test.com", 
      production: "No", 
      status: 'Contacted' 
    },
    OQ4: { 
      name: 'Erving', 
      apis: "Fish Export Service (FES)" , 
      redirectURI: "juliuserving.test.com", 
      production: "Yes", 
      status: 'Contacted' 
    },
    PL7: { 
      name: 'Rodman', 
      apis: "Import of products, animals, food and feed system" , 
      redirectURI: "dennisrodman.test.com", 
      production: "No", 
      status: 'Contacted'
     }
  }

}
