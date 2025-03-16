import Swiper from 'swiper'
import { EffectFade, Navigation, Pagination, Thumbs } from 'swiper/modules'

const thumbSlider = new Swiper('.collection-hero__thumb-slider', {
    spaceBetween: 10,
    slidesPerGroup: 4,
    slidesPerView: 4,
    slideToClickedSlide: true,
    modules: [Navigation],
})

new Swiper('.collection-hero__main-slider', {
    effect: 'fade',
    thumbs: {
        swiper: thumbSlider,
    },
    navigation: {
        prevEl: '.collection-hero__thumb-slider-button.swiper-button-prev',
        nextEl: '.collection-hero__thumb-slider-button.swiper-button-next',
    },
    modules: [EffectFade, Thumbs, Navigation],
    on: {
        slideChange(swiper) {
            swiper.el.querySelector('.collection-hero__point.active')?.classList.remove('active')
        },
    },
})

new Swiper('.collection-hero__mobile-slider', {
    slidesPerView: 1,
    effect: 'fade',
    pagination: {
        enabled: true,
        modifierClass: 'slider-pagination-',
        bulletClass: 'slider-pagination-bullet',
        bulletActiveClass: 'slider-pagination-bullet-active',
    },
    createElements: true,
    modules: [Pagination, EffectFade],
})
