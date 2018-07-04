const server = require('../server');
const mongoose = require('mongoose');
const request = require('supertest');
const User = require('../models/userModel');

describe('login routes', () => {

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
        await User.create({
            username: 'Martyn',
            password: 'KlausPeter'
        })
    })
    afterEach(async () => {
        await User.remove()
    })

    it('returns a 400 if PW or username are missing', async () => {
        let response = await request(server).post('/api/login')
        expect(response.status).toBe(400)
    })

    it('returns a 200 if PW and username are correct', async () => {
        let login = await request(server).post('/api/login').send({ "username": 'Martyn', "password": 'KlausPeter' })
        expect(login.status).toBe(200)
    })

    it('returns a JWT token if succesfully authenticated', () => {

        request(server).post('/api/login').send({ "username": 'Martyn', "password": 'KlausPeter' })
            .then(response => {
                expect(response.status).toBe(200)
                expect(response.data).toHaveProperty('token')
            })
            .catch(err => console.log(err))
    })

    it('returns a status 400 if presented with wrong password', async () => {
        let wrongLogin = await request(server).post('/api/login').send({ username: 'Martyn', password: '12345132412341234123412346' })
        expect(wrongLogin.status).toBe(400)
    })

});