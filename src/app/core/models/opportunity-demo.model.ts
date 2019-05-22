import { Buffer } from 'buffer';
import { User } from './user.model';

export interface OpportunityDemo {
    _id?: string,
    demoType: string,
    chosenGenericDemos: string[],
    description: string,
    possibleDate_1: Date,
    possibleDate_2: Date,
    possibleDate_3: Date,
    selectedDate: Date
    workflowFile: {
        data: Buffer,
        contentType: String
    },
    createdAt: Date,
    createdBy: User,
    modifiedAt: Date,
    modifiedBy: User,
}