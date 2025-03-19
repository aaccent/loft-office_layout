import Swiper from 'swiper'
import { EffectFade, Navigation, Pagination, Thumbs } from 'swiper/modules'

const thumb = new Swiper('.product-hero__thumb-slider', {
    slideToClickedSlide: true,
    slidesPerView: 4,
    spaceBetween: 10,
})

new Swiper('.product-hero__main-slider', {
    slidesPerView: 1,
    effect: 'fade',
    createElements: true,
    pagination: {
        enabled: true,
        modifierClass: 'slider-pagination-',
        bulletClass: 'slider-pagination-bullet',
        bulletActiveClass: 'slider-pagination-bullet-active',
    },
    modules: [EffectFade, Pagination],
    breakpoints: {
        1000: {
            pagination: false,
            createElements: false,
            navigation: {
                prevEl: '.product-hero__thumb-slider-button--prev',
                nextEl: '.product-hero__thumb-slider-button--next',
            },
            thumbs: {
                swiper: thumb,
            },
            modules: [EffectFade, Thumbs, Navigation],
        },
    },
})
