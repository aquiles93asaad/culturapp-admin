import { User } from './user.model';

export interface Company {
    _id?: string,
    name: string,
    cuit: string,
    phone: string,
    webSite: string,
    address: string,
    industry: string,
    country: string,
    type: string,
    origin: string,
    employeesCount: number,
    anualBilling: number,
    hasStandard: boolean,
    branchesNumber: number,
    isClient: boolean,
    salesChannelOf: Company,
    users: User[],
    salesChannels: Company[],
    createdAt: Date,
    createdBy: string,
    modifieddAt: Date,
    modifieddBy: string,
}