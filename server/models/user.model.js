const mongoose = require('mongoose'),
      Schema = mongoose.Schema;

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        // Regexp to validate emails with more strict rules as added in tests/users.js which also conforms mostly with RFC2822 guide lines
        match: [/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'Please enter a valid email'],
    },
    documentId: {
        type: String,
        unique: true,
        required: true
    },
    hashedPassword: {
        type: String,
        required: true
    },
    phone: {
        type: String
    },
    userCompany: {
        type: Schema.Types.ObjectId,
        ref: 'Company'
    },
    supervisor: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    roles: {
        type: [String],
        required: true,
        validate: v => v == null || v.length > 0
    },
    profiles: {
        type: [String],
        required: true,
        validate: v => v == null || v.length > 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    modifiedAt: {
        type: Date
    },
    modifiedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
}, {
        versionKey: false
    });


module.exports = mongoose.model('User', UserSchema);
