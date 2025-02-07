interface Product {
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

interface CartInfo {
    totalPrice?: number
    discountPrice?: number
    deliveryPrice?: string
    weight?: number
}

interface Cart {
    /** Добавляет элементы в корзину, если элемент с таким id уже есть, то заменяет его новыми данными */
    addItems(list: Product[]): void
    /** Убирает элемент из корзины по id. Если элемента с таким id нет - ничего не происходит */
    removeItem(id: Product['id']): void
    /** Очищает корзину */
    clear(): void
    /** Выставляет цену в корзине */
    setInfo(info: CartInfo): void
}

export { Product, CartInfo, Cart }
