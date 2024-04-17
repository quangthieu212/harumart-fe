
export interface UserSalary {
    userId: number;
    fullName: string;
    commission: number;
    points: number;
    sub_Member_Count: number;
    bank_Number: string;
    phone: string;
    userSub: Array<UserSalary>;
}

export interface Commission {
    userSalaries: Array<UserSalary>;
    commissionRetail: number;
    commissionGroup: number;
    points: number;
}
export interface CommissionRequest {
    userId: number;
    start: string;
    end: string;
}

