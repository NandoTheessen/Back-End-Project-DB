const jwt = require('jsonwebtoken');
const mySecret = process.env.mysecret || 'aosdjfoasdjif'

const authenticate = (req, res, next) => {
    const token = req.get('Authorization');
    if (token) {
        jwt.verify(token, mySecret, (err, decoded) => {
            if (err) return res.status(500).json(err)
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