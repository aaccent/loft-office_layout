import Swiper from 'swiper'
import { Navigation } from 'swiper/modules'

document.querySelectorAll<HTMLElement>('.slider-section__list-wrapper').forEach((section) => {
    const isProducts = Boolean(section.querySelector('.product-card'))
    const slidesPerView = isProducts ? 4 : 3

    new Swiper(section, {
        spaceBetween: 16,
        slidesPerView: 1.1,
        modules: [Navigation],
        navigation: {
            prevEl: '.slider-section__button--prev',
            nextEl: '.slider-section__button--next',
        },
        breakpoints: {
            1000: {
                spaceBetween: 20,
                slidesPerView,
            },
        },
    })
})
