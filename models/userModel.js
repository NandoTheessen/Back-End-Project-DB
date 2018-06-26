const mongoose = require('mongoose');
const { Schema } = mongoose
const bcrypt = require('bcrypt');
const { ObjectId } = Schema.Types

const userModel = new Schema({
    username: {
        type: String,
        unique: true,
        required: true,
        lowercase: true
    },
    password: {
        minlength: 6,
        type: String,
        required: true
    },
    notes: [{ type: ObjectId, ref: 'Note' }],
    age: {
        type: Number
    },
    facebook: {
        type: String
    },
    phone: {
        type: String,
        minlength: 12
    }
})

userModel.pre('save', async function (next) {
    const hash = await bcrypt.hash(this.password, 10)
    this.password = hash
    next()
})

userModel.methods.authenticate = function (password) {
    return bcrypt.compare(password, this.password)
}

userModel.methods.addNote = function (id) {
    this.notes.push(id)
}

module.exports = mongoose.model('User', userModel)