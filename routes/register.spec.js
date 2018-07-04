const request = require('supertest');
const server = require('../server');

describe('register route', () => {
    
    it('should return status 400 if presented with malformed data', async () => {
        let failedRequest = await request(server).post('/api/register').send({})
        expect(failedRequest.status).toBe(400)
    })

    it('should return status 201 + JWT token + userid if presented with correct data data', async () => {
        let newUser = await request(server).post('/api/register').send({ "username": "Ashur", "password": "paspdpasdp" })
        expect(newUser.status).toBe(201)
        expect(newUser.text).toMatch(/token/)
    })

})