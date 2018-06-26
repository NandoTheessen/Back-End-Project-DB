const router = require('express').Router();
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

router.post('/', (req, res) => {
    const { username, password } = req.body

    username === undefined || password === undefined ? res.status(400).json({ error: 'please provide a username and a password' }) : null
    if (password.length <= 5) res.status(400).json({ error: 'Please chose a PW longer than 5 characters' })

    User.create(req.body)
        .then(user => {

            const payload = { username: user.username }
            const token = jwt.sign(payload, process.env.mysecret)
            res.status(201).json({ userid: user._id, notes: user.notes, token })
        })
        .catch(err => console.log(err))
})

module.exports = router;