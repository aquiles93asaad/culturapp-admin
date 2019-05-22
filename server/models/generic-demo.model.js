const mongoose = require('mongoose'),
      Schema = mongoose.Schema;

const GenericDemoSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String
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

module.exports = mongoose.model('GenericDemo', GenericDemoSchema);
