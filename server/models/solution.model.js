const mongoose = require('mongoose'),
      Schema = mongoose.Schema;

const SolutionSchema = new mongoose.Schema({
    name: {
        type: String
    },
    description: {
        type: String
    },
    hoursSmall: {
        type: Number
    },
    hoursMedium: {
        type: Number
    },
    hoursBig: {
        type: Number
    },
    documentClassesCount: {
        type: Number
    },
    questions: [{
        label: String,
        dataType: String
    }],
    isGeneric: {
        type: Boolean,
        default: true
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


module.exports = mongoose.model('Solution', SolutionSchema);
