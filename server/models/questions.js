// Question Document Schema
const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        maxLength: 100
    },
    text: {
        type: String,
        required: true
    },
    tags: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Tag',
            required: true,
        }],
        validate: [minTags, 'At least one tag is required']
    }, 
    answers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Answer'
    }],
    asked_by: {
        type: String,
        default: 'Anonymous'
    },
    email: {
        type: String,
        required: true,
    },
    asked_date_time: {
        type: Date,
        default: Date.now
    },
    views: {
        type: Number,
        default: 0
    },
    votes: {
        type: Number,
        default: 0
    },
    summary: {
        type: String,
        maxLength: 140
    },
    comments: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment',
            required: true,
        }],
    }
})

function minTags(val) {
    return val.length >= 1;
}

questionSchema.virtual('url').get(function() {
    return 'posts/question/' + this._id;
})

module.exports = mongoose.model('Question', questionSchema);