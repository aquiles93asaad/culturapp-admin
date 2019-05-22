const mongoose = require('mongoose'),
      Schema = mongoose.Schema;

const DemoSchema = new mongoose.Schema({
    demoType: {
        type: String,
        required: true,
    },
    chosenGenericDemos: {
        type: [Schema.Types.ObjectId],
        ref: 'GenericDemo'
    },
    description: {
        type: String
    },
    workflowFile: {
        data: Buffer,
        contentType: String
    },
    possibleDate_1: {
        type: Date
    },
    possibleDate_2: {
        type: Date
    },
    possibleDate_3: {
        type: Date
    },
    selectedDate: {
        type: Date
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

module.exports = mongoose.model('Demo', DemoSchema);
