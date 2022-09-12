const { generateRandomString } = require('../utils/helpers')

module.exports = router => {
  router.all([
    '/account/applications/:id',
    '/account/applications/:id/*',    
    '/account/applications/sandbox/:id',
    '/account/applications/sandbox/:id/*',    
    '/account/applications/production-credentials/:id',
    '/account/applications/production-credentials/:id/*',    
    
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

  // Generates new application ID for an application in sandbox which is default
  router.all('/account/applications/sandbox/add', (req, res) => {
    res.redirect(`/account/applications/sandbox/${generateRandomString()}/add/name`)
  })

  router.all('/account/applications/sandbox/:id/add/:view', (req, res, next) => {        
    res.render(`account/applications/sandbox/add/${req.params.view}`)    
  })

  // User validation
  router.all('/account/applications', (req, res, next) => {
    const applications = req.session.data.applications
    res.locals.hasAnyApps = Object.values(applications).some((p) => p.name !== '' )
    next()
  })


  // Details page for an application
  router.all('/account/applications/:id', (req, res) => {
    res.render('account/applications/details')
  })

  router.all('/account/applications/:id/details/:view', (req, res) => {
    res.render(`account/applications/details/${req.params.view}`)
  })

  // Delete application
  router.all('/account/applications/:id/delete/', (req, res) => {
    res.render('account/applications/delete/index')    
  })

  router.all('/account/applications/:id/delete/:view', (req, res) => {
    res.render(`account/applications/delete/${req.params.view}`)
  })


  // Add redirect
  router.all('/account/applications/:id/redirects/', (req, res) => {
    res.render('account/applications/redirects/index')    
  })

  router.all('/account/applications/:id/redirects/:view', (req, res) => {
    res.render(`account/applications/redirects/${req.params.view}`)
  })
  


  // Add client secret
  router.all('/account/applications/:id/client-secret/', (req, res) => {
    res.render('account/applications/client-secret/index')    
  })

  router.all('/account/applications/:id/client-secret/:view', (req, res) => {
    res.render(`account/applications/client-secret/${req.params.view}`)
  })


  // Apply for product credentials
  router.all('/account/applications/:id/production-credentials/', (req, res) => {
    res.render('account/applications/production-credentials/index')
  })

  router.all('/account/applications/:id/production-credentials/:view', (req, res) => {
    res.render(`account/applications/production-credentials/${req.params.view}`)
  })








}
