const User = require('../models/userModel');
const Note = require('../models/notesModel');
const request = require('supertest');
const server = require('../server');
let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im5hbmRvIiwiaWF0IjoxNTMwNzQ1NDIyfQ.o2qrjVBvP34QeiGoAPA6hBVLKEcAxun8ITTPBinQvVY"

describe('notes POST endpoint', () => {

    let user

    beforeAll(async () => {
        user = await User.create({ username: 'aoisdjfoaidjsf', password: 'asdjfoaisjdf' })
        note = await Note.create({ body: 'aosidjfoaisjdf', title: 'foaisdjfoias', userid: user._id })
    })

    afterAll(async () => {
        await Note.remove()
        await User.remove()
    })

    it('returns status 403 if we try to access any endpoint without a valid JWT token', async () => {
        let failedRequest = await request(server).post('/api/notes/').send({})
        expect(failedRequest.status).toBe(403)
    })

    it('returns an error if we pass malformed data', async () => {
        const newReq = await request(server).post('/api/notes').set({ Authorization: token }).send({})

        expect(newReq).toHaveProperty('error')
    })

    it('returns status 201, and the new Note when provided with valid data', async () => {
        const newNote = await request(server).post('/api/notes').set({ Authorization: token }).send({ body: 'asdfjasdf', title: 'aosdjfiasodf', userid: user._id })
        expect(newNote.text).toMatch(/title/)
        expect(newNote.text).toMatch(/body/)
        expect(newNote.status).toBe(201)
    })
});

describe('notes PUT endpoint', () => {
    let user
    let note


    beforeAll(async () => {
        user = await User.create({ username: 'aoisdjfoaidjsf', password: 'asdjfoaisjdf' })
        note = await Note.create({ body: 'aosidjfoaisjdf', title: 'foaisdjfoias', userid: user._id })
    })

    afterAll(async () => {
        await Note.remove()
        await User.remove()
    })

    it('returns status 403 if we try to access any endpoint without a valid JWT token', async () => {
        let failedRequest = await request(server).put('/api/notes/').send({})
        expect(failedRequest.status).toBe(403)
    })

    it('returns status 400 if data is missing from the request', async () => {
        let failedRequest = await request(server).put('/api/notes/').set({ Authorization: token }).send({})
        expect(failedRequest.status).toBe(400)
    })

    it('returns status 201 + changed note if data is valid', async () => {
        let failedRequest = await request(server).put('/api/notes/').set({ Authorization: token }).send({ id: note._id, title: '32419234091234', body: '109834091234012' })
        expect(failedRequest.status).toBe(201)
        expect(failedRequest.text).toMatch(/title/)
        expect(failedRequest.text).toMatch(/109834091234012/)
    })
});

describe('notes DELETE endpoint', () => {
    let user
    let note

    beforeAll(async () => {
        user = await User.create({ username: 'aoisdjfoaidjsf', password: 'asdjfoaisjdf' })
        note = await Note.create({ body: 'aosidjfoaisjdf', title: 'foaisdjfoias', userid: user._id })
    })

    afterAll(async () => {
        await Note.remove()
        await User.remove()
    })

    it('returns status 403 if we try to access any endpoint without a valid JWT token', async () => {
        let failedRequest = await request(server).delete('/api/notes/5b3d59044c135415bc29809f')
        expect(failedRequest.status).toBe(403)
    })

    it('returns status 404 if note does not exist', async () => {
        let failedRequest = await request(server).delete('/api/notes/5b3d59044c135415bc29809f').set({ Authorization: token })
        expect(failedRequest.status).toBe(404)
    })

    it('deletes note and returns it with status 200', async () => {
        let validRequest = await request(server).delete(`/api/notes/${note._id}`).set({ Authorization: token })
        expect(validRequest.status).toBe(200)
        expect(validRequest.text).toMatch(/username/)
        expect(validRequest.text).toMatch(/notes/)
        expect(validRequest.text).toMatch(/password/)
    })
});