import Swiper from 'swiper'
import { EffectFade, Navigation, Pagination } from 'swiper/modules'

void (function () {
    const projectsSlider = document.querySelector<HTMLElement>('.projects-slider.swiper')
    if (!projectsSlider) return

    new Swiper(projectsSlider, {
        modules: [Navigation, Pagination, EffectFade],
        slidesPerView: 1,
        loop: true,
        effect: 'fade',
        fadeEffect: {
            crossFade: true,
        },

        pagination: {
            el: '.projects-slider__pagination',
            renderBullet: function (index, className) {
                return '<span class="' + className + '"></span>'
            },
        },
        navigation: {
            nextEl: '.projects-slider__navigation-next',
            prevEl: '.projects-slider__navigation-prev',
        },
    })
})()
