const express = require('express')
const router = express.Router()
// Use radio redirect feature to reduce reliance on routes. https://github.com/abbott567/radio-button-redirect
const radioButtonRedirect = require('radio-button-redirect')
router.use(radioButtonRedirect)

// Add your routes here - above the module.exports line
// version 2
require('./views/beta/v2/routes.js')(router);
// version 2.1
require('./views/beta/v2-1/routes.js')(router);
require('./views/beta/v2-1/application/export/upload/routes.js')(router);
// version 2.2
require('./views/beta/v2-2/routes.js')(router);
require('./views/beta/v2-2/application/export/upload/routes.js')(router);
// version 2.3
require('./views/beta/v2-3/routes.js')(router);
require('./views/beta/v2-3/application/export/upload/routes.js')(router);
// version 2.4
require('./views/beta/v2-4/routes.js')(router);
require('./views/beta/v2-4/application/export/upload/routes.js')(router);
require('./views/beta/v2-4/write-excel/routes.js')(router);
// version 3
require('./views/beta/v3/routes.js')(router);
require('./views/beta/v3/application/export/upload/routes.js')(router);
require('./views/beta/v3/write-excel/routes.js')(router);
require('./views/beta/v3/application/routes.js')(router);
// version 3.1
require('./views/beta/v3-1/routes.js')(router);
require('./views/beta/v3-1/application/export/upload/routes.js')(router);
require('./views/beta/v3-1/write-excel/routes.js')(router);
require('./views/beta/v3-1/application/routes.js')(router);
// version 3.2
require('./views/beta/v3-2/routes.js')(router);
require('./views/beta/v3-2/application/export/upload/routes.js')(router);
require('./views/beta/v3-2/write-excel/routes.js')(router);
require('./views/beta/v3-2/application/routes.js')(router);
// experimental and other stories
require('./views/experimental/routes.js')(router);
require('./views/stories/routes.js')(router);
require('./views/stories/file-import/routes.js')(router);
require('./views/stories/file-import/read-excel/routes.js')(router);
require('./views/tools/routes.js')(router);

module.exports = router

//global function to clear all data before redirecting to another page
// use <a href="/clear-data?url=/folder/feature/page.html"
router.get('/clear-data', function(req, res) {
  req.session.data = {}
  return res.redirect(301, req.query.url);
})

// Adding "query" to every page. This is a bit of a hack may look at different inplementation.
// in nunjkucks you can call {{query[key]}}

router.get('*', function(req, res) {
  let path = req.params[0]
  let pathEnd = path.slice(-1)
  let newPath = path.substring(1)

  if (path == "/") {
    // top home page
    path = "index"
  } else if (pathEnd == "/") {
    // Check if this is the route folder in which case the page to render is index
    path = newPath + "index"
  } else {
    path = newPath
  }
  res.render(path, {
    "query": req.query,
  });
})
