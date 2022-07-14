const express = require('express')
const router = express.Router()

// Add your routes here - above the module.exports line
require('./routes/apiCredentials')(router)
require('./routes/sandBox')(router)


module.exports = router
