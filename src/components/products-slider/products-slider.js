import { formatPrice } from 'features/formatPrice'

// TODO: Remove all scripts
void (function () {
    const productsSlider = document.querySelector('.products-slider .swiper')
    if (!productsSlider) return

    const prices = productsSlider.querySelectorAll('.products-slider__item-price')
    prices.forEach((price) => {
        const value = price.textContent
        price.textContent = formatPrice(value)
    })

    const colors = document.querySelectorAll('.products-slider__item-color')
    colors.forEach((color) => {
        if (color.textContent.length <= 12) return
        color.textContent = color.textContent.slice(0, 12) + '...'
    })

    const titles = document.querySelectorAll('.products-slider__item-title')
    titles.forEach((title) => {
        if (title.textContent.length <= 27) return
        title.textContent = title.textContent.slice(0, 27) + '...'
    })
})()
