export interface AdditionalPriceInfo {
    id: number | string
    title: string
    text: string
    /** По умолчанию 'discount' */
    type?: 'discount' | 'info'
}

export interface OrderInfo {
    weight?: string
    deliveryPrice?: string
    totalPrice?: string
    /**
     * Если массив пустой, то убирает все элементы.
     * Поле нужно для добавления дополнительных скидок.
     * Если с таким `id` уже существует, то заменяет его данные.
     * Если `type` будет `discount`, то `text` будет выводиться красным
     * */
    additional?: AdditionalPriceInfo[]
}
