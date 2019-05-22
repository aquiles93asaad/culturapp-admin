const mongoose = require('mongoose'),
      Schema = mongoose.Schema;

const ConstantsSchema = new mongoose.Schema({
    thubanLicense: {
        type: Number
    },
    capitkaLicense: {
        type: Number
    },
    thubanMaintenance: {
        type: Number
    },
    captikaMaintenance: {
        type: Number
    },
    hourValue: {
        type: Number
    },
    docTypeHours: {
        type: Number
    },
    autoRecognitionDocHours: {
        type: Number
    },
    documentClassHours: {
        type: Number
    },
    documentClassFieldHours: {
        type: Number
    },
    wokflowHours: {
        type: Number
    },
    wokflowStatesHours: {
        type: Number
    },
    monitorHours: {
        type: Number
    },
    groupsHours: {
        type: Number
    },
    installation: {
        type: Number
    },
    analisis: {
        type: Number
    },
    adminsTraining: {
        type: Number
    },
    scriptingPercentaje: {
        type: Number
    },
    secondPrototypePercentaje: {
        type: Number
    },
    thirdPrototypePercentaje: {
        type: Number
    },
    isActive: {
        type: Boolean
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

module.exports = mongoose.model('Constants', ConstantsSchema);
