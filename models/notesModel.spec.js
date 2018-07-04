const Note = require('./notesModel');
const User = require('./userModel')
const mongoose = require('mongoose');

describe('Notes Model', () => {
    const exampleNote = {
        title: 'This is an awesome Note',
        body: 'This is an awesome body of an awesome Note',
        userid: {}
    }

    beforeAll(() => {
        return mongoose
            .connect('mongodb://localhost/notes-tests')
            .then(() => console.log('\n=== connected to TEST DB ==='))
    })
    afterAll(() => {
        return mongoose
            .disconnect()
            .then(() => console.log('\n=== disconnected from TEST DB ==='))
    })
    beforeEach(async () => {
        const user = await User.create({
            username: 'Peter',
            password: 'KlausPeter'
        })
        const note = await Note.create({
            title: 'This is an awesome Note',
            body: 'This is an awesome body of an awesome Note',
            userid: user._id
        })
    })
    afterEach(async () => {
        await Note.remove()
        await User.remove()
    })

    it('Creates a Note in the database provided with a title, a body and a userId', async () => {
        const notes = await Note.find({})

        expect(notes[0]).toHaveProperty('title', 'This is an awesome Note')
        expect(notes[0]).toHaveProperty('body', 'This is an awesome body of an awesome Note')
        expect(notes[0]).toHaveProperty('userid')
    })

    it('Throws an error if either title, body or userid are missing', async () => {
        let error
        try {
            await Note.create({})
        } catch (e) {
            error = e
        }
        expect(error.errors).toBeTruthy()
    })
});


