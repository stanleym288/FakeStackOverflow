// Answer Document Schema
const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    ans_by: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    ans_date_time: {
        type: Date,
        default: Date.now
    },
    comments: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment',
            required: true,
        }],
    },
    votes: {
        type: Number,
        default: 0,
    }
})

answerSchema.virtual('url').get(function() {
    return 'posts/answer/' + this._id;
})

module.exports = mongoose.model('Answer', answerSchema);