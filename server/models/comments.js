// Comments Document Schema
const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
        maxLength: 140
    },
    com_by: {
        type: String,
        required: true,
        default: 'Anonymous'
    },
    email: {
        type: String,
        required: true
    },
    com_date_time: {
        type: Date,
        default: Date.now
    },
    votes: {
        type: Number,
        default: 0
    }
})

commentSchema.virtual('url').get(function() {
    return 'posts/comment/' + this._id;
})

module.exports = mongoose.model('Comment', commentSchema);