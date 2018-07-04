const router = require('express').Router();
const Note = require('../models/notesModel');
const User = require('../models/userModel');
const authenticated = require('../middleware/RouteProtection');

router
    .route('/')
    .post(authenticated, async (req, res) => {
        const { userid, title, body } = req.body
        if (userid === undefined || title === undefined || body === undefined) {
            res.status(400).json({ error: 'Please provide a title & a description for your new Note' })
        } else {
            const note = await Note.create(req.body)
            try {
                await User.findByIdAndUpdate(userid, { $push: { notes: note._id } }, { new: true })
            }
            catch (e) {
                res.status(500).json({ error: e.message })
            }
            res.status(201).json(note)
        }

    })
    .put(authenticated, (req, res) => {
        const { title, body, id } = req.body
        if (title === undefined || body === undefined || id === undefined) {
            return res.status(400).json({ error: 'Please include all needed fields' })
        } else {
            const update = { title, body }

            Note.findByIdAndUpdate(id, update, { new: true })
                .then(note => res.status(201).json(note))
                .catch(err => res.status(500).json(err))
        }
    })

router.post('/all', authenticated, (req, res) => {
    const { userid } = req.body
    if (userid === undefined) res.status(400)
    Note.find({ userid: userid })
        .then(notes => res.status(200).json(notes))
        .catch(err => res.status(500).json({ error: err.message }))
})

router.delete('/:id', authenticated, async (req, res) => {
    const { id } = req.params
    if (id === undefined) res.status(400).json({ error: 'Please provide an ID' })

    const note = await Note.findByIdAndRemove(id)
    if (note === null) return res.status(404).json({ error: 'Note not found!' })
    User.findByIdAndUpdate(note.userid, { $pull: { notes: id } }, { new: true })
        .then(user => res.status(200).json(user))
        .catch(err => res.status(404).json({ error: 'Note not found' }))

})


module.exports = router;