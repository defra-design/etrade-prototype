const { generateRandomString } = require('../utils/helpers')

module.exports = router => {
  router.all([
    '/account/applications/sandbox/:id',
    '/account/applications/sandbox/:id/*',    
    
  ], (req, res, next) => {
    const data = req.session.data
    res.locals.id = req.params.id
    res.locals.sandbox = data.sandboxes && data.sandboxes[req.params.id]
    next()
  })

  
  // Generates new application ID for a sandbox
  router.all('/account/applications/sandbox/add/', (req, res) => {
    res.redirect(`/account/applications/sandbox/${generateRandomString()}/add/name`)
  })

}
