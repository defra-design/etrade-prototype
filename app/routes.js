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

router.get('/account', (req, res) => {
    res.redirect('/account/view-apps')
})

router.post('/account/add-team-members', (req, res) => {
    var addAnother = req.session.data['add-another']
    var pageActionText
    if(addAnother == 'yes') {
        pageActionText = "Invite"
    } else {
        pageActionText = "Review"
    }
    console.log(pageActionText)
    res.render('account/create-sandbox-app-team', {pageActionText: pageActionText})
})

router.get('/account/add-team-members', (req, res) => {
    
});

