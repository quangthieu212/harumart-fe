export interface UserDiscount {
    total: number;
    points: Array<UserDiscountItem>;
}

export interface UserDiscountItem {
    id: number;
    amount: number;
    orderId: number;
    orderName: string;
    userId: number;
    type?: string;
    createDate: Date;
}
