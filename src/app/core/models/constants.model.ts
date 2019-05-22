import { User } from './user.model';

export interface Constants {
    _id?: string,
    thubanLicense: number,
    capitkaLicense: number,
    thubanMaintenance: number,
    captikaMaintenance: number,
    hourValue: number,
    docTypeHours: number,
    autoRecognitionDocHours: number,
    documentClassHours: number,
    documentClassFieldHours: number,
    wokflowHours: number,
    wokflowStatesHours: number,
    monitorHours: number,
    groupsHours: number,
    installation: number,
    analisis: number,
    adminsTraining: number,
    scriptingPercentaje: number,
    secondPrototypePercentaje: number,
    thirdPrototypePercentaje: number,
    isActive: boolean,
    createdAt: Date,
    createdBy: User,
    modifiedAt: Date,
    modifiedBy: User
}