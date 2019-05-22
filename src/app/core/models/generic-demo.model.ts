import { User } from './user.model';

export interface GenericDemo {
    _id?: string,
    name: string,
    description: string,
    createdAt: Date,
    createdBy: User,
    modifiedAt: Date,
    modifiedBy: User,
}