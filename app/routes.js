const express = require('express')
const router = express.Router()

// Add your routes here - above the module.exports line

module.exports = router

// Catch any missed renames
router.get('/homepage-v2', (req, res) => {
    res.redirect('homepage');
});

router.get('/api-step-by-step/introduction', (req, res) => {
    res.redirect('/documentation/introduction');
})

router.get('/account/add-team-members', (req, res) => {
    var addAnother = req.session.data['add-another']
    res.redirect('create-sandbox-app-team');
    // if(addAnother == "yes") {
    //     res.redirect('create-sandbox-review-team');
    // } else {
    //     res.redirect('create-sandbox-invite-team');
    // }
});