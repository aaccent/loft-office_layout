import Swiper from 'swiper'
import { Pagination, EffectFade } from 'swiper/modules'

new Swiper('.product-card .swiper', {
    createElements: true,
    slidesPerView: 'auto',
    effect: 'fade',
    pagination: {
        enabled: true,
        modifierClass: 'slider-pagination-',
        bulletClass: 'slider-pagination-bullet',
        bulletActiveClass: 'slider-pagination-bullet-active',
    },
    modules: [Pagination, EffectFade],
})
