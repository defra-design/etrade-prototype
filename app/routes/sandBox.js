const { generateRandomString } = require('../utils/helpers')

module.exports = router => {
  router.all([
    '/account/applications/sandbox/:id',
    '/account/applications/sandbox/:id/*',    
    
  ], (req, res, next) => {
    const data = req.session.data
    res.locals.id = req.params.id
    res.locals.sandbox = data.sandboxs && data.sandboxs[req.params.id]
    next()
  })

  

}
