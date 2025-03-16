import Swiper from 'swiper'
import { Navigation } from 'swiper/modules'

new Swiper('.slider-section__list-wrapper', {
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
            slidesPerView: 3,
        },
    },
})
