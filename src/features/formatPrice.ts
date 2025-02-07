const intl = new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 })

export function formatPrice(rawPrice: number | string) {
    const price = Number(rawPrice)
    return intl.format(price)
}
