export interface ReceiveItem {
    id: number | string
    address: string
    price: number
    date: string
    coords: [number, number]
}

export interface FinalDeliveryInfo {
    type: string
    popup: 'courier' | 'points' | 'store'
    address: string
    extra?: string
}
