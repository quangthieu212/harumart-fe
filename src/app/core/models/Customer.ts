export interface Customer {
    id?: string;
    name: string;
    displayName: string;
    email?: string;
    gender?: string;
    nationalId?: string;
    dateOfBirth?: number;
    phone: string;
    street: string;
    street2: string;
    createDate: Date;
}

export interface CustomerFilter {
    pageNumber: number;
    pageSize: number;
}
export interface PartnerRequest {
    name: string;
    street: string;
    street2: string;
    countryId: number;
    stateId: number;
    phone: string;
    isCompany: boolean;
    isDefault: boolean;
}
