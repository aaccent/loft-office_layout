import Swiper from 'swiper'
import { Navigation } from 'swiper/modules'
import { formatPrice } from 'features/formatPrice'

void (function () {
    const productsSlider = document.querySelector('.products-slider .swiper')
    if (!productsSlider) return

    new Swiper(productsSlider, {
        slidesPerView: 4,
        spaceBetween: 20,
        modules: [Navigation],
        navigation: {
            nextEl: '.products-slider__navigation-next',
            prevEl: '.products-slider__navigation-prev',
        },
    })

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
