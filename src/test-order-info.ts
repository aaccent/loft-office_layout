import { AdditionalPriceInfo, OrderInfo } from '@/types/order'

const additionalPriceInfo: AdditionalPriceInfo[] = [
    {
        id: 6,
        title: 'скидка 15%',
        text: '— 1 250 ₽',
        type: 'discount',
    },

    {
        id: 7,
        title: 'промокод:',
        text: '— 500 ₽',
        type: 'discount',
    },

    {
        id: 8,
        title: 'дополнительная информация',
        text: 'текст',
        type: 'info',
    },
]

export const orderInfo: OrderInfo = {
    weight: 213,
    deliveryPrice: 250,
    totalPrice: 42000,
    additional: additionalPriceInfo,
}
