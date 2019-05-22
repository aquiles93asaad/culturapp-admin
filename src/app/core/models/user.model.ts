export interface User {
    _id?: string;
    password?: string;
    name: string;
    lastName: string,
    email: string;
    documentId: string,
    phone: string,
    userCompany: any,
    roles: string[],
    profiles: string[],
    createdAt: Date,
    createdBy: string,
    modifiedAt: Date,
    modifiedBy: string,
    supervisor: string
}
