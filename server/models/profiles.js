const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true},
    password: { type: String, required: true},
    email: { type: String, required: true},
    reputation: { type: Number, default: 50},
    account: {type: String, default: "user"},
    created_date_time: {type: Date, default: Date.now},
});

module.exports = mongoose.model('User', UserSchema);