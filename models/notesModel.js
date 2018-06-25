const mongoose = require('mongoose');
const { Schema } = mongoose
const { ObjectId } = Schema.Types

const NotesModel = new Schema({
    title: {
        type: String,
        required: true,
        maxlength: 50
    },
    body: {
        type: String,
        required: true
    },
    userid: {
        type: ObjectId,
        ref: 'User',
        required: true
    }
})

module.exports = mongoose.model('Note', NotesModel)