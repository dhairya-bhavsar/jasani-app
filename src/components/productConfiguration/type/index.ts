export interface IAvailableSections {
    path: string;
    defaultImage: string;
    top: string;
    left: string;
    detail_height: number;
    detail_width: number;
    height: number;
    width: number;
    id: string;
}

export interface IPricing {
    min_qty: string;
    max_qty: string;
    price_fixed_cost: string;
    price_per_unit_cost: string;
}

export interface IAvailableTechniques {
    techniqueName: string;
    availableSections: IAvailableSections[];
    isRecommended: boolean;
    maxColor: number;
    daysRequire: number;
    id: string;
    pricing: IPricing[]
}

export interface IProductDetail {
    name: string;
    price: number;
    sku: string;
    image: string;
    availableTechniques: IAvailableTechniques[]
}

export interface IProductProps {
    products: IProductDetail[];
}


export interface IProductInputProps {
    id: string;
}
