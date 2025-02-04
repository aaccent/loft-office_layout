const intl = new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 })

export function formatPrice(price: number) {
    return intl.format(price)
}
