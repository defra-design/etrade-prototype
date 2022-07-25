const express = require('express')
const router = express.Router()

// Add your routes here - above the module.exports line
require('./routes/prodcredentials')(router)
require('./routes/applications')(router)


module.exports = router
