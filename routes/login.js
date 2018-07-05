const router = require('express').Router();
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const mySecret = process.env.mysecret || 'aosdjfoasdjif'

router.post('/', (req, res) => {
    const { password, username } = req.body
    password === undefined || username === undefined ? res.status(400).json({ Error: 'Please provide a password and a username' }) : null
    console.log('firing');
    User.findOne({ username })
        .populate('notes', { _id: 0, title: 1, body: 1 })
        .then((user, err) => {
            err ? res.status(403).json({ error: 'Invalid usernamen' }) : null
            if (user) {
                user
                    .authenticate(password)
                    .then(passwordsMatch => {
                        if (passwordsMatch) {
                            const payload = {
                                username: user.username
                            };
                            const token = jwt.sign(payload, mySecret)
                            res.status(200).json({ userid: user._id, notes: user.notes, token })
                        } else {
                            res.status(400).json({ error: 'PW or Username do not match' })
                        }
                    })
                    .catch(err => res.status(500).json(err))
            } else {
                res.status(400).json({ error: 'no such user!' })
            }
        })
        .catch(err => res.status(500))
})

module.exports = router;