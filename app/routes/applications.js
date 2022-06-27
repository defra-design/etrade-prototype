const { generateRandomString } = require('../utils/helpers')

module.exports = router => {
  router.all([
    '/account/manage-applications/:id',
    '/account/manage-applications/:id/*'    
  ], (req, res, next) => {
    const data = req.session.data
    res.locals.id = req.params.id
    res.locals.sandapp = data.sandapps && data.sandapps[req.params.id]
    next()
  })


}
