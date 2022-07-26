const { generateRandomString } = require('../utils/helpers')

module.exports = router => {
  router.all([
    '/account/applications/sandbox/:id',
    '/account/applications/sandbox/:id/*',    
    
  ], (req, res, next) => {
    const data = req.session.data
    res.locals.id = req.params.id
    res.locals.application = data.applications && data.applications[req.params.id]
    next()
  })
  
  router.all('/account/applications/sandbox', (req, res, next) => {
    const sandboxApps = req.session.data.sandboxApps
    next()
  })

  // Generates new application ID for a sandbox
  router.all('/account/applications/sandbox/add', (req, res) => {
    res.redirect(`/account/applications/sandbox/${generateRandomString()}/add/name`)
  })

  router.all('/account/applications/sandbox/:id/add/:view', (req, res, next) => {    
    // console.log(sandboxApps)
    // console.log(Object.values(sandboxApps))
    res.render(`account/applications/sandbox/add/${req.params.view}`)    
  })


  // List out applications
  // router.all('/account/applications', (req, res, next) => {
  //   const applications = req.session.data.applications
  //   res.locals.hasAnyApps = Object.values(applications).some((p) => p.status === 'Contacted' )
  //   next()
  // })


  // User validation
  router.all('/account/applications', (req, res, next) => {
    const applications = req.session.data.applications
    res.locals.hasAnyContacted = Object.values(applications).some((p) => p.status === 'Contacted' )
    next()
  })



}
