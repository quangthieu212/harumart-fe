/* eslint-disable @typescript-eslint/naming-convention */
import { Address } from './Address';
import { Product, ProductImageOdoo } from './Product';

export enum OrderStatus {
    DRAFT = 'draft', //Đơn hàng vừa tạo
    PENDING = 'pending', // - Chờ xác nhận
    SALE = 'sale',
    CONFIRMED = 'confirmed', // - Chờ giao - đã xác nhận
    DELIVERING = 'delivering', // - Đang giao
    DELIVERED = 'delivered', // - Đã giao
    PAID = 'paid',// Đã thanh toán
    CANCELED = 'canceled', // Đã huỷ
    DONE = 'done', // - Hoàn thành
}

export interface Orders {
    product: Product;
    orderDate: Date;
    id: string;
    amount: number;
    deliveryDate: Date;
    status: string;
    shippingAddress: Address;
    tax: number;
}

export interface OrderRequest {
    userId: number;
    partnerId?: number;
    state: string;
    dateOrder: Date;
    requireSignature: boolean;
    requirePayment: boolean;
    createDate: Date;
    amountUntaxed: number;
    amountTax: number;
    amountTotal: number;
    saleOrderLine: Array<OrderLineRequest>;
    warehouseId: number;
    ApplyCoupon?: any[];
    pay_discount_type?: string;
    pay_ship_type?: string;
    ship_partner?: string;
    amount_delivery?: number;
}

export interface OrderLineRequest {
    name: string;
    product_uom_qty: number;
    priceUnit: number;
    priceSubtotal: number;
    priceTax: number;
    priceTotal: number;
    priceReduce: number;
    priceReduceTaxinc: number;
    priceReduceTaxexcl: number;
    discount: number;
    uom: number;
    quantity: number;
    productId: number;
    productTmplId: number;
    product: {uomId: number};
    partnerDiscountOdoo: number;
    agentDiscountOdoo: number;
    agentPointOdoo?: string;
    partnerPointOdoo?: string;
    note?: string;
}

export interface SaleOrder {
    id: number;
    name: string;
    state: string;
    dateOrder: Date;
    amountTotal: number;
    totalDiscount: number;
    deliveryDate: Date;
    status: string;
    amount_delivery: number;
    agent_partner_discount: number;
    shippingAddress: Address;
    displayName: string;
    phone: string;
    pay_discount_type: string;
    pay_ship_type: string;
    ship_partner: string;
    payment: string;
    orderLines: Array<OrderLine>;
}

export interface OrderLine {
    id: number;
    name: string;
    productId: number;
    quantity: number;
    priceUnit?: number;
    priceTax?: number;
    priceSubtotal: number;
    priceTotal: number;
    discount: number;
    productImageOdoo?: Array<ProductImageOdoo>;
    state: string;
    note?: string;
}

