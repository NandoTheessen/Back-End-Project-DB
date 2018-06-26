const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const loginRoute = require('./routes/login');
const registerRoute = require('./routes/register');
const notesRoute = require('./routes/notes');
const mongoose = require('mongoose');
const server = express()
const PORT = process.env.PORT || 5000;




server.use(express.json())
server.use(morgan('combined'))
server.use(cors({
    origin: true,
    credentials: true
}))
server.use('/api/login', loginRoute)
server.use('/api/register', registerRoute)
server.use('/api/notes', notesRoute)

// routes(server);
mongoose
    .connect('mongodb://dbuser:Hallo1234!@ds113915.mlab.com:13915/notes')
    .then(() => console.log('connected to production database'))
    .catch(() => console.log('error connecting to production database'))

server.listen(PORT, () => {
    console.log(`Magic happening on port ${PORT}`);
})

module.exports = server;