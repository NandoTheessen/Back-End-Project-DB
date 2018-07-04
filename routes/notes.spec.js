const User = require('../models/userModel');
const Note = require('../models/notesModel');
const request = require('supertest');
const server = require('../server');


describe('notes route', () => {

    beforeAll(async () => {
        const user = await User.create({ username: 'aoisdjfoaidjsf', password: 'asdjfoaisjdf' })
        await Note.create({ body: 'aosidjfoaisjdf', title: 'foaisdjfoias', userid: user._id })
    })
    afterAll(async () => {
        await Note.remove()
        await User.remove()
    })

    it('returns status 403 if we try to access any endpoint without a valid JWT token', async () => {
        let failedRequest = await request(server).post('/api/notes/').send({})
        expect(failedRequest.status).toBe(403)
    })

    // it('return')
});