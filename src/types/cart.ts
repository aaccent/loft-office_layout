export interface Product {
    id: string | number
    title: string
    img: string
    size: string
    color: string
    totalPrice: number
    discountPrice?: number
    pricePerItem: number
    stock?: number
    amount: number
}

export interface CartInfo {
    totalPrice?: number
    discountPrice?: number
    deliveryPrice?: string
    weight?: number
}
