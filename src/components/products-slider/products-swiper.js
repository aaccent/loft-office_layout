import Swiper from 'swiper'
import { Navigation } from 'swiper/modules'

new Swiper('.products-slider .swiper', {
    slidesPerView: 4,
    spaceBetween: 20,
    modules: [Navigation],
    navigation: {
        nextEl: '.products-slider__navigation-next',
        prevEl: '.products-slider__navigation-prev',
    },
})
