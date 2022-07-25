const { generateRandomString } = require('../utils/helpers')

module.exports = router => {
  router.all([
    '/account/production-credentials/production-credentials/:id',
    '/account/production-credentials/production-credentials/:id/*',    
    
  ], (req, res, next) => {
    const data = req.session.data
    res.locals.id = req.params.id
    res.locals.credential = data.credentials && data.credentials[req.params.id]
    next()
  })

  

}
