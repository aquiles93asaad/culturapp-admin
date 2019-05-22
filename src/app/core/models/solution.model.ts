import { User } from './user.model';

export interface Solution {
    _id?: string,
    name: string,
    description?: string,
    hoursSmall?: number,
    hoursMedium?: number,
    hoursBig?: number,
    documentClassesCount?: number,
    questions?: [{
        label: string,
        dataType: string
    }],
    isGeneric?: boolean,
    createdAt?: Date,
    createdBy?: User,
    modifiedAt?: Date,
    modifiedBy?: User,
}