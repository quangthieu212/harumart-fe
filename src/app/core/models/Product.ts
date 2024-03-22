/* eslint-disable @typescript-eslint/naming-convention */
import { ModelBase } from './ModelBase';

export enum ProductStatus {
    ACTIVE = 'ACTIVE',
    DRAFT = 'DRAFT'
}

export interface ProductAttribute {
    code: string;
    value: string;
}

export interface Product {
    id: string;
    name: string;
    code: string;
    barcode?: string;

    price: number;
    finalPrice?: number;
    sellingPrice: number;
    categoryId?: string;
    categoryOdooId?: number;
    odooId?: string;
    productTmplId?: number;
    productWarehouseOdoo?: ProductWarehouseOdoo;

    qrCodeId?: string;
    description: string;
    details: string;
    imageUrl?: string;
    status: string;

    productCategoryOdoo?: ProductCategoryOdoo;
    productProducerOdoo?: ProductProducerOdoo;
    productImageOdoo: Array<ProductImageOdoo>;
    productTempImage: Array<string>;
    attributesOdoosLst?: Array<ProductAttributesOdoo>;

    qtyAvailable?: number;


    referrerPhoneNumber?: string;
    referrerAddress?: string;
    referrerName?: string;

    ratingAverage?: number;
    bought?: number;
    agentPointOdoo?: string;
    partnerPointOdoo?: string;
    partnerDiscountOdoo: number;
    agentDiscountOdoo: number;
}

export class ProductCategoryOdoo {
    categoryId: number;
    name: string;
    parentPath?: string;
}

export class ProductProducerOdoo {
    producerId: number;
    name: string;
}

export class ProductWarehouseOdoo {
    warehouseId: number;
    warehouseName: string;
}

export class ProductAttributesOdoo {
    attributeId: number;
    name: string;
    value: Array<ProductAttributesOdooValue>;
}
export class ProductAttributesOdooValue {
    id: string;
    name: string;
}

export class ProductImageOdoo {
    id: number;
    image: string;
}

// export class ProductAttribute {
//     code: string;
//     name: string;
//     value: string;
//     status: string;
// }

// export class ProductImage {
//     src: string;
//     position: number;
// }

// export class ProductAccumulatedPoints {
//     point: number;
//     applyFor: string;
// }

export class ProductSearchFilter {
    pageNumber: number;
    pageSize: number;
    categoryId?: string;
    priceFromValue?: number;
    priceToValue?: number;
    unitId?: string;
    producer?: string;
}
