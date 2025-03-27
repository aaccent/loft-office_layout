import Swiper from 'swiper'
import { Navigation, Pagination } from 'swiper/modules'

void (function () {
    const yearsSlider = document.querySelector<HTMLElement>('.years-slider.swiper')
    if (!yearsSlider) return

    new Swiper(yearsSlider, {
        slidesPerView: 1,
        modules: [Navigation, Pagination],
        navigation: {
            prevEl: '.years-slider__navigation-prev',
            nextEl: '.years-slider__navigation-next',
        },
        pagination: {
            el: '.years-slider__pagination',
            // renderBullet: function (index, className = 'years-slider__pagination-part') {
            //     return '<span class="' + className + '"></span>'
            // },
        },
    })
})()
