const express = require('express')
const router = express.Router()

// Add your routes here - above the module.exports line

module.exports = router

// Catch any missed renames
// router.get('/homepage-v2', (req, res) => {
//     res.redirect('homepage');
// });

router.get('/api-step-by-step/introduction', (req, res) => {
    res.redirect('/documentation/introduction');
})

// router.get('/account', (req, res) => {
//     res.redirect('/account/view-apps')
// })

// router.get('/account/add-team-members', (req, res) => {
//     res.render('account/team', {pageActionText: 'Review'})
// })

// router.post('/account/add-team-members', (req, res) => {
//     var addAnother = req.session.data['add-another']
//     var pageActionText = 'Review'
//     if(addAnother == 'yes') {
//         pageActionText = "Invite"
//     } else {
//         pageActionText = "Review"
//     }
//     res.render('account/team', {pageActionText: pageActionText})
// })

// router.get('/account/add-team-members', (req, res) => {
    
// });

