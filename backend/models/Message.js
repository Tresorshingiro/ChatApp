const mongoose = require('mongoose')

const Schema = mongoose.Schema

const messageSchema = new Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    text: {
        type: String
    },
    image: {
        type: String
    },
    seen: {
        type: Boolean,
        default: false
    }
}, {timestamps: true});

module.exports = mongoose.model('Message', messageSchema)