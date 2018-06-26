const jwt = require('jsonwebtoken');
const mysecret = require('../config');

const authenticate = (req, res, next) => {
    const token = req.get('Authorization');
    if (token) {
        jwt.verify(token, mysecret, (err, decoded) => {
            if (err) return res.status(422).json(err)
            req.decoded = decoded;
            next();
        })
    } else {
        return res.status(403).json({
            error: 'No token provided!'
        })
    }
}

module.exports = authenticate